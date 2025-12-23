
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Faz o upload de uma imagem para o bucket 'banners'
 */
export const uploadBanner = async (file: File): Promise<string | null> => {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('banners')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Erro no upload:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
  return data.publicUrl;
};
