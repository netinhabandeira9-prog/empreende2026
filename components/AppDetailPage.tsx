
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { AppScreen } from '../types';

interface AppDetailPageProps {
  appId: string;
}

const AppDetailPage: React.FC<AppDetailPageProps> = ({ appId }) => {
  const [screens, setScreens] = useState<AppScreen[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks Estáticos se o banco estiver vazio
  const defaultMeuIRScreens = [
    { app_id: 'meu-ir', screen_index: 0, title: "Painel de Controle", description: "Status de conformidade e resumo de impostos 2026.", image_url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400" },
    { app_id: 'meu-ir', screen_index: 1, title: "Auditoria Fiscal", description: "IA que analisa inconsistências em recibos.", image_url: "https://images.unsplash.com/photo-1554224155-1696413575b9?w=400" },
    { app_id: 'meu-ir', screen_index: 2, title: "Documentação", description: "Organização por pastas inteligentes.", image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400" },
    { app_id: 'meu-ir', screen_index: 3, title: "Lançamento Rápido", description: "Registro de rendas e despesas em poucos segundos.", image_url: "https://images.unsplash.com/photo-1554224155-1696413575b9?w=400" }
  ];

  const defaultPrecoCertoScreens = [
    { app_id: 'preco-certo', screen_index: 0, title: "Scanner de Nota", description: "IA que lê DANFEs em segundos.", image_url: "https://images.unsplash.com/photo-1556742049-13da73667422?w=400" },
    { app_id: 'preco-certo', screen_index: 1, title: "Cálculo de Margem", description: "Defina seu lucro e veja o preço sugerido.", image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
    { app_id: 'preco-certo', screen_index: 2, title: "Gestão de Lotes", description: "Diferencia fardos de unidades automaticamente.", image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400" },
    { app_id: 'preco-certo', screen_index: 3, title: "Histórico de Lucro", description: "Acompanhe a evolução da sua margem.", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" }
  ];

  useEffect(() => {
    const fetchScreens = async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setScreens(appId === 'meu-ir' ? defaultMeuIRScreens : defaultPrecoCertoScreens);
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from('app_screens').select('*').eq('app_id', appId).order('screen_index', { ascending: true });
        if (data && data.length > 0) {
          setScreens(data);
        } else {
          setScreens(appId === 'meu-ir' ? defaultMeuIRScreens : defaultPrecoCertoScreens);
        }
      } catch (err) {
        setScreens(appId === 'meu-ir' ? defaultMeuIRScreens : defaultPrecoCertoScreens);
      } finally {
        setLoading(false);
      }
    };
    fetchScreens();
  }, [appId]);

  const isMeuIR = appId === 'meu-ir';

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      <section className={`pt-12 pb-20 ${isMeuIR ? 'bg-slate-50' : 'bg-blue-50/50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 items-center">
            <div className="text-left">
              <div className={`inline-flex items-center gap-2 ${isMeuIR ? 'bg-slate-200 text-slate-700' : 'bg-blue-100 text-blue-700'} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6`}>
                <i className={`fas ${isMeuIR ? 'fa-shield-halved' : 'fa-rocket'}`}></i> {isMeuIR ? 'NB Meu IR' : 'App NB Preço Certo'}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                {isMeuIR ? <>Sua proteção contra a <br/><span className="text-blue-700">malha fina.</span></> : <>Sua câmera é agora seu <br/><span className="text-blue-700">precificador.</span></>}
              </h1>
              <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-lg">
                {isMeuIR 
                  ? "O assistente definitivo para Autônomos e CLT. Organize finanças, calcule DARFs e audite seus riscos fiscais de forma 100% privada e offline via Web App."
                  : "O NB Preço Certo é um assistente inteligente de precificação para pequenos lojistas. Ele elimina o erro humano ao transformar automaticamente suas notas fiscais de compra em preços de venda lucrativos."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={isMeuIR ? "https://nb-controle-ir.vercel.app/" : "https://nb-pre-o-certo.vercel.app/"} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-lg active:scale-95 group text-xs uppercase tracking-widest">
                  <span>Acessar {isMeuIR ? 'NB Meu IR' : 'NB Preço Certo'}</span>
                  <i className="fas fa-external-link-alt text-[9px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </a>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className={`${isMeuIR ? 'bg-slate-700/5' : 'bg-blue-700/10'} absolute inset-0 blur-[60px] rounded-full scale-75`}></div>
              <img src={isMeuIR ? "https://images.unsplash.com/photo-1454165833767-027ffea9e78b?w=500" : "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=500"} alt="Hero" className="relative z-10 rounded-[2rem] shadow-xl border-2 border-white max-w-full h-auto lg:max-h-[260px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white overflow-hidden border-y border-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">{isMeuIR ? 'Tour pela Interface' : 'Tecnologia em Ação'}</h2>
            <p className="text-gray-500 text-sm max-w-xl">Visualização otimizada para controle contábil e gestão de lucro.</p>
          </div>
          {loading ? (
             <div className="flex justify-center py-20"><i className="fas fa-spinner animate-spin text-3xl text-gray-200"></i></div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-10 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
              {screens.map((screen, idx) => (
                <div key={idx} className="min-w-[200px] md:min-w-[240px] snap-center flex flex-col items-center text-center">
                  <div className="bg-white rounded-[2rem] p-1.5 shadow-xl border border-gray-100 mb-5 transform hover:-translate-y-2 transition-all duration-500">
                    <img src={screen.image_url || 'https://images.unsplash.com/photo-1512428559083-560df5f4b95e?w=300'} alt={screen.title} className="rounded-[1.6rem] w-full aspect-[3/4] object-cover bg-gray-50" />
                  </div>
                  <h4 className="font-black text-gray-900 text-xs mb-2 uppercase tracking-tighter">{screen.title}</h4>
                  <p className="text-gray-400 text-[10px] leading-tight max-w-[180px] font-medium uppercase tracking-tighter line-clamp-3">{screen.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">O que o app <br/>faz por você:</h2>
            <p className="text-gray-500 max-w-xl text-sm font-bold uppercase tracking-widest">Ferramentas que garantem proteção e lucro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isMeuIR ? (
              <>
                <div className="p-8 bg-white rounded-[2.5rem] border group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600"><i className="fas fa-file-invoice"></i></div>
                  <h3 className="text-base font-black mb-3">Controle de Carnê-Leão</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Cálculo automático de DARF mensal para autônomos sem surpresas no fim do ano.</p>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600"><i className="fas fa-microscope"></i></div>
                  <h3 className="text-base font-black mb-3">Detector de Erros</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Analisa seus dados em busca de inconsistências que podem atrair a malha fina da Receita.</p>
                </div>
                <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center">
                  <i className="fas fa-user-lock text-3xl mb-4 text-blue-500"></i>
                  <h3 className="text-base font-black mb-1 uppercase tracking-tighter">100% Privado</h3>
                  <p className="text-gray-400 text-[9px] leading-relaxed uppercase font-bold tracking-widest px-4">Seus dados financeiros não saem do seu dispositivo.</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-8 bg-white rounded-[2.5rem] border group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600"><i className="fas fa-camera"></i></div>
                  <h3 className="text-base font-black mb-3">Scanner de Notas</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Tire foto da nota e o app lê quantidades e custos automaticamente via IA.</p>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600"><i className="fas fa-chart-line"></i></div>
                  <h3 className="text-base font-black mb-3">Margem Real</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Soma impostos, fretes e sua margem desejada para sugerir o preço ideal.</p>
                </div>
                <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center">
                  <i className="fas fa-piggy-bank text-3xl mb-4 text-green-500"></i>
                  <h3 className="text-base font-black mb-1 uppercase tracking-tighter">Lucro Garantido</h3>
                  <p className="text-gray-400 text-[9px] leading-relaxed uppercase font-bold tracking-widest px-4">Nunca mais venda com prejuízo por erro de cálculo.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppDetailPage;
