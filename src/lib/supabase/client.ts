import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // In browser context, we might not want to throw and crash the whole app immediately, 
    // but the client won't work anyway.
    console.error('Supabase URL and Key are missing!')
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}
