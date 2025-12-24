
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import AIConsultant from './components/AIConsultant';
import MemberArea from './components/MemberArea';
import AdminPanel from './components/AdminPanel';
import { BlogPost, CalculatorType, Affiliate, Partner } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

// Páginas
import CalculatorsHub from './components/CalculatorsHub';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ToolDetailPage from './components/ToolDetailPage';
import PrivacyPage from './components/PrivacyPage';
import BlogPage from './components/BlogPage';
import LoanPage from './components/LoanPage';

type View = 'home' | 'blog' | 'calculators' | 'tool-detail' | 'about' | 'contact' | 'privacy' | 'loan';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedTool, setSelectedTool] = useState<CalculatorType>(CalculatorType.TAX);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showMemberArea, setShowMemberArea] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      const validViews: View[] = ['home', 'blog', 'calculators', 'tool-detail', 'about', 'contact', 'privacy', 'loan'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
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

  const fetchContent = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [affs, parts] = await Promise.all([
        supabase.from('affiliates').select('*'),
        supabase.from('partners').select('*') // Removido .eq('active', true) para garantir que apareçam mesmo se o campo estiver null
      ]);
      if (affs.data) setAffiliates(affs.data as Affiliate[]);
      if (parts.data) setPartners(parts.data as Partner[]);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const banners = useMemo(() => {
    const active = affiliates.filter(a => a.active && a.banner_url);
    return {
      left: active.filter(a => a.position === 'left'),
      right: active.filter(a => a.position === 'right'),
      center: active.filter(a => a.position === 'center' && !closedBanners.has(a.id)),
      allActive: active
    };
  }, [affiliates, closedBanners]);

  const toggleBannerClosed = (id: string) => {
    setClosedBanners(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSelectTool={(t) => { setSelectedTool(t); navigateTo(t === CalculatorType.LOAN ? 'loan' : 'tool-detail'); }} onSelectConsultant={() => {}} />
            
            {/* Parceiros - Logos de Empresas */}
            <section className="py-12 bg-white">
               <div className="max-w-6xl mx-auto px-4 text-center">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10">Nossos Parceiros</h3>
                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {partners.length > 0 ? (
                      partners.map(p => (
                        <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="h-6 md:h-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                           <img src={p.logo_url} alt={p.name} className="h-full object-contain" />
                        </a>
                      ))
                    ) : (
                      <div className="text-[9px] font-bold text-gray-200 uppercase">Aguardando Parceiros...</div>
                    )}
                  </div>
               </div>
            </section>

            {/* Banner Central - Estilo Reduzido e "Compre Agora" */}
            {banners.center.length > 0 && (
              <div className="max-w-xl mx-auto px-4 mb-12 space-y-6">
                {banners.center.map(b => (
                  <div key={b.id} className="relative group animate-fadeIn">
                    <div className="absolute -top-3 left-4 z-30 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      <i className="fas fa-shopping-cart mr-1"></i> COMPRE AGORA
                    </div>
                    <button onClick={() => toggleBannerClosed(b.id)} className="absolute -top-3 -right-3 z-40 bg-white shadow-md text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-lg border-2 border-white aspect-video md:aspect-[3/1] bg-gray-50">
                      <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {/* Seus cards de ferramentas aqui... */}
            </div>

            <BlogSection onReadPost={setSelectedPost} />
            <AIConsultant />
          </>
        );
      case 'blog': return <BlogPage onReadPost={setSelectedPost} />;
      case 'calculators': return <CalculatorsHub onSelectTool={(t) => { setSelectedTool(t); navigateTo('tool-detail'); }} />;
      case 'tool-detail': return <ToolDetailPage toolType={selectedTool} onToolChange={setSelectedTool} />;
      case 'loan': return <LoanPage />;
      case 'about': return <AboutPage />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100 bg-white">
      <Header 
        onSelectTool={() => {}} 
        onSelectBlog={() => navigateTo('blog')} 
        onSelectConsultant={() => {}} 
        onOpenMemberArea={() => setShowMemberArea(true)}
        onNavigate={navigateTo}
        onOpenAdmin={() => setShowAdmin(true)}
        currentView={currentView}
      />
      
      <div className="flex-grow flex relative">
        {/* Laterais com banners pequenos e padronizados */}
        <aside className="hidden lg:block fixed left-6 top-1/4 bottom-1/4 w-24 z-40 overflow-hidden pointer-events-none">
          <div className="flex flex-col gap-4 animate-scrollDown pointer-events-auto py-10">
            {(banners.left.length > 0 ? [...banners.left, ...banners.left] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white hover:scale-110 transition-all bg-white group relative">
                <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                   <span className="text-[7px] font-black text-white uppercase text-center leading-tight px-1">Ver<br/>Oferta</span>
                </div>
              </a>
            ))}
          </div>
        </aside>

        <main className="flex-grow min-w-0 lg:mx-36">
          {renderContent()}

          {/* Mobile Carrossel - Tamanho Reduzido */}
          {banners.allActive.length > 0 && (
            <div className="lg:hidden bg-gray-50 py-10 border-t border-gray-100 overflow-hidden">
               <div className="max-w-5xl mx-auto px-4">
                  <h3 className="text-[10px] font-black text-gray-400 mb-6 text-center uppercase tracking-[0.3em]">Sugestões de Compra</h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                    {banners.allActive.map(b => (
                      <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" className="min-w-[120px] h-[120px] rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0 relative">
                        <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full">OFERTA</div>
                      </a>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </main>

        <aside className="hidden lg:block fixed right-6 top-1/4 bottom-1/4 w-24 z-40 overflow-hidden pointer-events-none">
          <div className="flex flex-col gap-4 animate-scrollUp pointer-events-auto py-10">
            {(banners.right.length > 0 ? [...banners.right, ...banners.right] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white hover:scale-110 transition-all bg-white group relative">
                <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                   <span className="text-[7px] font-black text-white uppercase text-center leading-tight">Loja</span>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </div>

      {showMemberArea && <MemberArea onClose={() => setShowMemberArea(false)} />}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); fetchContent(); }} initialAffiliates={affiliates} onRefresh={fetchContent} />}
      
      {/* Footer... */}
    </div>
  );
};

export default App;
