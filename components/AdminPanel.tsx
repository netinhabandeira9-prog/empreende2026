
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
      active: true,
      position: 'center'
    };
    setAffiliates([newItem, ...affiliates]);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('new-')) {
      setAffiliates(affiliates.filter(a => a.id !== id));
      return;
    }
    if (!confirm("Excluir permanentemente?")) return;
    try {
      const { error } = await supabase.from('affiliates').delete().eq('id', id);
      if (error) throw error;
      setAffiliates(affiliates.filter(a => a.id !== id));
      onRefresh();
    } catch (err: any) { alert("Erro ao excluir: " + err.message); }
  };

  const handleFileUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const url = await uploadBanner(file);
    if (url) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = affiliates.map(a => {
        const item: any = {
          name: a.name,
          link: a.link,
          banner_url: a.banner_url,
          active: a.active,
          position: a.position || 'center'
        };
        if (!a.id.startsWith('new-')) {
          item.id = a.id;
        }
        return item;
      });

      const { error: upsertError } = await supabase.from('affiliates').upsert(payload);
      
      if (upsertError) {
        if (upsertError.message.includes('position')) {
          throw new Error("A coluna 'position' não foi encontrada no banco. Você executou o comando SQL sugerido?");
        }
        throw upsertError;
      }
      
      alert("Configurações salvas com sucesso!");
      onRefresh();
      onClose();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally { setIsSaving(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl">
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <i className="fas fa-lock text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900">Acesso Restrito</h2>
            <p className="text-gray-400 text-sm mt-2">Área Administrativa Empreende2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Usuário</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-blue-600 transition" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-blue-600 transition" />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition active:scale-95">Autenticar</button>
            <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-xs font-bold uppercase tracking-widest">Sair do Painel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl overflow-y-auto p-4 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Gestão de Publicidade</h2>
            <p className="text-gray-500 mt-2 italic">Dica: Adicione a coluna 'position' no seu SQL Editor do Supabase para funcionar.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAddAffiliate} className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 flex items-center space-x-2 active:scale-95 transition">
              <i className="fas fa-plus"></i>
              <span>Novo Banner</span>
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-400 w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm active:scale-90">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {affiliates.map((item) => (
            <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3">
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner group-hover:shadow-xl transition-all duration-500 border-2 border-white">
                    {item.banner_url ? (
                      <img src={item.banner_url} className="w-full h-full object-cover" alt="Banner Preview" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <i className="fas fa-image text-2xl"></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">Sem Imagem</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0])} />
                      <div className="bg-white px-6 py-2 rounded-xl text-gray-900 text-[10px] font-black uppercase">
                        {uploadingId === item.id ? 'Processando...' : 'Alterar Banner'}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Título/Identificação</label>
                    <input type="text" value={item.name} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, name: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl font-bold border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 transition" placeholder="Nome do Afiliado" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Link de Destino</label>
                    <input type="text" value={item.link} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, link: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl text-xs text-blue-600 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-600 transition" placeholder="https://..." />
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col md:flex-row lg:flex-col gap-6">
                   <div className="flex-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-2">Exibição & Posicionamento</label>
                      <select 
                        value={item.position || 'center'} 
                        onChange={(e: any) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, position: e.target.value } : a))}
                        className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm font-black text-gray-700 outline-none focus:ring-2 focus:ring-blue-600 appearance-none shadow-sm"
                      >
                        <option value="center">📌 Centro (Fechável / Pop-up)</option>
                        <option value="left">⬇️ Esquerda (Cai de cima)</option>
                        <option value="right">⬆️ Direita (Sobe de baixo)</option>
                      </select>
                   </div>
                   <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full transition-colors relative ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                           <input type="checkbox" className="hidden" checked={item.active} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))} />
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-900">{item.active ? 'Visível' : 'Oculto'}</span>
                      </label>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 transition">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-xs italic">Salve suas alterações para aplicar no site em tempo real.</p>
          <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto bg-blue-600 text-white px-16 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/20 disabled:opacity-50 hover:bg-blue-700 transition active:scale-95">
            {isSaving ? (
              <span className="flex items-center space-x-3">
                <i className="fas fa-spinner animate-spin"></i>
                <span>Gravando Dados...</span>
              </span>
            ) : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
