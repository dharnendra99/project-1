import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if real Supabase credentials are configured
export const isSupabaseConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20

// Use placeholder values if not configured to prevent createClient from crashing
const url = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co'
const key = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = createClient(url, key)
