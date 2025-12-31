
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, uploadBanner } from '../services/supabaseClient';
import { Affiliate, LoanService, Partner, BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
  initialAffiliates: Affiliate[];
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, initialAffiliates, onRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<'affiliates' | 'loans' | 'partners' | 'blog'>('affiliates');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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
    }
  }, [isAuthenticated, activeSection]);

  const fetchLoanServices = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data } = await supabase.from('loan_services').select('*').order('order_index', { ascending: true });
      if (data && data.length > 0) {
        setLoanServices(data);
      } else {
        setLoanServices(defaultLoans);
      }
    } catch (err) { 
      console.error(err); 
      setLoanServices(defaultLoans);
    }
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
      if (data && data.length > 0) {
        setBlogPosts(data);
      } else {
        setBlogPosts(BLOG_POSTS);
      }
    } catch (err) { 
        console.error(err); 
        setBlogPosts(BLOG_POSTS);
    }
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
      name: 'Novo Produto',
      link: '',
      banner_url: '',
      active: true,
      position: 'center'
    };
    setAffiliates([newItem, ...affiliates]);
  };

  const handleAddPartner = () => {
    const newItem: Partner = {
      id: `new-partner-${Date.now()}`,
      name: 'Novo Parceiro',
      logo_url: '',
      link: '',
      active: true
    };
    setPartners([newItem, ...partners]);
  };

  const handleAddLoan = () => {
    const newItem: LoanService = {
      id: `new-loan-${Date.now()}`,
      title: 'Novo Serviço de Crédito',
      description: 'Destaque (ex: Taxa 1.2%)',
      image_url: '',
      icon: 'fa-hand-holding-dollar',
      active: true
    };
    setLoanServices([newItem, ...loanServices]);
  };

  const handleAddBlogPost = () => {
    const newItem: BlogPost = {
      id: Date.now(),
      title: 'Novo Artigo NB',
      excerpt: 'Breve resumo do artigo para o blog...',
      category: 'Geral',
      // Fix: 'Short' changed to 'short' to match valid Intl.DateTimeFormatOptions type.
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: '',
      content: 'Escreva o conteúdo completo aqui...',
      author: 'Equipe NB Empreende',
      readTime: '5 min'
    };
    setBlogPosts([newItem, ...blogPosts]);
  };

  const handleDeleteItem = async (id: any, table: 'affiliates' | 'loan_services' | 'partners' | 'blog_posts') => {
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
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (id: any, file: File, type: 'affiliate' | 'loan' | 'partner' | 'blog') => {
    setUploadingId(id);
    const url = await uploadBanner(file);
    if (url) {
      if (type === 'affiliate') {
        setAffiliates(prev => prev.map(a => a.id === id ? { ...a, banner_url: url } : a));
      } else if (type === 'partner') {
        setPartners(prev => prev.map(p => p.id === id ? { ...p, logo_url: url } : p));
      } else if (type === 'loan') {
        setLoanServices(prev => prev.map(a => a.id === id ? { ...a, image_url: url } : a));
      } else if (type === 'blog') {
        setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, image: url } : b));
      }
    }
    setUploadingId(null);
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
        alert("Configuração do Supabase não detectada. As alterações não serão persistidas no banco de dados.");
        return;
    }
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
        await supabase.from('affiliates').upsert(payload);
        onRefresh();
      } else if (activeSection === 'partners') {
        const payload = partners.map(p => ({
          id: p.id.toString().startsWith('new-') ? crypto.randomUUID() : p.id,
          name: p.name,
          link: p.link,
          logo_url: p.logo_url,
          active: p.active ?? true
        }));
        await supabase.from('partners').upsert(payload);
        fetchPartners();
      } else if (activeSection === 'loans') {
        const payload = loanServices.map((l, index) => ({
          id: l.id.toString().startsWith('new-') ? crypto.randomUUID() : l.id,
          title: l.title,
          description: l.description,
          image_url: l.image_url,
          icon: l.icon || 'fa-hand-holding-dollar',
          active: l.active,
          order_index: index
        }));
        await supabase.from('loan_services').upsert(payload);
        fetchLoanServices();
      } else if (activeSection === 'blog') {
        const payload = blogPosts.map(b => ({
            ...b,
            id: b.id.toString().length > 10 ? b.id : b.id // Mantém ID numérico ou uuid se necessário
        }));
        await supabase.from('blog_posts').upsert(payload);
        fetchBlogPosts();
      }
      alert("Sucesso! As alterações foram salvas.");
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
            <div className="flex bg-gray-100 p-1 rounded-xl mt-4 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveSection('affiliates')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === 'affiliates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Produtos/Banners</button>
              <button onClick={() => setActiveSection('partners')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === 'partners' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Parceiros (Logos)</button>
              <button onClick={() => setActiveSection('loans')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === 'loans' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>Página Empréstimos</button>
              <button onClick={() => setActiveSection('blog')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === 'blog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Blog (Artigos)</button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if(activeSection === 'affiliates') handleAddAffiliate();
                else if(activeSection === 'partners') handleAddPartner();
                else if(activeSection === 'loans') handleAddLoan();
                else if(activeSection === 'blog') handleAddBlogPost();
              }}
              className={`px-8 py-4 rounded-2xl font-black text-sm shadow-lg flex items-center space-x-2 text-white ${activeSection === 'loans' ? 'bg-green-600' : activeSection === 'blog' ? 'bg-indigo-600' : 'bg-blue-600'}`}
            >
              <i className="fas fa-plus"></i> 
              <span>Novo {activeSection === 'affiliates' ? 'Produto' : activeSection === 'partners' ? 'Parceiro' : activeSection === 'loans' ? 'Serviço' : 'Artigo'}</span>
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-400 w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* BLOG SECTION */}
          {activeSection === 'blog' && blogPosts.map((post) => (
            <div key={post.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-inner group">
                        {post.image ? <img src={post.image} className="w-full h-full object-cover" alt={post.title} /> : <div className="flex h-full items-center justify-center text-gray-400"><i className="fas fa-image text-3xl"></i></div>}
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(post.id, e.target.files[0], 'blog')} />
                            <span className="bg-white px-4 py-2 rounded-xl text-xs font-black uppercase">{uploadingId === post.id ? 'Subindo...' : 'Trocar Imagem'}</span>
                        </label>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <button onClick={() => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, isUrgent: !p.isUrgent } : p))} className={`py-2 rounded-xl text-[9px] font-black uppercase border transition ${post.isUrgent ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-100'}`}>Urgente</button>
                        <button onClick={() => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, isFeatured: !p.isFeatured } : p))} className={`py-2 rounded-xl text-[9px] font-black uppercase border transition ${post.isFeatured ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-400 border-gray-100'}`}>Destaque</button>
                    </div>
                </div>
                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" value={post.title} onChange={(e) => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, title: e.target.value } : p))} className="col-span-2 w-full bg-white px-5 py-3 rounded-xl font-black border text-gray-800" placeholder="Título do Artigo" />
                        <input type="text" value={post.category} onChange={(e) => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, category: e.target.value } : p))} className="w-full bg-white px-5 py-3 rounded-xl font-bold border text-xs" placeholder="Categoria" />
                        <input type="text" value={post.author} onChange={(e) => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, author: e.target.value } : p))} className="w-full bg-white px-5 py-3 rounded-xl font-bold border text-xs" placeholder="Autor" />
                    </div>
                    <textarea value={post.excerpt} onChange={(e) => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, excerpt: e.target.value } : p))} className="w-full bg-white px-5 py-3 rounded-xl text-sm border min-h-[80px]" placeholder="Breve resumo (Excerpt)"></textarea>
                    <textarea value={post.content} onChange={(e) => setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, content: e.target.value } : p))} className="w-full bg-white px-5 py-3 rounded-xl text-sm border min-h-[200px]" placeholder="Conteúdo completo (Use ### para subtítulos)"></textarea>
                    <div className="flex justify-end">
                        <button onClick={() => handleDeleteItem(post.id, 'blog_posts')} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition">Excluir Artigo</button>
                    </div>
                </div>
              </div>
            </div>
          ))}

          {/* SESSÕES ANTERIORES - REPLICADAS */}
          {activeSection === 'loans' && loanServices.map((item) => (
            <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4">
                  <div className="relative aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-inner border-4 border-white group/img">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <i className="fas fa-image text-4xl"></i>
                        <span className="text-[10px] font-black uppercase">Sem Imagem</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'loan')} />
                      <div className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-xl transform group-hover/img:scale-110 transition-transform">
                        {uploadingId === item.id ? <i className="fas fa-spinner animate-spin"></i> : 'Trocar Foto'}
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Título do Card</label>
                      <input type="text" value={item.title} onChange={(e) => setLoanServices(prev => prev.map(l => l.id === item.id ? { ...l, title: e.target.value } : l))} className="w-full bg-white px-5 py-4 rounded-2xl font-black border-2 border-transparent focus:border-green-600 outline-none text-gray-800" placeholder="Ex: Aposentados & INSS" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Destaque / Taxas (Ex: 1.2%)</label>
                      <input type="text" value={item.description} onChange={(e) => setLoanServices(prev => prev.map(l => l.id === item.id ? { ...l, description: e.target.value } : l))} className="w-full bg-white px-5 py-4 rounded-2xl font-bold border-2 border-transparent focus:border-green-600 outline-none text-gray-600" placeholder="Taxa 1.2%" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${item.active ? 'bg-green-500 border-green-500' : 'bg-gray-100 border-gray-200'}`}>
                        <input type="checkbox" className="hidden" checked={item.active} onChange={(e) => setLoanServices(prev => prev.map(l => l.id === item.id ? { ...l, active: e.target.checked } : l))} />
                        {item.active && <i className="fas fa-check text-white text-[10px]"></i>}
                      </div>
                      <span className="text-xs font-black uppercase text-gray-700">Ativo</span>
                    </label>
                    <button onClick={() => handleDeleteItem(item.id, 'loan_services')} className="text-red-500 hover:scale-125 transition">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeSection === 'affiliates' && affiliates.map((item) => (
              <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-3">
                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner border-2 border-white">
                      {item.banner_url ? <img src={item.banner_url} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center"><i className="fas fa-image text-gray-400"></i></div>}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'affiliate')} />
                        <span className="bg-white px-4 py-2 rounded-xl text-xs font-black uppercase">{uploadingId === item.id ? '...' : 'Trocar Banner'}</span>
                      </label>
                    </div>
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <input type="text" value={item.name} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, name: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl font-bold border" placeholder="Nome do Produto" />
                    <input type="text" value={item.link} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, link: e.target.value } : a))} className="w-full bg-white px-4 py-3 rounded-xl text-xs text-blue-600 border" placeholder="Link (Checkout/Compra)" />
                  </div>
                  <div className="lg:col-span-3 flex flex-col gap-4">
                    <select value={item.position} onChange={(e:any) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, position: e.target.value } : a))} className="bg-white border p-3 rounded-xl text-xs font-bold">
                      <option value="center">📌 Banner Centro</option>
                      <option value="left">⬅️ Lateral Esquerda</option>
                      <option value="right">⬆️ Lateral Direita</option>
                    </select>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.active} onChange={(e) => setAffiliates(prev => prev.map(a => a.id === item.id ? { ...a, active: e.target.checked } : a))} />
                        <span className="text-[10px] font-black uppercase">Ativo</span>
                      </label>
                      <button onClick={() => handleDeleteItem(item.id, 'affiliates')} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </div>
                </div>
              </div>
          ))}

          {activeSection === 'partners' && partners.map((item) => (
              <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-3">
                    <div className="aspect-square w-24 bg-gray-200 rounded-3xl overflow-hidden relative border-2 border-white mx-auto">
                      {item.logo_url ? <img src={item.logo_url} className="w-full h-full object-contain p-4" /> : <div className="flex h-full items-center justify-center"><i className="fas fa-handshake text-gray-400"></i></div>}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                        <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(item.id, e.target.files[0], 'partner')} />
                        <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">Logo</span>
                      </label>
                    </div>
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <input type="text" value={item.name} onChange={(e) => setPartners(prev => prev.map(p => p.id === item.id ? { ...p, name: e.target.value } : p))} className="w-full bg-white px-4 py-3 rounded-xl font-bold border" placeholder="Nome do Parceiro" />
                    <input type="text" value={item.link} onChange={(e) => setPartners(prev => prev.map(p => p.id === item.id ? { ...p, link: e.target.value } : p))} className="w-full bg-white px-4 py-3 rounded-xl text-xs border" placeholder="Link do Site" />
                  </div>
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={item.active} onChange={(e) => setPartners(prev => prev.map(p => p.id === item.id ? { ...p, active: e.target.checked } : p))} />
                        <span className="text-[10px] font-black uppercase">Ativo</span>
                      </label>
                      <button onClick={() => handleDeleteItem(item.id, 'partners')} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="mt-16 flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className={`bg-gray-900 text-white px-16 py-6 rounded-[2rem] font-black text-xl shadow-2xl disabled:opacity-50 transition active:scale-95 flex items-center gap-4 ${isSaving ? 'bg-gray-700' : ''}`}>
            {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
            <span>{isSaving ? 'Salvando...' : 'Salvar Todas as Alterações'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
