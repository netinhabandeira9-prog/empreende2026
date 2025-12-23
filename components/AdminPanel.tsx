
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
      await supabase.from('affiliates').delete().eq('id', id);
      setAffiliates(affiliates.filter(a => a.id !== id));
      onRefresh();
    } catch (err) { alert("Erro ao excluir."); }
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
      const payload = affiliates.map(a => ({
        name: a.name,
        link: a.link,
        banner_url: a.banner_url,
        active: a.active,
        position: a.position,
        ...(a.id.startsWith('new-') ? {} : { id: a.id })
      }));
      const { error: upsertError } = await supabase.from('affiliates').upsert(payload);
      if (upsertError) throw upsertError;
      alert("Salvo com sucesso!");
      onRefresh();
      onClose();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally { setIsSaving(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-6 text-center text-gray-900">Admin Empreende</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100" />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100" />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">Entrar</button>
            <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-sm">Voltar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 overflow-y-auto p-4 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black text-gray-900">Configurar Banners</h2>
          <div className="flex gap-4">
            <button onClick={handleAddAffiliate} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm">Novo Banner</button>
            <button onClick={onClose} className="text-gray-400"><i className="fas fa-times text-2xl"></i></button>
          </div>
        </div>

        <div className="space-y-6">
          {affiliates.map((item) => (
            <div key={item.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3">
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group cursor-pointer">
                    {item.banner_url ? <img src={item.banner_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[10px] font-black uppercase text-gray-400 tracking-widest">Sem Imagem</div>}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0])} />
                      <span className="text-white text-[10px] font-black uppercase">{uploadingId === item.id ? 'Subindo...' : 'Trocar'}</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <input type="text" value={item.name} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, name: e.target.value } : a))} className="w-full bg-transparent font-black border-b border-gray-200 outline-none" placeholder="Nome" />
                  <input type="text" value={item.link} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, link: e.target.value } : a))} className="w-full bg-transparent text-sm text-blue-600 border-b border-gray-100 outline-none" placeholder="Link do Afiliado" />
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-2">
                   <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Posição</span>
                      <select 
                        value={item.position} 
                        onChange={(e: any) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, position: e.target.value } : a))}
                        className="bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="left">Esquerda (Desce)</option>
                        <option value="right">Direita (Sobe)</option>
                        <option value="center">Centro (Fechar)</option>
                      </select>
                   </div>
                   <div className="flex flex-col justify-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.active} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))} />
                        <span className="text-[10px] font-black uppercase">Ativo</span>
                      </label>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 text-[10px] font-black uppercase">Excluir</button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end pt-8 border-t border-gray-100">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl disabled:opacity-50">
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
