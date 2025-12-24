
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, uploadBanner } from '../services/supabaseClient';
import { Affiliate, LoanService } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  initialAffiliates: Affiliate[];
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, initialAffiliates, onRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<'affiliates' | 'loans'>('affiliates');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && activeSection === 'loans') {
      fetchLoanServices();
    }
  }, [isAuthenticated, activeSection]);

  const fetchLoanServices = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('loan_services').select('*').order('order_index', { ascending: true });
      if (data) setLoanServices(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

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

  const handleAddLoanService = () => {
    const newItem: LoanService = {
      id: `new-loan-${Date.now()}`,
      title: 'Nova Modalidade',
      description: 'Descrição breve',
      image_url: '',
      icon: 'fa-hand-holding-dollar',
      active: true,
      order_index: loanServices.length
    };
    setLoanServices([...loanServices, newItem]);
  };

  const handleDeleteAffiliate = async (id: string) => {
    if (id.startsWith('new-')) {
      setAffiliates(affiliates.filter(a => a.id !== id));
      return;
    }
    if (!confirm("Excluir banner permanentemente?")) return;
    try {
      await supabase.from('affiliates').delete().eq('id', id);
      setAffiliates(affiliates.filter(a => a.id !== id));
      onRefresh();
    } catch (err) { console.error(err); }
  };

  const handleDeleteLoan = async (id: string) => {
    if (id.startsWith('new-')) {
      setLoanServices(loanServices.filter(a => a.id !== id));
      return;
    }
    if (!confirm("Excluir modalidade de empréstimo permanentemente?")) return;
    try {
      await supabase.from('loan_services').delete().eq('id', id);
      setLoanServices(loanServices.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (id: string, file: File, type: 'affiliate' | 'loan') => {
    setUploadingId(id);
    const url = await uploadBanner(file);
    if (url) {
      if (type === 'affiliate') {
        setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
      } else {
        setLoanServices(prev => prev.map(a => a.id === id ? { ...a, image_url: url } : a));
      }
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeSection === 'affiliates') {
        const payload = affiliates.map(a => ({
          id: a.id.toString().startsWith('new-') ? crypto.randomUUID() : a.id,
          name: a.name,
          link: a.link,
          banner_url: a.banner_url,
          active: a.active,
          position: a.position || 'center'
        }));
        const { error } = await supabase.from('affiliates').upsert(payload);
        if (error) throw error;
        onRefresh();
      } else {
        const payload = loanServices.map((l, index) => ({
          id: l.id.toString().startsWith('new-') ? crypto.randomUUID() : l.id,
          title: l.title,
          description: l.description,
          image_url: l.image_url,
          icon: l.icon,
          active: l.active,
          order_index: index
        }));
        const { error } = await supabase.from('loan_services').upsert(payload);
        if (error) throw error;
      }
      
      alert("Alterações salvas com sucesso!");
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
            <h2 className="text-3xl font-black text-gray-900">Painel Admin</h2>
            <p className="text-gray-400 text-sm mt-2">Gestão Empreende 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-blue-600 transition" />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-blue-600 transition" />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition">Entrar</button>
            <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-xs font-bold uppercase">Sair</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl overflow-y-auto p-4 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Gestão de Conteúdo</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl mt-4">
              <button 
                onClick={() => setActiveSection('affiliates')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'affiliates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Banners Laterais
              </button>
              <button 
                onClick={() => setActiveSection('loans')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'loans' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Página Empréstimos
              </button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={activeSection === 'affiliates' ? handleAddAffiliate : handleAddLoanService}
              className={`px-8 py-4 rounded-2xl font-black text-sm shadow-lg flex items-center space-x-2 text-white ${activeSection === 'affiliates' ? 'bg-blue-600' : 'bg-green-600'}`}
            >
              <i className="fas fa-plus"></i> 
              <span>{activeSection === 'affiliates' ? 'Novo Banner' : 'Nova Modalidade'}</span>
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-400 w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {activeSection === 'affiliates' ? (
            affiliates.map((item) => (
              <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-3">
                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner border-2 border-white">
                      {item.banner_url ? (
                        <img src={item.banner_url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                          <i className="fas fa-image text-2xl"></i>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer backdrop-blur-sm">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'affiliate')} />
                        <div className="bg-white px-6 py-2 rounded-xl text-gray-900 text-[10px] font-black uppercase">
                          {uploadingId === item.id ? 'Subindo...' : 'Trocar Foto'}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <input type="text" value={item.name} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, name: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl font-bold border border-gray-100 outline-none" placeholder="Nome" />
                    <input type="text" value={item.link} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, link: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl text-xs text-blue-600 border border-gray-100" placeholder="Link do Afiliado" />
                  </div>
                  <div className="lg:col-span-3 flex flex-col gap-4">
                    <select value={item.position} onChange={(e:any) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, position: e.target.value } : a))} className="bg-white border p-3 rounded-xl text-xs font-bold">
                      <option value="center">📌 Centro</option>
                      <option value="left">⬇️ Esquerda</option>
                      <option value="right">⬆️ Direita</option>
                    </select>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.active} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))} />
                        <span className="text-[10px] font-black uppercase">Ativo</span>
                      </label>
                      <button onClick={() => handleDeleteAffiliate(item.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            loanServices.map((item) => (
              <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-3">
                    <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner border-2 border-white">
                      {item.image_url ? (
                        <img src={item.image_url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 text-center p-4">
                          <i className="fas fa-camera text-2xl"></i>
                          <span className="text-[9px] font-black uppercase">Foto da Categoria</span>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer backdrop-blur-sm">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'loan')} />
                        <div className="bg-white px-6 py-2 rounded-xl text-gray-900 text-[10px] font-black uppercase text-center">
                          {uploadingId === item.id ? 'Subindo...' : 'Trocar Foto'}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                       <input type="text" value={item.icon} onChange={(e) => setLoanServices(prev => prev.map(a => a.id === item.id ? { ...a, icon: e.target.value } : a))} className="col-span-1 bg-white px-4 py-3 rounded-xl font-bold border text-center" placeholder="fa-icon" />
                       <input type="text" value={item.title} onChange={(e) => setLoanServices(prev => prev.map(a => a.id === item.id ? { ...a, title: e.target.value } : a))} className="col-span-3 bg-white px-4 py-3 rounded-xl font-bold border" placeholder="Título da Modalidade" />
                    </div>
                    <textarea value={item.description} onChange={(e) => setLoanServices(prev => prev.map(a => a.id === item.id ? { ...a, description: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl text-xs border min-h-[80px]" placeholder="Breve descrição ou categoria (ex: Carteira Assinada)" />
                  </div>
                  <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.active} onChange={(e) => setLoanServices(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))} />
                        <span className="text-[10px] font-black uppercase">Exibir no Carrossel</span>
                      </label>
                    </div>
                    <button onClick={() => handleDeleteLoan(item.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition">Excluir Modalidade</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-16 pt-10 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className="bg-gray-900 text-white px-16 py-5 rounded-[2rem] font-black text-xl shadow-2xl disabled:opacity-50 active:scale-95 transition">
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
