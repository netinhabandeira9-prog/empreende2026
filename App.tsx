
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

  // SEO: Atualização dinâmica do Título e JSON-LD
  useEffect(() => {
    const titles: Record<View, string> = {
      home: 'NB Empreende | Início - Guia do Empreendedor 2026',
      blog: 'Blog Editorial | NB Empreende - Notícias para MEI',
      calculators: 'Calculadoras Gratuitas | NB Empreende',
      'tool-detail': 'Ferramenta de Simulação | NB Empreende',
      loan: 'Simulador de Crédito | NB Empreende & Confia',
      about: 'Sobre a NB Empreende',
      contact: 'Fale Conosco | NB Empreende',
      privacy: 'Privacidade | NB Empreende'
    };
    document.title = selectedPost ? selectedPost.title : titles[currentView];

    // Injetar JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "NB Empreende",
      "url": "https://www.nbempreende.com.br",
      "logo": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200",
      "sameAs": [
        "https://www.instagram.com/confia_creditofacilseguro/"
      ]
    };
    const script = document.getElementById('json-ld-org') || document.createElement('script');
    script.id = 'json-ld-org';
    (script as any).type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    if (!document.getElementById('json-ld-org')) document.head.appendChild(script);

  }, [currentView, selectedPost]);

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
        supabase.from('partners').select('*') 
      ]);
      if (affs.data) setAffiliates(affs.data as Affiliate[]);
      if (parts.data) setPartners(parts.data.filter((p: any) => p.logo_url && p.active !== false) as Partner[]);
    } catch (err) { console.error(err); }
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
            
            {/* Parceiros - SEO Alt tags e Links */}
            <section className="py-16 bg-white border-b border-gray-50">
               <div className="max-w-6xl mx-auto px-4 text-center">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Empresas que confiam na NB Empreende</h2>
                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {partners.length > 0 ? (
                      partners.map(p => (
                        <a key={p.id} href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="h-20 md:h-32 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all transform hover:scale-105 flex items-center justify-center">
                           <img src={p.logo_url} alt={`Parceiro ${p.name}`} loading="lazy" className="h-full w-auto max-w-[220px] object-contain" />
                        </a>
                      ))
                    ) : (
                      <div className="text-[9px] font-bold text-gray-200 uppercase tracking-widest">Nossos parceiros aparecerão aqui.</div>
                    )}
                  </div>
               </div>
            </section>

            {/* Banners Centrais com Lazy Loading */}
            {banners.center.length > 0 && (
              <div className="max-w-xl mx-auto px-4 my-12 space-y-6">
                {banners.center.map(b => (
                  <div key={b.id} className="relative group animate-fadeIn">
                    <div className="absolute -top-3 left-4 z-30 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">OFERTA NB</div>
                    <button onClick={() => toggleBannerClosed(b.id)} className="absolute -top-3 -right-3 z-40 bg-white shadow-md text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-gray-100">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-xl border-2 border-white aspect-video md:aspect-[3/1] bg-gray-50">
                      <img src={b.banner_url} alt={`Banner Oferta ${b.name}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
               <button onClick={() => { setSelectedTool(CalculatorType.TAX); navigateTo('tool-detail'); }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition"><i className="fas fa-university text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">IBS & CBS 2026</h3><p className="text-[10px] text-gray-500">Calculadora Tributária.</p></div>
                </button>
                <button onClick={() => { setSelectedTool(CalculatorType.VACATION); navigateTo('tool-detail'); }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-green-100 p-3 rounded-full text-green-700 group-hover:bg-green-700 group-hover:text-white transition"><i className="fas fa-umbrella-beach text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Férias 2026</h3><p className="text-[10px] text-gray-500">Direitos Trabalhistas.</p></div>
                </button>
                <button onClick={() => navigateTo('loan')} className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-cyan-100 p-3 rounded-full text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white transition"><i className="fas fa-hand-holding-dollar text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Crédito Fácil</h3><p className="text-[10px] text-gray-500">NB & Confia.</p></div>
                </button>
                <button onClick={() => { setSelectedTool(CalculatorType.RETIREMENT); navigateTo('tool-detail'); }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition"><i className="fas fa-hourglass-half text-xl"></i></div>
                  <div><h3 className="font-bold text-gray-900 text-sm">Aposentadoria</h3><p className="text-[10px] text-gray-500">Simulador Previdência.</p></div>
                </button>
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
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPage />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100 bg-white relative">
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
        {/* Laterais com Banners Otimizados */}
        <aside className="hidden lg:block fixed left-6 top-1/4 bottom-1/4 w-24 z-40 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="flex flex-col gap-4 animate-infiniteScroll pointer-events-auto py-10" style={{ animationDirection: 'reverse' }}>
            {(banners.left.length > 0 ? [...banners.left, ...banners.left] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white hover:scale-110 transition-all bg-white group relative">
                <img src={b.banner_url} alt={`Destaque ${b.name}`} loading="lazy" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </aside>

        <main className="flex-grow min-w-0 lg:mx-36">
          {renderContent()}

          {/* Mobile Carrossel - Otimizado para Mobile Speed */}
          {banners.allActive.length > 0 && currentView === 'home' && (
            <div className="lg:hidden bg-gray-50 py-10 border-t border-gray-100 overflow-hidden">
               <div className="max-w-5xl mx-auto px-4 text-center">
                  <h3 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.3em]">Sugestões NB para Você</h3>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {banners.allActive.map(b => (
                      <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" className="min-w-[150px] h-[150px] rounded-3xl overflow-hidden shadow-md border-2 border-white shrink-0 bg-white">
                        <img src={b.banner_url} alt={b.name} loading="lazy" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </main>

        <aside className="hidden lg:block fixed right-6 top-1/4 bottom-1/4 w-24 z-40 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="flex flex-col gap-4 animate-infiniteScroll pointer-events-auto py-10">
            {(banners.right.length > 0 ? [...banners.right, ...banners.right] : []).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white hover:scale-110 transition-all bg-white group relative">
                <img src={b.banner_url} alt={`Destaque ${b.name}`} loading="lazy" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {showMemberArea && <MemberArea onClose={() => setShowMemberArea(false)} />}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); fetchContent(); }} initialAffiliates={affiliates} onRefresh={fetchContent} />}

      {/* Post Modal com Artigo Semântico */}
      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 z-[130] bg-white w-10 h-10 rounded-full flex items-center justify-center border shadow-lg hover:bg-red-500 hover:text-white transition">
              <i className="fas fa-times"></i>
            </button>
            <article className="text-left">
              <div className="h-64 md:h-96 relative">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="px-6 md:px-16 pb-16 -mt-16 relative">
                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 prose prose-lg max-w-none">
                  <header>
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedPost.category}</span>
                      <time className="text-gray-400 text-xs font-bold">{selectedPost.date}</time>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{selectedPost.title}</h2>
                  </header>
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {selectedPost.content.split('\n').map((paragraph, idx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return <br key={idx} />;
                      if (trimmed.startsWith('###')) return <h3 key={idx} className="font-black text-gray-900 mt-10 mb-4">{trimmed.replace('###', '').trim()}</h3>;
                      if (trimmed.startsWith('*')) return <li key={idx} className="ml-6 mb-2 list-disc">{trimmed.replace('*', '').trim()}</li>;
                      return <p key={idx} className="mb-6">{trimmed}</p>;
                    })}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="bg-blue-700 p-2 rounded-lg"><i className="fas fa-chart-line text-white"></i></div>
              <span className="text-xl font-bold text-white">NB Empreende <span className="text-blue-700">2026</span></span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 mb-10 text-xs font-bold uppercase tracking-widest">
              <button onClick={() => navigateTo('home')} className="hover:text-white">Início</button>
              <button onClick={() => navigateTo('blog')} className="hover:text-white">Blog</button>
              <button onClick={() => navigateTo('calculators')} className="hover:text-white">Calculadoras</button>
              <button onClick={() => navigateTo('privacy')} className="hover:text-white">Privacidade</button>
              <button onClick={() => navigateTo('contact')} className="hover:text-white">Contato</button>
            </nav>
            <div className="pt-8 border-t border-gray-800 text-[10px] text-gray-600">
              <p>&copy; 2026 NB Empreende - CNPJ 00.000.000/0001-00. Todo o conteúdo é meramente informativo para fins educativos.</p>
              <p className="mt-2">www.nbempreende.com.br</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
