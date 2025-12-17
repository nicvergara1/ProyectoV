import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase con Service Role para operaciones del servidor
 * que necesitan bypassear RLS (Row Level Security)
 *
 * IMPORTANTE: Solo usar en código del servidor (API routes, no en cliente)
 * El service role tiene acceso completo a la base de datos
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role credentials')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
