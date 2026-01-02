
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeSection]);

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data: aff } = await supabase.from('affiliates').select('*');
      if (aff) setAffiliates(aff);
      
      const { data: part } = await supabase.from('partners').select('*');
      if (part) setPartners(part);

      const { data: loans } = await supabase.from('loan_services').select('*').order('order_index', { ascending: true });
      if (loans) setLoanServices(loans);

      const { data: blog } = await supabase.from('blog_posts').select('*').order('id', { ascending: false });
      if (blog && blog.length > 0) setBlogPosts(blog);
      else setBlogPosts(BLOG_POSTS);

      const { data: apps } = await supabase.from('app_screens').select('*').order('app_id', { ascending: true }).order('screen_index', { ascending: true });
      if (apps) setAppScreens(apps);
    } catch (err) {
      console.error("Erro ao sincronizar com Supabase:", err);
    } finally {
      setIsLoading(false);
    }
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

  const handleAddItem = () => {
    const newId = `new-${Date.now()}`;
    if (activeSection === 'affiliates') {
      setAffiliates([{ id: newId, name: 'Novo Produto', link: '', banner_url: '', active: true, position: 'center' }, ...affiliates]);
    } else if (activeSection === 'partners') {
      setPartners([{ id: newId, name: 'Novo Parceiro', logo_url: '', link: '', active: true }, ...partners]);
    } else if (activeSection === 'loans') {
      setLoanServices([{ id: newId, title: 'Novo Serviço', description: '', image_url: '', icon: 'fa-money-bill', active: true, order_index: loanServices.length }, ...loanServices]);
    } else if (activeSection === 'blog') {
      setBlogPosts([{ id: Date.now(), title: 'Novo Artigo', excerpt: '', category: 'Geral', date: new Date().toLocaleDateString('pt-BR'), image: '', content: '' }, ...blogPosts]);
    }
  };

  const handleDelete = async (id: any, table: string) => {
    if (!confirm("Excluir permanentemente?")) return;
    if (!id.toString().startsWith('new-')) {
      await supabase.from(table).delete().eq('id', id);
    }
    fetchData();
  };

  const handleFileUpload = async (id: any, file: File, type: string) => {
    setUploadingId(id);
    const url = await uploadBanner(file);
    if (url) {
      if (type === 'affiliate') setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
      if (type === 'partner') setPartners(prev => prev.map(p => p.id === id ? { ...p, logo_url: url } : p));
      if (type === 'loan') setLoanServices(prev => prev.map(l => l.id === id ? { ...l, image_url: url } : l));
      if (type === 'blog') setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, image: url } : b));
      if (type === 'app-screen') setAppScreens(prev => prev.map((s, idx) => (s.id === id || (!s.id && idx === id)) ? { ...s, image_url: url } : s));
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) return;
    setIsSaving(true);
    try {
      const cleanId = (id: any) => id.toString().startsWith('new-') ? undefined : id;
      
      if (activeSection === 'affiliates') await supabase.from('affiliates').upsert(affiliates.map(a => ({...a, id: cleanId(a.id)})));
      if (activeSection === 'partners') await supabase.from('partners').upsert(partners.map(p => ({...p, id: cleanId(p.id)})));
      if (activeSection === 'loans') await supabase.from('loan_services').upsert(loanServices.map(l => ({...l, id: cleanId(l.id)})));
      if (activeSection === 'blog') await supabase.from('blog_posts').upsert(blogPosts);
      if (activeSection === 'apps') await supabase.from('app_screens').upsert(appScreens.map(s => ({...s, id: s.id?.includes('new') ? undefined : s.id})));
      
      alert("Salvo com sucesso!");
      fetchData();
      onRefresh();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl overflow-y-auto p-4 md:p-12">
      {!isAuthenticated ? (
        <div className="flex h-full items-center justify-center">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl">
              <h2 className="text-3xl font-black text-center mb-8">Admin Empreende</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border outline-none" />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border outline-none" />
                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">Entrar</button>
                <button type="button" onClick={onClose} className="w-full py-2 text-gray-400 text-xs font-bold uppercase">Sair</button>
              </form>
            </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] p-6 md:p-12 shadow-2xl relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar w-full md:w-auto">
              {(['affiliates', 'partners', 'loans', 'blog', 'apps'] as const).map(section => (
                <button key={section} onClick={() => setActiveSection(section)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === section ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                  {section === 'affiliates' ? 'Produtos' : section === 'partners' ? 'Parceiros' : section === 'loans' ? 'Crédito' : section === 'blog' ? 'Blog' : 'Apps'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {activeSection !== 'apps' && (
                <button onClick={handleAddItem} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"><i className="fas fa-plus mr-2"></i> Adicionar</button>
              )}
              <button onClick={onClose} className="bg-gray-100 text-gray-400 w-12 h-12 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
          </div>

          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center"><i className="fas fa-spinner animate-spin text-4xl text-blue-600"></i></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSection === 'affiliates' && affiliates.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-3xl border group">
                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative mb-4">
                      {item.banner_url ? <img src={item.banner_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><i className="fas fa-image text-2xl"></i></div>}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'affiliate')} />
                        <span className="bg-white text-[9px] font-black px-3 py-1 rounded-lg">Trocar Imagem</span>
                      </label>
                      {uploadingId === item.id && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><i className="fas fa-spinner animate-spin text-blue-600"></i></div>}
                    </div>
                    <input type="text" value={item.name} onChange={(e) => setAffiliates(affiliates.map(a => a.id === item.id ? {...a, name: e.target.value} : a))} className="w-full p-2 mb-2 bg-white rounded-lg text-xs font-bold" placeholder="Nome do Produto" />
                    <input type="text" value={item.link} onChange={(e) => setAffiliates(affiliates.map(a => a.id === item.id ? {...a, link: e.target.value} : a))} className="w-full p-2 mb-2 bg-white rounded-lg text-[10px]" placeholder="Link de Afiliado" />
                    <div className="flex justify-between items-center mt-4">
                      <button onClick={() => setAffiliates(affiliates.map(a => a.id === item.id ? {...a, active: !a.active} : a))} className={`text-[9px] font-black uppercase ${item.active ? 'text-green-600' : 'text-gray-400'}`}>{item.active ? 'Ativo' : 'Inativo'}</button>
                      <button onClick={() => handleDelete(item.id, 'affiliates')} className="text-red-500 text-[9px] font-black uppercase">Excluir</button>
                    </div>
                  </div>
                ))}

                {activeSection === 'partners' && partners.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-3xl border group">
                    <div className="h-24 bg-white rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center border">
                      {item.logo_url ? <img src={item.logo_url} className="max-h-full p-2 object-contain" /> : <i className="fas fa-handshake text-gray-200 text-3xl"></i>}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'partner')} />
                        <span className="bg-white text-[9px] font-black px-3 py-1 rounded-lg">Trocar Logo</span>
                      </label>
                    </div>
                    <input type="text" value={item.name} onChange={(e) => setPartners(partners.map(p => p.id === item.id ? {...p, name: e.target.value} : p))} className="w-full p-2 bg-white rounded-lg text-xs font-bold" />
                    <button onClick={() => handleDelete(item.id, 'partners')} className="mt-4 text-red-500 text-[9px] font-black uppercase">Excluir</button>
                  </div>
                ))}

                {activeSection === 'loans' && loanServices.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-3xl border group">
                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative mb-4">
                      {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><i className={`fas ${item.icon} text-3xl`}></i></div>}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'loan')} />
                        <span className="bg-white text-[9px] font-black px-3 py-1 rounded-lg">Trocar Foto</span>
                      </label>
                    </div>
                    <input type="text" value={item.title} onChange={(e) => setLoanServices(loanServices.map(l => l.id === item.id ? {...l, title: e.target.value} : l))} className="w-full p-2 bg-white rounded-lg text-xs font-bold" />
                    <button onClick={() => handleDelete(item.id, 'loan_services')} className="mt-4 text-red-500 text-[9px] font-black uppercase">Excluir</button>
                  </div>
                ))}

                {activeSection === 'blog' && blogPosts.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-3xl border group">
                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative mb-4">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><i className="fas fa-newspaper text-3xl"></i></div>}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'blog')} />
                        <span className="bg-white text-[9px] font-black px-3 py-1 rounded-lg">Capa</span>
                      </label>
                    </div>
                    <input type="text" value={item.title} onChange={(e) => setBlogPosts(blogPosts.map(b => b.id === item.id ? {...b, title: e.target.value} : b))} className="w-full p-2 bg-white rounded-lg text-xs font-bold mb-2" />
                    <button onClick={() => handleDelete(item.id, 'blog_posts')} className="text-red-500 text-[9px] font-black uppercase">Excluir Post</button>
                  </div>
                ))}

                {activeSection === 'apps' && (
                  <div className="col-span-full space-y-8">
                     {['preco-certo', 'meu-ir'].map(appId => (
                       <div key={appId} className="space-y-4">
                          <h3 className="text-lg font-black uppercase text-blue-600 border-b pb-2">Interface: {appId}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {appScreens.filter(s => s.app_id === appId).map((screen, idx) => (
                              <div key={screen.id || idx} className="bg-white p-3 rounded-2xl border group">
                                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden relative mb-2">
                                  {screen.image_url ? <img src={screen.image_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-300"><i className="fas fa-mobile-screen text-2xl"></i></div>}
                                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer">
                                    <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(screen.id || idx, e.target.files[0], 'app-screen')} />
                                    <span className="bg-white text-[8px] font-black px-2 py-1 rounded">Foto</span>
                                  </label>
                                </div>
                                <input type="text" value={screen.title} onChange={(e) => setAppScreens(prev => prev.map((s, i) => (s.id === screen.id || (!s.id && i === idx)) ? {...s, title: e.target.value} : s))} className="w-full p-1 text-[10px] border-none outline-none font-bold" />
                              </div>
                            ))}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="bg-gray-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl disabled:opacity-50 transition active:scale-95">
              {isSaving ? <i className="fas fa-spinner animate-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
              Salvar Tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
