
import React from 'react';

const SonoScorePage: React.FC = () => {
  const sonoScoreUrl = "https://sonoscorepro.com.br"; // Link de exemplo para o parceiro

  const benefits = [
    {
      icon: "fa-brain",
      title: "Clareza Mental",
      desc: "Uma noite bem dormida melhora a capacidade de tomada de decisão em até 40%. Para o empreendedor, decidir rápido e certo é o que define o lucro."
    },
    {
      icon: "fa-bolt",
      title: "Energia Metabólica",
      desc: "O sono regula os hormônios da fome e energia. Menos cansaço significa mais disposição para enfrentar reuniões e maratonas de trabalho."
    },
    {
      icon: "fa-shield-heart",
      title: "Saúde a Longo Prazo",
      desc: "Dormir bem reduz riscos cardíacos e burnout, garantindo que você esteja presente para colher os frutos do seu negócio no futuro."
    }
  ];

  return (
    <div className="bg-[#0f172a] text-white min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <i className="fas fa-star text-indigo-400 text-xs"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Biohacking & Performance Empreendedora</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
            Seu próximo bilhão <br/>começa no <span className="text-indigo-400">travesseiro.</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Descubra como a qualidade do seu sono impacta diretamente o valuation da sua empresa. Conheça o <strong>Sono Score Pro</strong>.
          </p>

          <a 
            href={sonoScoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-600/30 transition transform active:scale-95 group"
          >
            <span>Conhecer o Sono Score Pro</span>
            <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </a>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all group">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className={`fas ${benefit.icon} text-indigo-400 text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed italic">"{benefit.desc}"</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/40 border border-indigo-500/20 rounded-[4rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Como o Sono Score Pro ajuda?</h2>
              <div className="space-y-6">
                {[
                  "Monitoramento científico de ciclos REM e Sono Profundo.",
                  "Relatórios personalizados para ajustes de rotina empresarial.",
                  "Insights baseados em IA para otimizar o horário de despertar.",
                  "Sincronização com dispositivos de saúde (Smartwatches)."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                      <i className="fas fa-check text-[10px] text-white"></i>
                    </div>
                    <p className="text-indigo-100 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800" 
                alt="Sono e Produtividade" 
                className="rounded-[3rem] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 p-8 rounded-[2rem] shadow-xl">
                <p className="text-4xl font-black mb-1">98%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Satisfação dos Usuários</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-10">Não deixe seu sucesso virar insônia.</h2>
          <a 
            href={sonoScoreUrl}
            target="_blank"
            className="inline-block bg-white text-indigo-900 px-16 py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-50 transition active:scale-95"
          >
            Acessar Sono Score Pro Agora
          </a>
        </div>
      </section>
    </div>
  );
};

export default SonoScorePage;
