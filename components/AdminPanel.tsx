
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { AffiliateConfig } from '../App';

interface AdminPanelProps {
  onClose: () => void;
  onSave: (config: AffiliateConfig) => void;
  currentConfig: AffiliateConfig;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSave, currentConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<AffiliateConfig>(currentConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'empreende2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Login ou senha incorretos.');
    }
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      setError("Erro: Variáveis SUPABASE_URL ou SUPABASE_ANON_KEY não encontradas na Vercel.");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = (Object.entries(config) as [string, any][]).map(([id, data]) => ({
        id,
        link: data.link,
        banner_url: data.bannerUrl,
        active: data.active
      }));

      const { error: supabaseError } = await supabase
        .from('affiliates')
        .upsert(payload, { onConflict: 'id' });

      if (supabaseError) throw supabaseError;

      onSave(config);
      alert("Configurações salvas no Supabase com sucesso!");
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar no Supabase:", err);
      setError("Falha ao salvar no banco de dados. Verifique se a tabela 'affiliates' existe.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl animate-fadeIn">
          <h2 className="text-2xl font-black mb-6 text-center text-gray-900">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-1">Usuário</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-1">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-gray-400">Cancelar</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 overflow-y-auto p-4 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 italic">Gestão de Afiliados</h2>
            <div className="flex items-center mt-1 space-x-2">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sincronizado via Supabase</p>
              {!isSupabaseConfigured && (
                <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">OFFLINE</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition-colors"><i className="fas fa-times text-2xl"></i></button>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl mb-8 flex items-start space-x-4">
            <i className="fas fa-exclamation-circle text-amber-500 text-xl mt-1"></i>
            <div>
              <h4 className="text-amber-900 font-black text-sm uppercase">Configuração Pendente na Vercel</h4>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                As variáveis de ambiente <strong>SUPABASE_URL</strong> e <strong>SUPABASE_ANON_KEY</strong> ainda não foram detectadas. Adicione-as nas configurações do projeto na Vercel e faça um novo deploy para ativar a sincronização.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {(['amazon', 'mercadolivre', 'shopee'] as const).map((platform) => (
            <section key={platform} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    platform === 'amazon' ? 'bg-orange-100 text-orange-600' :
                    platform === 'mercadolivre' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <i className={`fab fa-${platform === 'mercadolivre' ? 'handshake' : platform} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-black capitalize">{platform === 'mercadolivre' ? 'Mercado Livre' : platform}</h3>
                </div>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-xs font-black uppercase text-gray-400">{config[platform].active ? 'Ativo' : 'Inativo'}</span>
                  <input 
                    type="checkbox" 
                    checked={config[platform].active} 
                    onChange={(e) => setConfig({...config, [platform]: {...config[platform], active: e.target.checked}})}
                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none checked:bg-blue-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Link de Afiliado</label>
                  <input 
                    type="text" 
                    value={config[platform].link}
                    onChange={(e) => setConfig({...config, [platform]: {...config[platform], link: e.target.value}})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">URL do Banner (Imagem)</label>
                  <input 
                    type="text" 
                    value={config[platform].bannerUrl}
                    onChange={(e) => setConfig({...config, [platform]: {...config[platform], bannerUrl: e.target.value}})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </section>
          ))}

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold text-sm border border-red-100">{error}</div>}

          <div className="flex justify-end pt-8">
            <button 
              onClick={handleSave}
              disabled={isSaving || !isSupabaseConfigured}
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition flex items-center space-x-3 disabled:opacity-30 active:scale-95"
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Salvar no Supabase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
