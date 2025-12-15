import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Get the authorization header to verify admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's token to verify they're admin
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: isAdmin } = await userClient.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    })

    if (!isAdmin) {
      console.error('User is not admin:', user.id)
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client with service role for user management
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { action, ...data } = await req.json()
    console.log('Action:', action, 'Data:', JSON.stringify(data))

    switch (action) {
      case 'list': {
        // List all users
        const { data: users, error } = await adminClient.auth.admin.listUsers()
        if (error) {
          console.error('List users error:', error)
          throw error
        }

        // Get profiles for full names
        const { data: profiles } = await adminClient
          .from('profiles')
          .select('user_id, full_name')

        const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || [])

        // Get roles
        const { data: roles } = await adminClient
          .from('user_roles')
          .select('user_id, role')

        const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || [])

        const usersWithInfo = users.users.map(u => ({
          id: u.id,
          email: u.email,
          full_name: profileMap.get(u.id) || '',
          role: roleMap.get(u.id) || 'user',
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at
        }))

        return new Response(
          JSON.stringify({ users: usersWithInfo }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create': {
        const { email, password, full_name } = data
        
        if (!email || !password || !full_name) {
          return new Response(
            JSON.stringify({ error: 'Email, password and full_name are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create user
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true // Auto-confirm email
        })

        if (createError) {
          console.error('Create user error:', createError)
          throw createError
        }

        // Create profile
        const { error: profileError } = await adminClient
          .from('profiles')
          .insert({ user_id: newUser.user.id, full_name })

        if (profileError) {
          console.error('Create profile error:', profileError)
          // Rollback user creation
          await adminClient.auth.admin.deleteUser(newUser.user.id)
          throw profileError
        }

        // Add user role (default 'user')
        await adminClient
          .from('user_roles')
          .insert({ user_id: newUser.user.id, role: 'user' })

        console.log('User created successfully:', newUser.user.id)
        return new Response(
          JSON.stringify({ user: { id: newUser.user.id, email, full_name } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update': {
        const { user_id, email, password, full_name } = data

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: 'user_id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update auth user if email or password provided
        if (email || password) {
          const updateData: { email?: string; password?: string } = {}
          if (email) updateData.email = email
          if (password) updateData.password = password

          const { error } = await adminClient.auth.admin.updateUserById(user_id, updateData)
          if (error) {
            console.error('Update user error:', error)
            throw error
          }
        }

        // Update profile if full_name provided
        if (full_name) {
          const { error } = await adminClient
            .from('profiles')
            .update({ full_name })
            .eq('user_id', user_id)

          if (error) {
            console.error('Update profile error:', error)
            throw error
          }
        }

        console.log('User updated successfully:', user_id)
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete': {
        const { user_id } = data

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: 'user_id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Delete user (cascades to profiles and roles)
        const { error } = await adminClient.auth.admin.deleteUser(user_id)
        if (error) {
          console.error('Delete user error:', error)
          throw error
        }

        console.log('User deleted successfully:', user_id)
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error: unknown) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
