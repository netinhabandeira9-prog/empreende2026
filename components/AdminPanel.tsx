
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, uploadBanner } from '../services/supabaseClient';
import { Affiliate } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  initialAffiliates: Affiliate[];
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, initialAffiliates, onRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'empreende2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Login ou senha incorretos.');
    }
  };

  const handleAddAffiliate = () => {
    const newItem: Affiliate = {
      id: `new-${Date.now()}`,
      name: 'Novo Afiliado',
      link: '',
      banner_url: '',
      active: true
    };
    setAffiliates([newItem, ...affiliates]);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('new-')) {
      setAffiliates(affiliates.filter(a => a.id !== id));
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este afiliado permanentemente?")) return;

    try {
      const { error: delError } = await supabase.from('affiliates').delete().eq('id', id);
      if (delError) throw delError;
      setAffiliates(affiliates.filter(a => a.id !== id));
      onRefresh();
    } catch (err) {
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem é muito grande! Use arquivos de até 2MB.");
      return;
    }

    setUploadingId(id);
    const url = await uploadBanner(file);
    
    if (url) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
    } else {
      alert("Falha no upload. Verifique as Policies do Storage no Supabase.");
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase não configurado corretamente no ambiente.");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Separamos os dados para garantir que campos extras não quebrem o banco
      const payload = affiliates.map(a => {
        const item: any = {
          name: a.name,
          link: a.link,
          banner_url: a.banner_url,
          active: a.active
        };
        // Só incluímos o ID se ele já existir no banco (não começar com "new-")
        if (!a.id.startsWith('new-')) {
          item.id = a.id;
        }
        return item;
      });

      console.log("Tentando salvar payload:", payload);

      const { data, error: upsertError } = await supabase
        .from('affiliates')
        .upsert(payload, { onConflict: 'id' });

      if (upsertError) {
        console.error("Erro detalhado do Supabase:", upsertError);
        // Erro 42703 geralmente significa coluna faltando (ex: coluna 'name')
        if (upsertError.code === '42703') {
           throw new Error("Coluna faltando no banco de dados. Verifique se a coluna 'name' existe na tabela 'affiliates'.");
        }
        throw upsertError;
      }

      alert("Sucesso! Todos os banners e links foram salvos.");
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Falha no salvamento:", err);
      setError(err.message || "Erro ao conectar com o banco de dados.");
      alert("Erro ao salvar: " + (err.message || "Verifique o console (F12)"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-6 text-center text-gray-900">Admin Empreende</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 text-gray-900" />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 text-gray-900" />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition">Acessar Painel</button>
            <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-sm font-bold">Voltar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 overflow-y-auto p-4 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Gerenciador de Banners</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Crie, Edite ou Remova Ofertas</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAddAffiliate} className="bg-green-100 text-green-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-green-200 transition">
              <i className="fas fa-plus mr-2"></i> Adicionar Novo
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition"><i className="fas fa-times text-2xl"></i></button>
          </div>
        </div>

        <div className="space-y-6">
          {affiliates.map((item) => (
            <div key={item.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative group animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3">
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner">
                    {item.banner_url ? (
                      <img src={item.banner_url} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold uppercase tracking-widest">Sem Imagem</div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0])}
                      />
                      <i className="fas fa-cloud-upload-alt text-white text-2xl mb-2"></i>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">
                        {uploadingId === item.id ? 'Subindo...' : 'Alterar Imagem'}
                      </span>
                    </label>
                    {uploadingId === item.id && (
                       <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                          <i className="fas fa-spinner animate-spin text-blue-600 text-3xl"></i>
                       </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, name: e.target.value } : a))}
                    className="w-full bg-transparent font-black text-lg border-b border-gray-200 focus:border-blue-600 outline-none text-gray-900"
                    placeholder="Nome da Plataforma/Oferta"
                  />
                  <input 
                    type="text" 
                    value={item.link} 
                    onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, link: e.target.value } : a))}
                    className="w-full bg-transparent text-sm text-blue-600 border-b border-gray-100 focus:border-blue-600 outline-none"
                    placeholder="https://link-de-afiliado.com"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col items-end gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={item.active} 
                      onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))}
                      className="w-8 h-4 bg-gray-200 rounded-full appearance-none checked:bg-green-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4"
                    />
                    <span className="ml-2 text-[10px] font-black uppercase text-gray-400">{item.active ? 'On' : 'Off'}</span>
                  </label>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors text-sm font-bold flex items-center">
                    <i className="fas fa-trash-alt mr-1"></i> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}

          {affiliates.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhum afiliado cadastrado.</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
          <p className="text-xs text-gray-400 font-medium italic">As alterações só entram no site após clicar em Salvar.</p>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition"
          >
            {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
