import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import AIConsultant from './components/AIConsultant';
import AdminPanel from './components/AdminPanel';
import { BlogPost, CalculatorType, Affiliate, Partner, View } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { BLOG_POSTS as STATIC_BLOG_POSTS } from './constants';

// Páginas
import CalculatorsHub from './components/CalculatorsHub';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ToolDetailPage from './components/ToolDetailPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import BlogPage from './components/BlogPage';
import LoanPage from './components/LoanPage';
import SonoScorePage from './components/SonoScorePage';
import AppsPage from './components/AppsPage';
import AppDetailPage from './components/AppDetailPage';

const FALLBACK_AFFILIATES: Affiliate[] = [
  { id: 'f1', name: 'Contabilidade MEI', link: '#', banner_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400', active: true, position: 'left' },
  { id: 'f2', name: 'Gestão Digital', link: '#', banner_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', active: true, position: 'right' },
  { id: 'f3', name: 'Curso Reforma 2026', link: '#', banner_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800', active: true, position: 'center' }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedTool, setSelectedTool] = useState<CalculatorType>(CalculatorType.TAX);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>('preco-certo');
  const [showAdmin, setShowAdmin] = useState(false);
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());

  useEffect(() => {
    const titles: Record<string, string> = {
      home: "NB Empreende | Início - Guia do MEI 2026",
      blog: "Blog Editorial NB | Notícias Reforma Tributária 2026",
      calculators: "Central de Calculadoras MEI e Autônomo",
      loan: "Simulador de Crédito Confia | Empréstimos 2026",
      'sono-score': "Performance & Sono para Empreendedores",
      apps: "Nossos Apps & Ferramentas | Ecossistema NB",
      'app-detail': "NB Preço Certo | Sua Câmera é seu Precificador",
      about: "Sobre a NB Empreende - Nossa Missão",
      contact: "Seja nosso Parceiro - NB Empreende 2026",
      privacy: "Política de Privacidade - NB Empreende",
      terms: "Termos de Uso - NB Empreende"
    };
    document.title = titles[currentView as string] || "NB Empreende 2026";
  }, [currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      const validViews: string[] = ['home', 'blog', 'calculators', 'tool-detail', 'about', 'contact', 'privacy', 'terms', 'loan', 'sono-score', 'apps', 'app-detail'];
      if (validViews.includes(hash)) {
        setCurrentView(hash as View);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: View) => {
    window.location.hash = view;
  };

  const scrollToConsultant = () => {
    const el = document.getElementById('consultant');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchContent = async () => {
    if (!isSupabaseConfigured) {
      setAffiliates(FALLBACK_AFFILIATES);
      setBlogPosts(STATIC_BLOG_POSTS);
      return;
    }
    
    // Fetch Affiliates
    try {
      const { data } = await supabase.from('affiliates').select('*');
      setAffiliates(data && data.length > 0 ? data : FALLBACK_AFFILIATES);
    } catch (e) { setAffiliates(FALLBACK_AFFILIATES); }

    // Fetch Partners
    try {
      const { data } = await supabase.from('partners').select('*');
      if (data) setPartners(data.filter((p: any) => p.logo_url && p.active !== false));
    } catch (e) { console.error("Erro parceiros", e); }

    // Fetch Blog
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('id', { ascending: false });
      setBlogPosts(data && data.length > 0 ? data : STATIC_BLOG_POSTS);
    } catch (e) { setBlogPosts(STATIC_BLOG_POSTS); }
  };

  useEffect(() => { fetchContent(); }, []);

  const banners = useMemo(() => {
    const active = affiliates.filter(a => a.active && a.banner_url);
    return {
      left: active.filter(a => a.position === 'left'),
      right: active.filter(a => a.position === 'right'),
      center: active.filter(a => a.position === 'center' && !closedBanners.has(a.id)),
      allActive: active
    };
  }, [affiliates, closedBanners]);

  const renderSidebarBanner = (b: Affiliate, i: number) => (
    <a 
      key={`${b.id}-${i}`} 
      href={b.link} 
      target="_blank" 
      rel="sponsored noopener" 
      className="block w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-all bg-white group relative pointer-events-auto"
    >
      <img src={b.banner_url} alt={b.name} loading="lazy" className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded shadow-md">OFERTA</div>
    </a>
  );

  const repeatItems = (list: any[]) => {
    if (list.length === 0) return [];
    let items = [...list];
    while (items.length < 15) items = [...items, ...list];
    return items;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <main>
            <Hero 
              onSelectTool={(t) => { setSelectedTool(t); navigateTo(t === CalculatorType.LOAN ? 'loan' : 'tool-detail'); }} 
              onSelectConsultant={scrollToConsultant} 
            />
            
            <div className="lg:hidden w-full overflow-hidden bg-white border-y border-gray-100 py-6 mb-8 mask-linear-horizontal">
               <div className="flex gap-4 animate-scrollRight whitespace-nowrap w-max px-4">
                  {repeatItems(banners.allActive).map((b, i) => (
                    <a key={`mob-${b.id}-${i}`} href={b.link} target="_blank" rel="sponsored" className="inline-block w-40 h-40 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0">
                       <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                    </a>
                  ))}
               </div>
            </div>

            <section className="py-16 bg-white overflow-hidden">
               <div className="max-w-7xl mx-auto px-4 text-center">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Principais Parceiros Tecnológicos</h2>
                  <div className="relative overflow-hidden mask-linear-horizontal">
                    <div className="flex items-center gap-16 animate-infiniteScroll w-max py-8">
                      {repeatItems(partners).map((p, i) => (
                          <a key={`${p.id}-${i}`} href={p.link || '#'} target="_blank" rel="noopener" className="h-24 md:h-40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all flex items-center shrink-0">
                             <img src={p.logo_url} alt={p.name} loading="lazy" className="h-full w-auto object-contain" />
                          </a>
                      ))}
                    </div>
                  </div>
               </div>
            </section>

            {banners.center.length > 0 && (
              <div className="max-w-6xl mx-auto px-4 mb-16">
                 {banners.center.map(b => (
                    <div key={b.id} className="relative group">
                       <a href={b.link} target="_blank" rel="sponsored" className="block w-full h-48 md:h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                          <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                          <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Oferta NB Empreende</div>
                       </a>
                       <button onClick={() => setClosedBanners(prev => new Set(prev).add(b.id))} className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border text-gray-400 hover:text-red-500 transition">
                          <i className="fas fa-times"></i>
                       </button>
                    </div>
                 ))}
              </div>
            )}

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
               <button onClick={() => { setSelectedTool(CalculatorType.TAX); navigateTo('tool-detail'); }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 hover:-translate-y-1 transition text-left group">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition"><i className="fas fa-university text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">IBS & CBS 2026</h3><p className="text-[10px] text-gray-500">Imposto Transição.</p></div>
                </button>
                <button onClick={() => navigateTo('apps')} className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 flex items-center space-x-4 hover:-translate-y-1 transition text-left group">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white transition"><i className="fas fa-th-large text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Nossos Apps</h3><p className="text-[10px] text-gray-500">Ferramentas NB.</p></div>
                </button>
                <button onClick={() => navigateTo('loan')} className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100 flex items-center space-x-4 hover:-translate-y-1 transition text-left group">
                  <div className="bg-cyan-100 p-3 rounded-full text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white transition"><i className="fas fa-hand-holding-dollar text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Crédito Fácil</h3><p className="text-[10px] text-gray-500">NB & Confia.</p></div>
                </button>
                <button onClick={() => { setSelectedTool(CalculatorType.RETIREMENT); navigateTo('tool-detail'); }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 hover:-translate-y-1 transition text-left group">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition"><i className="fas fa-hourglass-half text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Previdência</h3><p className="text-[10px] text-gray-500">Regra de Pontos.</p></div>
                </button>
            </div>

            <BlogSection onReadPost={setSelectedPost} posts={blogPosts} />
            
            <AIConsultant />
          </main>
        );
      case 'blog': return <BlogPage onReadPost={setSelectedPost} posts={blogPosts} />;
      case 'calculators': return <CalculatorsHub onSelectTool={(t) => { setSelectedTool(t); navigateTo('tool-detail'); }} />;
      case 'tool-detail': return <ToolDetailPage toolType={selectedTool} onToolChange={setSelectedTool} />;
      case 'loan': return <LoanPage />;
      case 'sono-score': return <SonoScorePage />;
      case 'apps': return <AppsPage onSelectApp={(id) => { setSelectedAppId(id); navigateTo('app-detail'); }} />;
      case 'app-detail': return <AppDetailPage appId={selectedAppId} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      default: return null;
    }
  };

  const showWhatsAppSupport = ['home', 'apps', 'app-detail'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100 bg-slate-50 relative">
      <Header 
        onSelectTool={() => {}} 
        onSelectBlog={() => navigateTo('blog')} 
        onSelectConsultant={scrollToConsultant} 
        onNavigate={navigateTo}
        onOpenAdmin={() => setShowAdmin(true)}
        currentView={currentView}
      />
      
      <div className={`flex-grow flex relative ${currentView === 'sono-score' || currentView === 'app-detail' ? '' : ''}`}>
        <aside className="hidden lg:block fixed left-4 top-24 bottom-24 w-24 z-40 overflow-hidden pointer-events-none mask-linear-vertical" aria-hidden="true">
          <div className="flex flex-col gap-6 animate-scrollDown py-10">
            {repeatItems(banners.left).map((b, i) => renderSidebarBanner(b, i))}
          </div>
        </aside>

        <main id="main-content" className={`flex-grow min-w-0 ${currentView === 'sono-score' || currentView === 'app-detail' ? '' : 'lg:mx-32'}`}>
          {renderContent()}
        </main>

        <aside className="hidden lg:block fixed right-4 top-24 bottom-24 w-24 z-40 overflow-hidden pointer-events-none mask-linear-vertical" aria-hidden="true">
          <div className="flex flex-col gap-6 animate-scrollUp py-10">
            {repeatItems(banners.right).map((b, i) => renderSidebarBanner(b, i))}
          </div>
        </aside>
      </div>

      {showWhatsAppSupport && (
        <a 
          href="https://api.whatsapp.com/send?phone=5588994517595&text=Olá! Preciso de suporte."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[150] bg-green-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group animate-bounce"
          title="Suporte WhatsApp"
        >
          <i className="fab fa-whatsapp text-3xl"></i>
          <span className="absolute right-20 bg-white text-gray-900 text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border pointer-events-none">Suporte NB Ativo</span>
        </a>
      )}

      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); fetchContent(); }} initialAffiliates={affiliates} onRefresh={fetchContent} />}

      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 z-[130] bg-white w-10 h-10 rounded-full flex items-center justify-center border shadow-lg hover:bg-red-500 hover:text-white transition" aria-label="Fechar artigo">
              <i className="fas fa-times"></i>
            </button>
            <article className="text-left">
              <div className="h-64 md:h-80 relative">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="px-6 md:px-16 pb-16 -mt-16 relative">
                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 prose prose-slate max-w-none">
                  <header>
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPost.category}</span>
                      <time className="text-gray-400 text-xs font-bold">{selectedPost.date}</time>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{selectedPost.title}</h2>
                  </header>
                  
                  <div className="text-gray-700 leading-relaxed text-lg mb-10">
                    {selectedPost.content.split('\n').map((paragraph, idx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return <br key={idx} />;
                      if (trimmed.startsWith('###')) return <h3 key={idx} className="font-black text-gray-900 mt-10 mb-4">{trimmed.replace('###', '').trim()}</h3>;
                      return <p key={idx} className="mb-6">{trimmed}</p>;
                    })}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      <footer className={`${currentView === 'sono-score' || currentView === 'app-detail' ? 'bg-[#0f172a] border-t border-white/5' : 'bg-gray-900'} text-gray-400 py-20 transition-colors`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-10">
              <div className={`${currentView === 'sono-score' || currentView === 'app-detail' ? 'bg-indigo-600' : 'bg-blue-700'} p-2 rounded-lg`}><i className="fas fa-chart-line text-white"></i></div>
              <span className="text-2xl font-bold text-white tracking-tight">NB Empreende <span className={currentView === 'sono-score' || currentView === 'app-detail' ? 'text-indigo-400' : 'text-blue-700'}>2026</span></span>
            </div>
            
            <div className="flex justify-center gap-6 mb-12">
              <a href="https://www.instagram.com/nbempreende" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-pink-600 transition-colors" title="Instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://www.youtube.com/@nbempreende" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-600 transition-colors" title="YouTube">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="https://www.tiktok.com/@nbempreende" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-black transition-colors" title="TikTok">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
            </div>

            <nav className="flex flex-wrap justify-center gap-8 mb-12 text-[10px] font-black uppercase tracking-[0.2em]" aria-label="Navegação do rodapé">
              <button onClick={() => navigateTo('home')} className="hover:text-white transition">Início</button>
              <button onClick={() => navigateTo('apps')} className="hover:text-white transition">Nossos Apps</button>
              <button onClick={() => navigateTo('blog')} className="hover:text-white transition">Blog</button>
              <button onClick={() => navigateTo('calculators')} className="hover:text-white transition">Calculadoras</button>
              <button onClick={() => navigateTo('privacy')} className="hover:text-white transition">Privacidade</button>
              <button onClick={() => navigateTo('terms')} className="hover:text-white transition">Termos</button>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition">Seja Parceiro</button>
            </nav>
            <div className="pt-10 border-t border-gray-800 text-[10px] text-gray-500 max-w-2xl mx-auto">
              <p>&copy; 2026 NB Empreende - CNPJ 12.306.779/0001-57. Todo o conteúdo possui caráter educativo e informativo sobre a Reforma Tributária 2026.</p>
              <p className="mt-4 font-bold text-gray-600 uppercase">Ceará - Brasil</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;