
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
  if (!supabase) {
    console.error("Supabase não inicializado.");
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    // Nome limpo sem caracteres especiais
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    // Salvando na raiz do bucket para evitar problemas com permissões de pasta
    const filePath = fileName;

    const { error: uploadError, data } = await supabase.storage
      .from('banners')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Erro detalhado do Supabase Storage:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage.from('banners').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Erro inesperado no upload:", err);
    return null;
  }
};
