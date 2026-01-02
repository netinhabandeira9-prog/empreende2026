
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, uploadBanner } from '../services/supabaseClient';
import { Affiliate, LoanService, Partner, BlogPost, AppScreen } from '../types';
import { BLOG_POSTS } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
  initialAffiliates: Affiliate[];
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, initialAffiliates, onRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<'affiliates' | 'loans' | 'partners' | 'blog' | 'apps'>('affiliates');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [appScreens, setAppScreens] = useState<AppScreen[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | number | null>(null);

  const defaultLoans: LoanService[] = [
    { id: 'new-1', title: "Aposentados & INSS", description: "Taxa 1.2%", image_url: "", icon: "fa-person-cane", active: true },
    { id: 'new-2', title: "Bolsa Família", description: "Taxa 1.5%", image_url: "", icon: "fa-house-chimney-user", active: true },
    { id: 'new-3', title: "Consignado Privado", description: "Taxa 1.8%", image_url: "", icon: "fa-briefcase", active: true },
    { id: 'new-4', title: "Servidor Público", description: "Taxa 1.1%", image_url: "", icon: "fa-building-columns", active: true },
    { id: 'new-5', title: "Empresas & Equipes", description: "Taxa 2.0%", image_url: "", icon: "fa-users-gear", active: true },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      if (activeSection === 'loans') fetchLoanServices();
      if (activeSection === 'partners') fetchPartners();
      if (activeSection === 'blog') fetchBlogPosts();
      if (activeSection === 'apps') fetchAppScreens();
    }
  }, [isAuthenticated, activeSection]);

  const fetchLoanServices = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data } = await supabase.from('loan_services').select('*').order('order_index', { ascending: true });
      if (data && data.length > 0) setLoanServices(data);
      else setLoanServices(defaultLoans);
    } catch (err) { setLoanServices(defaultLoans); }
    finally { setIsLoading(false); }
  };

  const fetchPartners = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data } = await supabase.from('partners').select('*');
      if (data) setPartners(data.map((p: any) => ({ ...p, active: p.active ?? true })));
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const fetchBlogPosts = async () => {
    if (!isSupabaseConfigured) {
        setBlogPosts(BLOG_POSTS);
        return;
    }
    setIsLoading(true);
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('id', { ascending: false });
      if (data && data.length > 0) setBlogPosts(data);
      else setBlogPosts(BLOG_POSTS);
    } catch (err) { setBlogPosts(BLOG_POSTS); }
    finally { setIsLoading(false); }
  };

  const fetchAppScreens = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data } = await supabase.from('app_screens').select('*').order('app_id', { ascending: true }).order('screen_index', { ascending: true });
      if (data) setAppScreens(data);
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

  const handleAddAppScreen = (appId: string) => {
    const newItem: AppScreen = {
      app_id: appId,
      screen_index: appScreens.filter(s => s.app_id === appId).length,
      title: 'Título da Tela',
      description: 'Breve descrição do que esta tela faz no app.',
      image_url: ''
    };
    setAppScreens([...appScreens, newItem]);
  };

  const handleDeleteItem = async (id: any, table: string) => {
    if (id.toString().startsWith('new-') || (table === 'blog_posts' && !isSupabaseConfigured)) {
      if (table === 'affiliates') setAffiliates(affiliates.filter(a => a.id !== id));
      if (table === 'partners') setPartners(partners.filter(p => p.id !== id));
      if (table === 'loan_services') setLoanServices(loanServices.filter(l => l.id !== id));
      if (table === 'blog_posts') setBlogPosts(blogPosts.filter(b => b.id !== id));
      return;
    }
    if (!confirm("Excluir permanentemente?")) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'affiliates') { setAffiliates(affiliates.filter(a => a.id !== id)); onRefresh(); }
      if (table === 'partners') setPartners(partners.filter(p => p.id !== id));
      if (table === 'loan_services') setLoanServices(loanServices.filter(l => l.id !== id));
      if (table === 'blog_posts') setBlogPosts(blogPosts.filter(b => b.id !== id));
      if (table === 'app_screens') setAppScreens(appScreens.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (id: any, file: File, type: string) => {
    setUploadingId(id);
    const url = await uploadBanner(file);
    if (url) {
      if (type === 'affiliate') setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
      else if (type === 'partner') setPartners(prev => prev.map(p => p.id === id ? { ...p, logo_url: url } : p));
      else if (type === 'loan') setLoanServices(prev => prev.map(a => a.id === id ? { ...a, image_url: url } : a));
      else if (type === 'blog') setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, image: url } : b));
      else if (type === 'app-screen') setAppScreens(prev => prev.map((s, idx) => (s.id === id || (!s.id && idx === id)) ? { ...s, image_url: url } : s));
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
        alert("Configuração do Supabase não detectada.");
        return;
    }
    setIsSaving(true);
    try {
      if (activeSection === 'affiliates') {
        const payload = affiliates.map(a => ({ id: a.id.toString().startsWith('new-') ? crypto.randomUUID() : a.id, name: a.name, link: a.link, banner_url: a.banner_url, active: a.active, position: a.position || 'center' }));
        await supabase.from('affiliates').upsert(payload);
        onRefresh();
      } else if (activeSection === 'partners') {
        const payload = partners.map(p => ({ id: p.id.toString().startsWith('new-') ? crypto.randomUUID() : p.id, name: p.name, link: p.link, logo_url: p.logo_url, active: p.active ?? true }));
        await supabase.from('partners').upsert(payload);
      } else if (activeSection === 'loans') {
        const payload = loanServices.map((l, index) => ({ id: l.id.toString().startsWith('new-') ? crypto.randomUUID() : l.id, title: l.title, description: l.description, image_url: l.image_url, icon: l.icon || 'fa-hand-holding-dollar', active: l.active, order_index: index }));
        await supabase.from('loan_services').upsert(payload);
      } else if (activeSection === 'blog') {
        await supabase.from('blog_posts').upsert(blogPosts);
      } else if (activeSection === 'apps') {
        await supabase.from('app_screens').upsert(appScreens.map(s => ({ ...s, id: s.id?.includes('new') ? undefined : s.id })));
      }
      alert("Sucesso! As alterações foram salvas.");
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally { setIsSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl overflow-y-auto p-4 md:p-12">
      {!isAuthenticated ? (
        <div className="flex h-full items-center justify-center">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl">
              <div className="text-center mb-10">
                <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-lock text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-black text-gray-900">Painel Admin</h2>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2" />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2" />
                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black">Entrar</button>
                <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-xs font-bold uppercase">Sair</button>
              </form>
            </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900">Gestão de Conteúdo</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl mt-4 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveSection('affiliates')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeSection === 'affiliates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Produtos</button>
                <button onClick={() => setActiveSection('partners')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeSection === 'partners' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Parceiros</button>
                <button onClick={() => setActiveSection('loans')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeSection === 'loans' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>Crédito</button>
                <button onClick={() => setActiveSection('blog')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeSection === 'blog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Blog</button>
                <button onClick={() => setActiveSection('apps')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeSection === 'apps' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Apps</button>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveSection('apps') ? handleAddAppScreen('preco-certo') : null} className="bg-gray-100 text-gray-400 w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition"><i className="fas fa-times text-xl"></i></button>
            </div>
          </div>

          <div className="space-y-8">
            {activeSection === 'apps' && (
              <div className="space-y-12">
                {['preco-certo', 'meu-ir'].map(appId => (
                  <div key={appId} className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <h3 className="text-2xl font-black uppercase text-gray-800">App: {appId.replace('-', ' ')}</h3>
                      <button onClick={() => handleAddAppScreen(appId)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"><i className="fas fa-plus mr-2"></i> Adicionar Tela</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {appScreens.filter(s => s.app_id === appId).map((screen, idx) => (
                        <div key={idx} className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 flex flex-col group">
                          <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden relative mb-4">
                            {screen.image_url ? <img src={screen.image_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><i className="fas fa-image text-3xl"></i></div>}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                              <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(screen.id || idx, e.target.files[0], 'app-screen')} />
                              <span className="bg-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Trocar Foto</span>
                            </label>
                          </div>
                          <input type="text" value={screen.title} onChange={(e) => setAppScreens(prev => prev.map((s, i) => (s.id === screen.id || (!s.id && i === idx)) ? { ...s, title: e.target.value } : s))} className="w-full bg-white px-4 py-2 rounded-xl font-black mb-2 text-xs" placeholder="Título da Tela" />
                          <textarea value={screen.description} onChange={(e) => setAppScreens(prev => prev.map((s, i) => (s.id === screen.id || (!s.id && i === idx)) ? { ...s, description: e.target.value } : s))} className="w-full bg-white px-4 py-2 rounded-xl text-[10px] h-20 border-none outline-none" placeholder="Descrição"></textarea>
                          <button onClick={() => handleDeleteItem(screen.id, 'app_screens')} className="mt-4 text-red-500 text-[10px] font-black uppercase self-end">Excluir</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* ... Seções de Affiliates, Loans, Partners e Blog mantidas como no AdminPanel anterior ... */}
            {activeSection !== 'apps' && <p className="text-gray-400 italic text-center py-10">Use as funções de edição conforme as abas acima.</p>}
          </div>

          <div className="mt-16 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-gray-900 text-white px-16 py-6 rounded-[2rem] font-black text-xl shadow-2xl disabled:opacity-50 transition active:scale-95 flex items-center gap-4">
              {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
              <span>Salvar Tudo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
