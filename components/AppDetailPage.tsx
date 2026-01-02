
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { AppScreen } from '../types';

interface AppDetailPageProps {
  appId: string;
}

const AppDetailPage: React.FC<AppDetailPageProps> = ({ appId }) => {
  const [screens, setScreens] = useState<AppScreen[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks Estáticos
  const defaultMeuIRScreens = [
    { app_id: 'meu-ir', screen_index: 0, title: "Painel de Controle", description: "Status de conformidade e resumo de impostos 2026 com interface limpa.", image_url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'meu-ir', screen_index: 1, title: "Auditoria Fiscal", description: "IA que analisa inconsistências em recibos e notas fiscais de serviços.", image_url: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'meu-ir', screen_index: 2, title: "Documentação", description: "Organização por pastas inteligentes para facilitar a declaração anual.", image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'meu-ir', screen_index: 3, title: "Lançamento Rápido", description: "Registro de rendas e despesas dedutíveis em poucos segundos.", image_url: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=300" }
  ];

  const defaultPrecoCertoScreens = [
    { app_id: 'preco-certo', screen_index: 0, title: "Scanner de Nota", description: "IA que lê DANFEs em segundos e extrai custos reais.", image_url: "https://images.unsplash.com/photo-1556742049-13da73667422?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'preco-certo', screen_index: 1, title: "Cálculo de Margem", description: "Defina seu lucro e veja o preço sugerido com impostos.", image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'preco-certo', screen_index: 2, title: "Gestão de Lotes", description: "Diferencia fardos de unidades automaticamente.", image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300" },
    { app_id: 'preco-certo', screen_index: 3, title: "Histórico de Lucro", description: "Acompanhe a evolução da sua margem por produto.", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300" }
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

  if (appId === 'meu-ir') {
    return (
      <div className="bg-white min-h-screen animate-fadeIn">
        <section className="pt-12 pb-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                  <i className="fas fa-shield-halved"></i> NB Meu IR
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                  Sua proteção contra a <br/><span className="text-blue-700">malha fina.</span>
                </h1>
                <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-lg">
                  O assistente definitivo para Autônomos e CLT. Organize finanças, calcule DARFs e audite seus riscos fiscais de forma 100% privada e offline via Web App.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://nb-controle-ir.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-lg active:scale-95 group text-xs uppercase tracking-widest">
                    <span>Acessar NB Meu IR</span>
                    <i className="fas fa-external-link-alt text-[9px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </a>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <div className="bg-slate-700/5 absolute inset-0 blur-[60px] rounded-full scale-75"></div>
                <img src="https://images.unsplash.com/photo-1454165833767-027ffea9e78b?auto=format&fit=crop&q=80&w=500" alt="Hero" className="relative z-10 rounded-[2rem] shadow-xl border-2 border-white max-w-full h-auto lg:max-h-[260px] object-cover transform lg:-rotate-1" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Tour pela Interface</h2>
              <p className="text-gray-500 text-sm max-w-xl">Visualização otimizada para controle contábil e gestão de impostos.</p>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-10 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
              {screens.map((screen, idx) => (
                <div key={idx} className="min-w-[180px] md:min-w-[220px] snap-center flex flex-col items-center text-center">
                  <div className="bg-white rounded-[1.5rem] p-1 shadow-lg border border-gray-100 mb-4 transform hover:-translate-y-1 transition-transform duration-500">
                    <img src={screen.image_url} alt={screen.title} className="rounded-[1.2rem] w-full aspect-[3/4] object-cover" />
                  </div>
                  <h4 className="font-black text-gray-900 text-[10px] mb-1 uppercase tracking-tighter">{screen.title}</h4>
                  <p className="text-gray-400 text-[9px] leading-tight max-w-[160px] font-medium uppercase tracking-tighter">{screen.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 text-center bg-gray-50 border-t border-gray-100">
           <h3 className="text-xl font-black text-gray-900 mb-6">Pronto para dominar sua proteção fiscal?</h3>
           <a href="https://nb-controle-ir.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition transform active:scale-95 flex items-center gap-3 mx-auto w-max">
             Acessar NB Meu IR <i className="fas fa-arrow-right text-[9px]"></i>
           </a>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      <section className="pt-12 pb-20 bg-blue-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                <i className="fas fa-rocket"></i> App NB Preço Certo
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Sua câmera é agora seu <br/><span className="text-blue-700">precificador.</span>
              </h1>
              <div className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed max-w-xl space-y-4">
                <p>O <strong>NB Preço Certo</strong> é um assistente inteligente de precificação para pequenos lojistas. Ele elimina o erro humano e o prejuízo ao transformar automaticamente suas notas fiscais de compra em preços de venda lucrativos.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://nb-pre-o-certo.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-lg active:scale-95 group text-xs uppercase tracking-widest">
                  <span>Acessar NB Preço Certo</span>
                  <i className="fas fa-external-link-alt text-[9px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </a>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="bg-blue-700/10 absolute inset-0 blur-[60px] rounded-full scale-75"></div>
              <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=500" alt="Hero" className="relative z-10 rounded-[2rem] shadow-xl border-2 border-white max-w-full h-auto lg:max-h-[260px] object-cover transform lg:rotate-1" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white overflow-hidden border-y border-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Tecnologia em Ação</h2>
            <p className="text-gray-500 text-sm max-w-xl">Veja como o app automatiza tarefas que antes levavam horas.</p>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-10 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
            {screens.map((screen, idx) => (
              <div key={idx} className="min-w-[180px] md:min-w-[220px] snap-center flex flex-col items-center text-center">
                <div className="bg-white rounded-[1.5rem] p-1 shadow-lg border border-gray-100 mb-4 transform hover:-translate-y-1 transition-transform duration-500">
                  <img src={screen.image_url} alt={screen.title} className="rounded-[1.2rem] w-full aspect-[3/4] object-cover" />
                </div>
                <h4 className="font-black text-gray-900 text-[10px] mb-1 uppercase tracking-tighter">{screen.title}</h4>
                <p className="text-gray-400 text-[9px] leading-tight max-w-[160px] font-medium uppercase tracking-tighter">{screen.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">O que o app <br/>faz por você:</h2>
            <p className="text-gray-500 max-w-xl text-sm font-bold uppercase tracking-widest">A ferramenta que garante que você nunca mais perca dinheiro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 text-lg group-hover:scale-110 transition-transform"><i className="fas fa-camera"></i></div>
              <h3 className="text-base font-black mb-3">Scanner de Notas (IA)</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Você tira uma foto da nota fiscal (DANFE) e o app lê instantaneamente o fornecedor, os produtos, as quantidades e os custos.</p>
            </div>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600 text-lg group-hover:scale-110 transition-transform"><i className="fas fa-boxes-stacked"></i></div>
              <h3 className="text-base font-black mb-3">Fardo / Unidade</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Identifica sozinho se você comprou uma caixa (ex: com 12 unidades) e já calcula o custo individual de cada item.</p>
            </div>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600 text-lg group-hover:scale-110 transition-transform"><i className="fas fa-chart-line"></i></div>
              <h3 className="text-base font-black mb-3">Cálculo de Margem Real</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Aplica sua margem de lucro desejada, soma os impostos do seu negócio e adiciona um "Fator de Correção" para fretes e perdas.</p>
            </div>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600 text-lg group-hover:scale-110 transition-transform"><i className="fas fa-pen-to-square"></i></div>
              <h3 className="text-base font-black mb-3">Edição em Tempo Real</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Se a IA ler algo errado ou se você quiser mudar um valor, todos os campos são editáveis antes de gerar o preço final.</p>
            </div>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600 text-lg group-hover:scale-110 transition-transform"><i className="fas fa-history"></i></div>
              <h3 className="text-base font-black mb-3">Gestão de Lucro</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Mostra quanto você vai ganhar em cada produto e mantém um histórico de todas as suas compras.</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex flex-col justify-center items-center text-center">
              <i className="fas fa-shield-check text-3xl mb-4 text-blue-500"></i>
              <h3 className="text-base font-black mb-1 uppercase tracking-tighter">Em resumo:</h3>
              <p className="text-gray-400 text-[9px] leading-relaxed uppercase font-bold tracking-widest px-4">Nunca mais perca dinheiro calculando "de cabeça" ou esquecendo custos ocultos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-gray-900 text-white rounded-[3rem] mx-4 mb-16 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
         <h3 className="text-xl md:text-3xl font-black mb-8 relative z-10">Otimize suas margens hoje mesmo.</h3>
         <a href="https://nb-pre-o-certo.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition active:scale-95 flex items-center gap-3 mx-auto w-max relative z-10">
           Acessar NB Preço Certo <i className="fas fa-chevron-right text-[9px]"></i>
         </a>
      </section>
    </div>
  );
};

export default AppDetailPage;
