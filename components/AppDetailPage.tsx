
import React from 'react';

interface AppDetailPageProps {
  appId: string;
}

const AppDetailPage: React.FC<AppDetailPageProps> = ({ appId }) => {
  if (appId === 'meu-ir') {
    const appScreens = [
      {
        title: "Painel de Controle",
        desc: "Status de conformidade e resumo de impostos 2026 com interface limpa.",
        img: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=400" 
      },
      {
        title: "Auditoria Fiscal",
        desc: "IA que analisa inconsistências em recibos e notas fiscais de serviços.",
        img: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=400" 
      },
      {
        title: "Documentação",
        desc: "Organização por pastas inteligentes para facilitar a declaração anual.",
        img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400"
      },
      {
        title: "Lançamento Rápido",
        desc: "Registro de rendas e despesas dedutíveis em poucos segundos.",
        img: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=400"
      }
    ];

    return (
      <div className="bg-white min-h-screen animate-fadeIn">
        {/* Hero Meu IR - Layout ajustado para evitar sobreposição de banners */}
        <section className="pt-20 pb-32 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                  <i className="fas fa-shield-halved"></i> NB Meu IR - Proteção Fiscal
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                  Sua proteção contra a <br/><span className="text-blue-700">malha fina.</span>
                </h1>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl">
                  O assistente definitivo para Autônomos e CLT. Organize finanças, calcule DARFs e audite seus riscos fiscais de forma 100% privada e offline via Web App.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://nb-controle-ir.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-xl active:scale-95 group text-sm"
                  >
                    <span>Acessar NB Meu IR</span>
                    <i className="fas fa-external-link-alt text-[10px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </a>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <div className="bg-slate-700/5 absolute inset-0 blur-[80px] rounded-full scale-75"></div>
                <img 
                  src="https://images.unsplash.com/photo-1454165833767-027ffea9e78b?auto=format&fit=crop&q=80&w=600" 
                  alt="Interface Meu IR" 
                  className="relative z-10 rounded-[2.5rem] shadow-2xl border-4 border-white max-w-full h-auto lg:max-h-[400px] object-cover transform lg:-rotate-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Galeria de Interface do App */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Tour pela Interface</h2>
              <p className="text-gray-500 max-w-2xl">Visualização otimizada para controle contábil e gestão de impostos 2026.</p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
              {appScreens.map((screen, idx) => (
                <div key={idx} className="min-w-[220px] md:min-w-[260px] snap-center flex flex-col items-center text-center">
                  <div className="bg-white rounded-[2rem] p-1.5 shadow-xl border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform duration-500">
                    <img 
                      src={screen.img} 
                      alt={screen.title} 
                      className="rounded-[1.5rem] w-full aspect-[3/4] object-cover"
                    />
                  </div>
                  <h4 className="font-black text-gray-900 text-xs mb-2 uppercase tracking-tighter">{screen.title}</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed max-w-[180px] font-medium uppercase tracking-tighter">{screen.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center bg-gray-50 border-t border-gray-100">
           <h3 className="text-2xl font-black text-gray-900 mb-8">Pronto para dominar sua proteção fiscal?</h3>
           <a 
            href="https://nb-controle-ir.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-800 transition transform active:scale-95 flex items-center gap-3 mx-auto w-max"
           >
             Acessar NB Meu IR <i className="fas fa-arrow-right text-[10px]"></i>
           </a>
        </section>
      </div>
    );
  }

  // Preço Certo
  const precoCertoScreens = [
    {
      title: "Scanner de Nota",
      desc: "IA que lê DANFEs em segundos e extrai custos reais.",
      img: "https://images.unsplash.com/photo-1556742049-13da73667422?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Cálculo de Margem",
      desc: "Defina seu lucro e veja o preço sugerido com impostos.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Gestão de Lotes",
      desc: "Diferencia fardos de unidades automaticamente.",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Histórico de Lucro",
      desc: "Acompanhe a evolução da sua margem por produto.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      {/* Hero Preço Certo - Reduzido e Ajustado */}
      <section className="pt-16 pb-24 bg-blue-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <i className="fas fa-rocket"></i> App NB Preço Certo
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Sua câmera é agora seu <br/><span className="text-blue-700">precificador.</span>
              </h1>
              <div className="text-base text-gray-600 mb-8 leading-relaxed max-w-xl space-y-4">
                <p>
                  O <strong>NB Preço Certo</strong> é um assistente inteligente de precificação para pequenos lojistas. Ele elimina o erro humano e o prejuízo ao transformar automaticamente suas notas fiscais de compra em preços de venda lucrativos.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://nb-pre-o-certo.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-xl active:scale-95 group text-sm"
                >
                  <span>Acessar NB Preço Certo</span>
                  <i className="fas fa-external-link-alt text-[10px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </a>
              </div>
              <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <i className="fas fa-bolt mr-2"></i> Tecnologia OCR de Alta Precisão
              </p>
            </div>
            
            <div className="relative flex justify-center">
              <div className="bg-blue-700/10 absolute inset-0 blur-[80px] rounded-full scale-75"></div>
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=600" 
                alt="App Interface" 
                className="relative z-10 rounded-[2.5rem] shadow-2xl border-4 border-white max-w-full h-auto lg:max-h-[380px] object-cover transform lg:rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tour pela Interface - Preço Certo */}
      <section className="py-24 bg-white overflow-hidden border-y border-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Tecnologia em Ação</h2>
            <p className="text-gray-500 max-w-2xl">Veja como o app automatiza tarefas que antes levavam horas.</p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
            {precoCertoScreens.map((screen, idx) => (
              <div key={idx} className="min-w-[220px] md:min-w-[260px] snap-center flex flex-col items-center text-center">
                <div className="bg-white rounded-[2rem] p-1.5 shadow-xl border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform duration-500">
                  <img 
                    src={screen.img} 
                    alt={screen.title} 
                    className="rounded-[1.5rem] w-full aspect-[3/4] object-cover"
                  />
                </div>
                <h4 className="font-black text-gray-900 text-xs mb-2 uppercase tracking-tighter">{screen.title}</h4>
                <p className="text-gray-500 text-[10px] leading-relaxed max-w-[180px] font-medium uppercase tracking-tighter">{screen.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que o app faz por você - Detalhado */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">O que o app faz por você</h2>
            <p className="text-gray-500 max-w-2xl mx-auto uppercase text-xs font-bold tracking-widest">Funcionalidades focadas em eliminar prejuízos e maximizar lucros.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600 text-xl group-hover:scale-110 transition-transform">
                <i className="fas fa-camera"></i>
              </div>
              <h3 className="text-lg font-black mb-4">Scanner de Notas (IA)</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Você tira uma foto da nota fiscal (DANFE) e o app lê instantaneamente o fornecedor, os produtos, as quantidades e os custos.</p>
            </div>
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-8 text-green-600 text-xl group-hover:scale-110 transition-transform">
                <i className="fas fa-boxes-stacked"></i>
              </div>
              <h3 className="text-lg font-black mb-4">Fardo vs Unidade</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Identifica sozinho se você comprou uma caixa (ex: com 12 unidades) e já calcula o custo individual de cada item.</p>
            </div>
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-8 text-purple-600 text-xl group-hover:scale-110 transition-transform">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-lg font-black mb-4">Cálculo de Margem Real</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Aplica seu lucro, soma os impostos do negócio e adiciona um "Fator de Correção" para cobrir fretes e perdas.</p>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 text-amber-600 text-xl group-hover:scale-110 transition-transform">
                <i className="fas fa-pen-to-square"></i>
              </div>
              <h3 className="text-lg font-black mb-4">Edição em Tempo Real</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Se você quiser mudar um valor, todos os campos são editáveis antes de gerar o preço final.</p>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 text-xl group-hover:scale-110 transition-transform">
                <i className="fas fa-history"></i>
              </div>
              <h3 className="text-lg font-black mb-4">Gestão de Lucro</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Mostra quanto você vai ganhar em cada produto e mantém um histórico completo de todas as suas compras.</p>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center">
              <i className="fas fa-shield-check text-4xl mb-6"></i>
              <h3 className="text-lg font-black mb-2 leading-none uppercase tracking-tighter">Fim do prejuízo</h3>
              <p className="text-blue-100 text-[10px] leading-relaxed uppercase font-bold tracking-widest">Garanta que você nunca mais perca dinheiro por calcular preços "de cabeça".</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 text-center bg-gray-900 text-white rounded-[4rem] mx-4 mb-20 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
         <h3 className="text-2xl md:text-4xl font-black mb-10 relative z-10">Otimize suas margens hoje mesmo.</h3>
         <a 
          href="https://nb-pre-o-certo.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-base shadow-2xl hover:bg-blue-500 transition active:scale-95 flex items-center gap-3 mx-auto w-max relative z-10"
         >
           Acessar NB Preço Certo <i className="fas fa-chevron-right text-xs"></i>
         </a>
      </section>
    </div>
  );
};

export default AppDetailPage;
