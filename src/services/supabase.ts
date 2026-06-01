import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean validation check
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('PASTE_MY_') && 
  !supabaseAnonKey.includes('PASTE_MY_');

export const isDemoMode = !isConfigured;

// Initialize actual Supabase client if configured, otherwise default to null
// The database context will seamlessly switch to simulated queries.
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

console.log(
  isDemoMode 
    ? '✦ Medora AI running in dynamic Local Demo Mode (Local Storage client fallback)' 
    : '✦ Medora AI successfully connected to active Supabase Cloud Backend'
);
