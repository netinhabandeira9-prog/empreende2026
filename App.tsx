
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

type View = 'home' | 'blog' | 'calculators' | 'tool-detail' | 'about' | 'contact' | 'privacy';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedTool, setSelectedTool] = useState<CalculatorType>(CalculatorType.TAX);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showMemberArea, setShowMemberArea] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(true);

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

  const navigateToTool = (tool: CalculatorType) => {
    setSelectedTool(tool);
    setCurrentView('tool-detail');
  };

  const banners = useMemo(() => {
    const active = affiliates.filter(a => a.active && a.banner_url && a.banner_url.startsWith('http'));
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
            <Hero onSelectTool={navigateToTool} onSelectConsultant={() => setCurrentView('home')} />
            
            {/* Banner Central Fechável (Desktop & Mobile) */}
            {banners.center.length > 0 && (
              <div className="max-w-4xl mx-auto px-4 mt-8 space-y-4">
                {banners.center.map(b => (
                  <div key={b.id} className="relative group animate-fadeIn">
                    <button 
                      onClick={() => toggleBannerClosed(b.id)}
                      className="absolute -top-3 -right-3 z-30 bg-white shadow-lg text-gray-900 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl overflow-hidden shadow-xl border-4 border-white hover:scale-[1.01] transition-transform">
                      <img src={b.banner_url} alt={b.name} className="w-full h-auto object-cover max-h-48 md:max-h-64" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => navigateToTool(CalculatorType.TAX)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <i className="fas fa-university text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900">IBS & CBS 2026</h3><p className="text-xs text-gray-500">Transição tributária.</p></div>
                </button>
                <button onClick={() => navigateToTool(CalculatorType.VACATION)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                    <i className="fas fa-umbrella-beach text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900">Minhas Férias</h3><p className="text-xs text-gray-500">Simulador trabalhador.</p></div>
                </button>
                <button onClick={() => navigateToTool(CalculatorType.RETIREMENT)} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4 transform hover:-translate-y-2 transition text-left group">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                    <i className="fas fa-hourglass-half text-xl"></i>
                  </div>
                  <div><h3 className="font-bold text-gray-900">Aposentadoria</h3><p className="text-xs text-gray-500">Regras de 2026.</p></div>
                </button>
              </div>
            </div>
            <BlogSection onReadPost={setSelectedPost} />
            <AIConsultant />
          </>
        );
      case 'blog': return <BlogPage onReadPost={setSelectedPost} />;
      case 'calculators': return <CalculatorsHub onSelectTool={navigateToTool} />;
      case 'tool-detail': return <ToolDetailPage toolType={selectedTool} onToolChange={navigateToTool} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPage />;
      default: return null;
    }
  };

  const formatPostContent = (content: string) => {
    return content.split('\n').map((paragraph, idx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return <br key={idx} />;
      if (trimmed.startsWith('###')) return <h3 key={idx} className="text-2xl font-black text-gray-900 mt-8 mb-4">{trimmed.replace('###', '').trim()}</h3>;
      if (trimmed.startsWith('*')) return <li key={idx} className="ml-6 mb-2 text-gray-700 list-disc">{trimmed.replace('*', '').trim()}</li>;
      if (trimmed.startsWith('**Dica') || trimmed.startsWith('**Atenção')) return <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-2xl"><p className="text-amber-900 font-bold italic">{trimmed.replace(/\*\*/g, '')}</p></div>;
      return <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-lg">{trimmed}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100 relative">
      <Header 
        onSelectTool={navigateToTool} 
        onSelectBlog={() => setCurrentView('blog')} 
        onSelectConsultant={() => setCurrentView('home')} 
        onOpenMemberArea={() => setShowMemberArea(true)}
        onNavigate={(view: View) => setCurrentView(view)}
        onOpenAdmin={() => setShowAdmin(true)}
      />
      
      <div className="flex-grow flex relative">
        {/* Sidebar Esquerda - Desktop (Flutuante e Animada) */}
        <aside className="hidden xl:block fixed left-4 top-24 bottom-24 w-40 z-40 overflow-hidden pointer-events-none">
          <div className="flex flex-col gap-4 animate-scrollDown pointer-events-auto">
            {banners.left.concat(banners.left).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:scale-105 transition-transform">
                <img src={b.banner_url} alt={b.name} className="w-full h-auto object-cover" />
              </a>
            ))}
          </div>
        </aside>

        <main className="flex-grow bg-white min-w-0">
          {renderContent()}

          {/* Versão Mobile dos Banners Laterais (Antes do Footer) */}
          <div className="xl:hidden max-w-7xl mx-auto px-4 py-12 border-t border-gray-50">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-6">Ofertas Recomendadas</p>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {banners.allActive.filter(b => b.position !== 'center').map(b => (
                 <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={b.banner_url} alt={b.name} className="w-full h-32 object-cover" />
                 </a>
               ))}
             </div>
          </div>
        </main>

        {/* Sidebar Direita - Desktop (Flutuante e Animada) */}
        <aside className="hidden xl:block fixed right-4 top-24 bottom-24 w-40 z-40 overflow-hidden pointer-events-none">
          <div className="flex flex-col gap-4 animate-scrollUp pointer-events-auto">
            {banners.right.concat(banners.right).map((b, i) => (
              <a key={`${b.id}-${i}`} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:scale-105 transition-transform">
                <img src={b.banner_url} alt={b.name} className="w-full h-auto object-cover" />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {showMemberArea && <MemberArea onClose={() => setShowMemberArea(false)} />}
      
      {showAdmin && (
        <AdminPanel 
          onClose={() => { setShowAdmin(false); fetchAffiliates(); }} 
          initialAffiliates={affiliates} 
          onRefresh={fetchAffiliates} 
        />
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedPost(null)} className="fixed md:absolute top-6 right-6 z-50 bg-white shadow-xl text-gray-900 w-12 h-12 rounded-full flex items-center justify-center transition hover:bg-red-500 hover:text-white border border-gray-100">
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
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{selectedPost.title}</h2>
                <div className="max-w-none">{formatPostContent(selectedPost.content)}</div>
                <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h4 className="font-black text-gray-900">Gostou deste guia educativo?</h4>
                    <p className="text-gray-500 text-sm">Atualizamos semanalmente com novos conteúdos técnicos.</p>
                  </div>
                  <button onClick={() => setSelectedPost(null)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg active:scale-95">Concluir Leitura</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg"><i className="fas fa-chart-line text-white"></i></div>
              <span className="text-xl font-bold text-white">Empreende<span className="text-blue-600">2026</span></span>
            </div>
            <p className="text-sm max-w-sm mx-auto mb-8">Educação técnica e estratégica para o microempreendedor enfrentar os desafios de 2026.</p>
            <div className="pt-8 border-t border-gray-800 text-xs text-gray-600">
              <p>&copy; 2026 Empreende2026. Todos os direitos reservados. Informação técnica para fins educativos.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
