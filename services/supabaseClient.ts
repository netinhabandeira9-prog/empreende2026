
import { createClient } from '@supabase/supabase-js';

// Na Vercel, estas variáveis devem ser configuradas exatamente com estes nomes
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Inicialização segura: se as chaves não existirem, o cliente não tentará conectar
// Isso evita erros fatais no carregamento inicial da página
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
