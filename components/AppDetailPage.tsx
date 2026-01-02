
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
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400"
      }
    ];

    return (
      <div className="bg-white min-h-screen animate-fadeIn">
        {/* Hero Meu IR */}
        <section className="pt-20 pb-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                  <i className="fas fa-shield-halved"></i> NB Meu IR - Carnê-Leão Fácil
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                  Sua proteção contra a <br/><span className="text-blue-700">malha fina.</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
                  O assistente definitivo para Autônomos e CLT. Organize finanças, calcule DARFs e audite seus riscos fiscais de forma 100% privada e offline via Web App.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://nb-controle-ir.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-xl shadow-blue-700/10 active:scale-95 group"
                  >
                    <span className="text-base">Acessar NB Meu IR</span>
                    <i className="fas fa-external-link-alt text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  </a>
                </div>
                <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <i className="fas fa-globe mr-2"></i> Aplicativo Web - Sem necessidade de baixar na loja
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-slate-700/5 absolute inset-0 blur-[100px] rounded-full scale-75"></div>
                <img 
                  src="https://images.unsplash.com/photo-1454165833767-027ffea9e78b?auto=format&fit=crop&q=80&w=800" 
                  alt="Interface Meu IR" 
                  className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white transform lg:-rotate-2 hover:rotate-0 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Galeria de Interface do App - IMAGENS MENORES E MAIS RELEVANTES */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Tour pela Interface</h2>
              <p className="text-gray-500 max-w-2xl">Visualização otimizada para controle contábil e gestão de impostos 2026.</p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory mask-linear-horizontal">
              {appScreens.map((screen, idx) => (
                <div key={idx} className="min-w-[240px] md:min-w-[280px] snap-center flex flex-col items-center">
                  <div className="bg-white rounded-[2rem] p-1.5 shadow-xl border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform duration-500">
                    <img 
                      src={screen.img} 
                      alt={screen.title} 
                      className="rounded-[1.5rem] w-full aspect-[3/4] object-cover"
                    />
                  </div>
                  <h4 className="font-black text-gray-900 text-sm mb-2">{screen.title}</h4>
                  <p className="text-gray-500 text-[10px] text-center leading-relaxed max-w-[200px] font-medium uppercase tracking-tighter">{screen.desc}</p>
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
            className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-blue-800 transition transform active:scale-95 flex items-center gap-3 mx-auto w-max"
           >
             Acessar NB Meu IR <i className="fas fa-arrow-right text-xs"></i>
           </a>
           <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Funciona em qualquer navegador</p>
        </section>
      </div>
    );
  }

  // Preço Certo
  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      {/* Hero Preço Certo */}
      <section className="pt-20 pb-32 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <i className="fas fa-rocket"></i> App NB Preço Certo
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                Sua câmera é agora seu <br/><span className="text-blue-700">precificador.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
                O único web app que lê notas fiscais por foto ou PDF e calcula automaticamente o preço de venda ideal para garantir o lucro que você deseja.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://nb-pre-o-certo.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition shadow-xl shadow-blue-700/10 active:scale-95 group"
                >
                  <span className="text-base">Acessar NB Preço Certo</span>
                  <i className="fas fa-external-link-alt text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                </a>
              </div>
              <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <i className="fas fa-globe mr-2"></i> Web App Otimizado - Acesse direto do seu celular
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-blue-700/10 absolute inset-0 blur-[100px] rounded-full scale-75"></div>
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                alt="App Interface" 
                className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Como funciona a mágica?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Tecnologia OCR e Inteligência Artificial trabalhando juntas para simplificar sua gestão.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform text-blue-600 text-3xl">
                <i className="fas fa-camera"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Capture ou Suba</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Tire foto da nota fiscal de compra ou suba o arquivo XML/PDF. O app extrai todos os custos automaticamente.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform text-green-600 text-3xl">
                <i className="fas fa-percentage"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Margem de Lucro</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Defina a porcentagem de lucro que deseja. O app já abate os novos impostos (IBS/CBS) e taxas de cartão.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform text-purple-600 text-3xl">
                <i className="fas fa-check-double"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Preço Validado</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Pronto! Você tem o preço de venda final. Salve no histórico e monitore sua evolução de lucro por item.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 text-center bg-gray-900 text-white rounded-[5rem] mx-4 mb-20">
         <h3 className="text-3xl font-black mb-10">Otimize suas margens hoje mesmo.</h3>
         <a 
          href="https://nb-pre-o-certo.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-blue-500 transition active:scale-95 flex items-center gap-3 mx-auto w-max"
         >
           Acessar NB Preço Certo <i className="fas fa-chevron-right text-sm"></i>
         </a>
      </section>
    </div>
  );
};

export default AppDetailPage;
