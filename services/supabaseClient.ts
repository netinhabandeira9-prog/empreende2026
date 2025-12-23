
import { createClient } from '@supabase/supabase-js';

/**
 * No Vite, variáveis expostas ao cliente DEVEM começar com VITE_.
 * Na Vercel, configure-as como VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
 */
// Fix: Accessing environment variables via process.env instead of import.meta.env to resolve 
// 'Property env does not exist on type ImportMeta' errors. 
// process.env is replaced at build-time by Vite's define configuration.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Inicialização segura
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
