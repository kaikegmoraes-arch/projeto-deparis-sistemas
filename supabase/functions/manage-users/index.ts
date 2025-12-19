import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('SITE_URL') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: userData, error: authError } = await userClient.auth.getUser()
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const { data: isAdmin, error: roleError } =
      await userClient.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' })

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: corsHeaders }
      )
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const body = await req.json()
    const { action } = body

    if (!['list', 'create', 'update', 'delete'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // LIST USERS
    if (action === 'list') {
      const { data: users, error } = await adminClient.auth.admin.listUsers()
      if (error) throw error

      const { data: roles } = await adminClient
        .from('user_roles')
        .select('user_id, role')

      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || [])

      const result = users.users.map(u => ({
        id: u.id,
        email: u.email,
        role: roleMap.get(u.id) ?? 'user',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      }))

      return new Response(JSON.stringify({ users: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // CREATE USER
    if (action === 'create') {
      const { email, password, role = 'user' } = body

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email e senha são obrigatórios' }),
          { status: 400, headers: corsHeaders }
        )
      }

      // Validate role
      if (!['user', 'admin'].includes(role)) {
        return new Response(
          JSON.stringify({ error: 'Tipo de conta inválido' }),
          { status: 400, headers: corsHeaders }
        )
      }

      const { data: created, error } =
        await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })

      if (error) throw error

      const userId = created.user.id

      // Insert role
      await adminClient.from('user_roles').insert({
        user_id: userId,
        role: role,
      })

      console.log(`User created: ${email} with role: ${role}`)

      return new Response(
        JSON.stringify({ id: userId, email, role }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // UPDATE USER
    if (action === 'update') {
      const { user_id, email, password, role } = body
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'user_id required' }),
          { status: 400, headers: corsHeaders }
        )
      }

      if (email || password) {
        await adminClient.auth.admin.updateUserById(user_id, {
          ...(email && { email }),
          ...(password && { password }),
        })
      }

      // Update role if provided
      if (role && ['user', 'admin'].includes(role)) {
        // Check if role exists
        const { data: existingRole } = await adminClient
          .from('user_roles')
          .select('id')
          .eq('user_id', user_id)
          .single()

        if (existingRole) {
          await adminClient
            .from('user_roles')
            .update({ role })
            .eq('user_id', user_id)
        } else {
          await adminClient
            .from('user_roles')
            .insert({ user_id, role })
        }
      }

      console.log(`User updated: ${user_id}`)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      )
    }

    // DELETE USER
    if (action === 'delete') {
      const { user_id } = body
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'user_id required' }),
          { status: 400, headers: corsHeaders }
        )
      }

      await adminClient.auth.admin.deleteUser(user_id)

      console.log(`User deleted: ${user_id}`)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unhandled action' }),
      { status: 500, headers: corsHeaders }
    )

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
