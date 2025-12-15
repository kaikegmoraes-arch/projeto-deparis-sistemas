import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * CORS RESTRITO
 * Ajuste SITE_URL no ambiente do Supabase
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('SITE_URL') ?? '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ❌ Bloqueia métodos indevidos
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 🔐 Header de autorização obrigatório
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    /**
     * CLIENTE DO USUÁRIO
     * Usa o JWT real enviado pelo frontend
     */
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

    const user = userData.user

    /**
     * 🔒 VERIFICA ADMIN
     * Função has_role SEGURA:
     * - sem _user_id
     * - usa auth.uid()
     */
    const { data: isAdmin, error: roleError } =
      await userClient.rpc('has_role', { _role: 'admin' })

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: corsHeaders }
      )
    }

    /**
     * CLIENTE ADMINISTRADOR
     * Service Role – apenas no backend
     */
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const body = await req.json()
    const { action } = body

    // 🔒 Validação explícita de ações permitidas
    if (!['list', 'create', 'update', 'delete'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: corsHeaders }
      )
    }

    /**
     * ============================
     * ACTION: LIST USERS
     * ============================
     */
    if (action === 'list') {
      const { data: users, error } = await adminClient.auth.admin.listUsers()
      if (error) throw error

      const { data: profiles } = await adminClient
        .from('profiles')
        .select('user_id, full_name')

      const { data: roles } = await adminClient
        .from('user_roles')
        .select('user_id, role')

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || [])
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || [])

      const result = users.users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: profileMap.get(u.id) ?? '',
        role: roleMap.get(u.id) ?? 'user',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      }))

      return new Response(JSON.stringify({ users: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    /**
     * ============================
     * ACTION: CREATE USER
     * ============================
     */
    if (action === 'create') {
      const { email, password, full_name } = body

      if (!email || !password || !full_name) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
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

      await adminClient.from('profiles').insert({
        user_id: userId,
        full_name,
      })

      await adminClient.from('user_roles').insert({
        user_id: userId,
        role: 'user',
      })

      return new Response(
        JSON.stringify({ id: userId, email, full_name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    /**
     * ============================
     * ACTION: UPDATE USER
     * ============================
     */
    if (action === 'update') {
      const { user_id, email, password, full_name } = body
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

      if (full_name) {
        await adminClient
          .from('profiles')
          .update({ full_name })
          .eq('user_id', user_id)
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      )
    }

    /**
     * ============================
     * ACTION: DELETE USER
     * ============================
     */
    if (action === 'delete') {
      const { user_id } = body
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'user_id required' }),
          { status: 400, headers: corsHeaders }
        )
      }

      await adminClient.auth.admin.deleteUser(user_id)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      )
    }

    // fallback (não deve chegar aqui)
    return new Response(
      JSON.stringify({ error: 'Unhandled action' }),
      { status: 500, headers: corsHeaders }
    )

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
