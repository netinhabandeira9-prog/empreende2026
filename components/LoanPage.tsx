
import React from 'react';
import LoanCalculator from './calculators/LoanCalculator';

const LoanPage: React.FC = () => {
  return (
    <div className="animate-fadeIn min-h-screen">
      {/* Hero Section Vendas */}
      <section className="relative pt-24 pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">Parceiro Oficial Confia Crédito</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                Dinheiro rápido, <span className="text-green-500">sem burocracia</span> e com segurança.
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Seu crédito aprovado e liberado em até <span className="text-gray-900 font-black">24 horas</span> diretamente na sua conta. Simples, transparente e 100% digital.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Liberação em 24h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-700">100% Seguro</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
               {/* Simulação de um post do Instagram ou Card de Impacto */}
               <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl transform rotate-1 md:rotate-2 relative z-20 overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1579621970795-87f967b1658c?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-[450px] object-cover rounded-[2.5rem] opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                    alt="Confia Crédito"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="bg-green-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-xl shadow-green-500/30">
                      <i className="fas fa-hand-holding-dollar"></i>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">Precisa de crédito? <br/>A Confia te ajuda!</h3>
                    <p className="text-green-300 font-bold text-sm">Empréstimo fácil e sem enrolação.</p>
                  </div>
               </div>
               {/* Decorative background circle */}
               <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Calculadora (O Coração da Página) */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Escolha sua modalidade</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Temos a linha de crédito ideal para o seu perfil. Selecione abaixo para simular taxas e prazos reais.</p>
          </div>

          <div className="bg-white rounded-[3.5rem] p-6 md:p-12 shadow-2xl shadow-green-900/5 border border-white">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* Benefícios Confia */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:bg-green-500 hover:text-white transition-all duration-500 group">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-clock text-xl"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Agilidade Total</h3>
              <p className="opacity-70 text-sm leading-relaxed">Processo 100% digital com resposta imediata e liberação em poucas horas na sua conta corrente ou poupança.</p>
            </div>
            
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:bg-green-500 hover:text-white transition-all duration-500 group">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-face-smile text-xl"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Sem Consulta SPC</h3>
              <p className="opacity-70 text-sm leading-relaxed">Modalidades como Antecipação de FGTS e Consignado não levam em conta seu Score para aprovação imediata.</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:bg-green-500 hover:text-white transition-all duration-500 group">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-headset text-xl"></i>
              </div>
              <h3 className="text-xl font-black mb-4">Atendimento Humano</h3>
              <p className="opacity-70 text-sm leading-relaxed">Nada de robôs confusos. Nossa equipe especializada acompanha cada passo da sua contratação via WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-600 rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-green-500/20">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Pronto para tirar <br/>seus planos do papel?</h2>
              <p className="text-green-100 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
                Fale agora com um especialista da Confia e receba uma proposta personalizada sem compromisso.
              </p>
              <a 
                href="https://api.whatsapp.com/send/?phone=5588996842061&text=Ol%C3%A1!%20Vi%20a%20p%C3%A1gina%20da%20Confia%20no%20Empreende2026%20e%20gostaria%20de%20falar%20com%20um%20atendente%20para%20contratar%20meu%20empr%C3%A9stimo.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-green-600 px-12 py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-gray-100 transition transform active:scale-95"
              >
                <i className="fab fa-whatsapp text-2xl"></i>
                Falar com Atendimento
              </a>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:40px_40px]"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanPage;
