
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import AIConsultant from './components/AIConsultant';
import MemberArea from './components/MemberArea';
import AdminPanel from './components/AdminPanel';
import { BlogPost, CalculatorType, Affiliate } from './types';
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
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(true);

  // Monitora mudanças no Hash da URL para simular roteamento
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      const validViews: View[] = ['home', 'blog', 'calculators', 'tool-detail', 'about', 'contact', 'privacy', 'loan'];
      
      if (validViews.includes(hash)) {
        setCurrentView(hash);
        if (hash === 'loan') {
          setSelectedTool(CalculatorType.LOAN);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const titles: Record<string, string> = {
          home: 'Início | Empreende 2026',
          blog: 'Blog Editorial | Empreende 2026',
          calculators: 'Calculadoras | Empreende 2026',
          'tool-detail': 'Simulador | Empreende 2026',
          loan: 'Simulador de Crédito | Empreende 2026',
          about: 'Sobre Nós | Empreende 2026',
          contact: 'Contato | Empreende 2026',
          privacy: 'Privacidade | Empreende 2026'
        };
        document.title = titles[hash] || 'Empreende 2026';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: View) => {
    window.location.hash = view;
  };

  const fetchAffiliates = async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingAffiliates(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('affiliates').select('*');
      if (data) setAffiliates(data as Affiliate[]);
    } catch (err) { console.error(err); }
    finally { setIsLoadingAffiliates(false); }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const banners = useMemo(() => {
    const active = affiliates.filter(a => a.active && a.banner_url && a.banner_url.startsWith('http'));
    return {
      left: active.filter(a => (a.position || 'center') === 'left'),
      right: active.filter(a => (a.position || 'center') === 'right'),
      center: active.filter(a => (a.position || 'center') === 'center' && !closedBanners.has(a.id)),
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

  const navigateToTool = (tool: CalculatorType) => {
    setSelectedTool(tool);
    if (tool === CalculatorType.LOAN) {
      navigateTo('loan');
    } else {
      navigateTo('tool-detail');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSelectTool={navigateToTool} onSelectConsultant={() => navigateTo('home')} />
            
            {/* Banner Central */}
            {banners.center.length > 0 && (
              <div className="max-w-3xl mx-auto px-4 mt-8 mb-4 space-y-6">
                {banners.center.map(b => (
                  <div key={b.id} className="relative group animate-fadeIn">
                    <div className="absolute -top-3 left-6 z-30 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Parceiro Empreende
                    </div>
                    <button 
                      onClick={() => toggleBannerClosed(b.id)}
                      className="absolute -top-3 -right-3 z-40 bg-white shadow-xl text-gray-400 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-lg shadow-blue-500/5 border-2 border-white hover:border-blue-100 transition-all duration-500 aspect-[3/1] bg-gray-50">
                      <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <button onClick={() => navigateToTool(CalculatorType.TAX)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <i className="fas fa-university text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900 text-sm md:text-base">IBS & CBS 2026</h3><p className="text-[10px] md:text-xs text-gray-500">Impostos.</p></div>
                </button>
                <button onClick={() => navigateToTool(CalculatorType.VACATION)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                    <i className="fas fa-umbrella-beach text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900 text-sm md:text-base">Férias</h3><p className="text-[10px] md:text-xs text-gray-500">Cálculo trabalhador.</p></div>
                </button>
                <button onClick={() => navigateToTool(CalculatorType.LOAN)} className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-cyan-100 p-3 rounded-full text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition">
                    <i className="fas fa-hand-holding-dollar text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900 text-sm md:text-base">Empréstimos</h3><p className="text-[10px] md:text-xs text-gray-500">Crédito e Capital.</p></div>
                </button>
                <button onClick={() => navigateToTool(CalculatorType.RETIREMENT)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                    <i className="fas fa-hourglass-half text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900 text-sm md:text-base">Previdência</h3><p className="text-[10px] md:text-xs text-gray-500">Aposentadoria.</p></div>
                </button>
              </div>
            </div>
            <BlogSection onReadPost={setSelectedPost} />
            <AIConsultant />
          </>
        );
      case 'blog': return <BlogPage onReadPost={setSelectedPost} />;
      case 'calculators': return <CalculatorsHub onSelectTool={navigateToTool} />;
      case 'tool-detail': 
        return <ToolDetailPage toolType={selectedTool} onToolChange={navigateToTool} />;
      case 'loan':
        return <LoanPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPage />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100 relative">
      <Header 
        onSelectTool={navigateToTool} 
        onSelectBlog={() => navigateTo('blog')} 
        onSelectConsultant={() => navigateTo('home')} 
        onOpenMemberArea={() => setShowMemberArea(true)}
        onNavigate={navigateTo}
        onOpenAdmin={() => setShowAdmin(true)}
        currentView={currentView}
      />
      
      <div className="flex-grow flex relative">
        {/* Sidebar Esquerda Restaurada */}
        <aside className="hidden lg:block fixed left-4 top-24 bottom-24 w-48 z-40 overflow-hidden pointer-events-none mask-linear-vertical">
          <div className="flex flex-col gap-6 animate-scrollDown pointer-events-auto py-20">
            {(banners.left.length > 0 ? [...banners.left, ...banners.left, ...banners.left] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-110 transition-all duration-300 aspect-square bg-white">
                <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </aside>

        {/* ÁREA PRINCIPAL com preenchimento lateral para as Sidebars */}
        <main className="flex-grow bg-white min-w-0 lg:px-[220px]">
          {renderContent()}

          {/* Grid Mobile Banners - Oculto quando as laterais estão ativas */}
          {banners.allActive.length > 0 && (
            <div className="lg:hidden bg-gray-50 py-10 border-t border-gray-100 overflow-hidden">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-sm font-black text-gray-900 mb-6 text-center uppercase tracking-[0.3em] px-6">Nossos Parceiros</h3>
                <div className="relative flex overflow-hidden mask-linear-horizontal group">
                  <div className="flex gap-4 animate-scrollRight whitespace-nowrap py-2">
                    {[...banners.allActive, ...banners.allActive, ...banners.allActive].map((b, i) => (
                      <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="inline-block min-w-[150px] sm:min-w-[200px] rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-video bg-white shrink-0 transform hover:scale-105 transition-transform duration-500">
                        <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Sidebar Direita Restaurada */}
        <aside className="hidden lg:block fixed right-4 top-24 bottom-24 w-48 z-40 overflow-hidden pointer-events-none mask-linear-vertical">
          <div className="flex flex-col gap-6 animate-scrollUp pointer-events-auto py-20">
            {(banners.right.length > 0 ? [...banners.right, ...banners.right, ...banners.right] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-110 transition-all duration-300 aspect-square bg-white">
                <img src={b.banner_url} alt={b.name} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {showMemberArea && <MemberArea onClose={() => setShowMemberArea(false)} />}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); fetchAffiliates(); }} initialAffiliates={affiliates} onRefresh={fetchAffiliates} />}

      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedPost(null)} className="fixed md:absolute top-6 right-6 z-[130] bg-white shadow-xl text-gray-900 w-12 h-12 rounded-full flex items-center justify-center transition hover:bg-red-500 hover:text-white border border-gray-100">
              <i className="fas fa-times text-lg"></i>
            </button>
            <div className="relative h-64 md:h-96">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>
            <div className="px-6 md:px-16 pb-16 -mt-20 relative">
              <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPost.category}</span>
                  <span className="text-gray-400 text-xs font-bold">{selectedPost.date}</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{selectedPost.title}</h2>
                <div className="max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return <br key={idx} />;
                    if (trimmed.startsWith('###')) return <h3 key={idx} className="text-xl md:text-2xl font-black text-gray-900 mt-8 mb-4">{trimmed.replace('###', '').trim()}</h3>;
                    if (trimmed.startsWith('*')) return <li key={idx} className="ml-6 mb-2 text-gray-700 list-disc text-sm md:text-base">{trimmed.replace('*', '').trim()}</li>;
                    if (trimmed.startsWith('**Dica') || trimmed.startsWith('**Atenção')) return <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-2xl"><p className="text-amber-900 font-bold italic text-sm md:text-base">{trimmed.replace(/\*\*/g, '')}</p></div>;
                    return <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-sm md:text-lg">{trimmed}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg"><i className="fas fa-chart-line text-white"></i></div>
              <span className="text-xl font-bold text-white">Empreende<span className="text-blue-600">2026</span></span>
            </div>
            <p className="text-sm max-w-sm mx-auto mb-8 px-4">Educação técnica e estratégica para o microempreendedor enfrentar os desafios de 2026.</p>
            <div className="pt-8 border-t border-gray-800 text-[10px] md:text-xs text-gray-600 px-4">
              <p>&copy; 2026 Empreende2026. Todos os direitos reservados. Informação técnica para fins educativos.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
