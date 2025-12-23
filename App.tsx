
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
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(true);

  const fetchAffiliates = async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingAffiliates(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setAffiliates(data as Affiliate[]);
    } catch (err) {
      console.error("Erro ao carregar afiliados:", err);
    } finally {
      setIsLoadingAffiliates(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedTool]);

  const navigateToTool = (tool: CalculatorType) => {
    setSelectedTool(tool);
    setCurrentView('tool-detail');
  };

  const activeBanners = useMemo(() => {
    return affiliates.filter(a => a.active && a.banner_url);
  }, [affiliates]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSelectTool={navigateToTool} onSelectConsultant={() => setCurrentView('home')} />
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
      if (trimmed.startsWith('###')) {
        return <h3 key={idx} className="text-2xl font-black text-gray-900 mt-8 mb-4">{trimmed.replace('###', '').trim()}</h3>;
      }
      if (trimmed.startsWith('*')) {
        return <li key={idx} className="ml-6 mb-2 text-gray-700 list-disc">{trimmed.replace('*', '').trim()}</li>;
      }
      if (trimmed.startsWith('**Dica') || trimmed.startsWith('**Atenção')) {
        return (
          <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-2xl">
            <p className="text-amber-900 font-bold italic">{trimmed.replace(/\*\*/g, '')}</p>
          </div>
        );
      }
      return <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-lg">{trimmed}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-blue-100">
      <Header 
        onSelectTool={navigateToTool} 
        onSelectBlog={() => setCurrentView('blog')} 
        onSelectConsultant={() => setCurrentView('home')} 
        onOpenMemberArea={() => setShowMemberArea(true)}
        onNavigate={(view: View) => setCurrentView(view)}
        onOpenAdmin={() => setShowAdmin(true)}
      />
      
      <div className="flex-grow flex relative">
        <aside className="hidden xl:flex flex-col w-60 sticky top-20 h-[calc(100vh-80px)] p-6 space-y-6 border-r border-gray-50 bg-gray-50/20 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Recomendados</p>
          {activeBanners.filter((_, i) => i % 2 === 0).map((b) => (
            <a key={b.id} href={b.link} target="_blank" rel="noopener" className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <img src={b.banner_url} alt={b.name} className="w-full h-auto object-cover" />
              <div className="bg-white p-3 text-center border-t border-gray-100">
                <span className="text-[10px] font-black text-blue-600 uppercase">Ver Oferta</span>
              </div>
            </a>
          ))}
          {activeBanners.length === 0 && <div className="text-center text-[10px] text-gray-300 italic">Espaço Publicitário</div>}
        </aside>

        <main className="flex-grow bg-white min-w-0">
          {renderContent()}
        </main>

        <aside className="hidden xl:flex flex-col w-60 sticky top-20 h-[calc(100vh-80px)] p-6 space-y-6 border-l border-gray-50 bg-gray-50/20 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Ofertas do Dia</p>
          {activeBanners.filter((_, i) => i % 2 !== 0).map((b) => (
            <a key={b.id} href={b.link} target="_blank" rel="noopener" className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <img src={b.banner_url} alt={b.name} className="w-full h-auto object-cover" />
              <div className="bg-white p-3 text-center border-t border-gray-100">
                <span className="text-[10px] font-black text-blue-600 uppercase">Comprar Agora</span>
              </div>
            </a>
          ))}
          {activeBanners.length === 0 && <div className="text-center text-[10px] text-gray-300 italic">Espaço Publicitário</div>}
        </aside>
      </div>

      {showMemberArea && <MemberArea onClose={() => setShowMemberArea(false)} />}
      
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
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
