
import React, { useEffect, useState } from 'react';
import LoanCalculator from './calculators/LoanCalculator';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { LoanService } from '../types';

const LoanPage: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/confia_creditofacilseguro/";
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fotos padrão solicitadas com descrições removidas conforme solicitado
  const defaultServices: LoanService[] = [
    {
      id: "default-fgts",
      title: "Consignado Privado",
      description: "",
      image_url: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=600",
      icon: "fa-briefcase",
      active: true
    },
    {
      id: "default-inss",
      title: "Aposentados & INSS",
      description: "",
      image_url: "https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?auto=format&fit=crop&q=80&w=600",
      icon: "fa-person-cane",
      active: true
    },
    {
      id: "default-bolsa",
      title: "Bolsa Família",
      description: "",
      image_url: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=600",
      icon: "fa-house-chimney-user",
      active: true
    },
    {
      id: "default-servidor",
      title: "Servidor Público",
      description: "",
      image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
      icon: "fa-building-columns",
      active: true
    },
    {
      id: "default-empresa",
      title: "Empresas & Equipes",
      description: "",
      image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
      icon: "fa-users-gear",
      active: true
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      if (!isSupabaseConfigured) {
        setLoanServices(defaultServices);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('loan_services').select('*').eq('active', true).order('order_index', { ascending: true });
        if (data && data.length > 0) {
          setLoanServices(data);
        } else {
          setLoanServices(defaultServices);
        }
      } catch (err) {
        setLoanServices(defaultServices);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="animate-fadeIn min-h-screen selection:bg-green-100 bg-white">
      {/* Hero Section Vendas */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-5/12 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-100 rounded-full mb-8 shadow-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[11px] font-black text-green-700 uppercase tracking-[0.25em]">Parceiro Oficial Confia Crédito</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.85] tracking-tighter">
                Dinheiro na mão, <br/><span className="text-green-500">planos em ação.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A <strong>Confia</strong> entende o empreendedor. Crédito liberado em até <span className="text-gray-900 font-black underline decoration-green-400 decoration-4 underline-offset-4">24 horas</span> diretamente na sua conta.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start mb-12">
                <a 
                  href="#simulator" 
                  className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-gray-800 transition transform active:scale-95"
                >
                  Simular Agora
                </a>
                <a 
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white border-2 border-pink-100 text-pink-600 px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-pink-50 transition transform active:scale-95 shadow-lg"
                >
                  <i className="fab fa-instagram text-xl"></i>
                  Siga a Confia
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                    <i className="fas fa-bolt text-lg"></i>
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest leading-tight">Rápido &<br/>Digital</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                    <i className="fas fa-shield-halved text-lg"></i>
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest leading-tight">Seguro &<br/>Garantido</span>
                </div>
              </div>
            </div>

            {/* CARROSSEL INFINITO NO HERO (Esquerda para Direita) */}
            <div className="lg:w-7/12 relative w-full overflow-hidden mask-linear-horizontal py-10">
               <div className="flex gap-6 animate-scrollRight whitespace-nowrap">
                  {[...loanServices, ...loanServices, ...loanServices].map((item, i) => (
                    <div 
                      key={`${item.id}-${i}`} 
                      className="inline-block min-w-[320px] md:min-w-[380px] h-[500px] bg-gray-900 rounded-[3.5rem] relative overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                    >
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1556742049-13da73667422?auto=format&fit=crop&q=80&w=800'} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-60 grayscale-[40%] hover:grayscale-0 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-10 left-10 right-10">
                        <div className="bg-green-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-xl shadow-green-500/30">
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight mb-2 whitespace-normal">{item.title}</h3>
                        {item.description && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
               
               {/* Instagram Badge Floating */}
               <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-30 hidden lg:block">
                  <a 
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-2xl shadow-2xl shadow-pink-500/20 flex flex-col items-center gap-1 border border-pink-100 hover:scale-110 transition-transform group"
                  >
                    <i className="fab fa-instagram text-3xl text-pink-500 group-hover:rotate-12 transition-transform"></i>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Confia Reels</span>
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Section */}
      <section id="simulator" className="py-24 bg-gray-50 border-y border-gray-100 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Simulador Confia 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Qual o tamanho do seu sonho?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Temos taxas competitivas para cada perfil. Escolha a modalidade, digite o valor e receba sua proposta personalizada agora.
            </p>
          </div>

          <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl shadow-green-900/5 border border-white relative overflow-hidden">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* Pilares da Confiança */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:bg-white hover:border-green-100">
              <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform">
                <i className="fas fa-bolt-lightning text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Aprovação em Minutos</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Sabemos que o tempo é dinheiro. Por isso, nosso sistema analisa sua solicitação em minutos e libera o depósito no mesmo dia útil.
              </p>
            </div>

            <div className="relative group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:bg-white hover:border-green-100">
              <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform">
                <i className="fas fa-hand-holding-heart text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Atendimento Humanizado</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Fale com especialistas reais. A Confia prioriza a relação próxima com o cliente para garantir a melhor experiência de crédito.
              </p>
            </div>

            <div className="relative group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:bg-white hover:border-green-100">
              <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform">
                <i className="fas fa-shield-check text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Segurança Absoluta</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Processos transparentes e seguindo todas as normas do Banco Central. Seus dados estão protegidos com criptografia de ponta a ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final com Prova Social */}
      <section className="pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[3s]"></div>
             
             <div className="relative z-10">
                <div className="flex justify-center mb-10 text-white">
                   <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm flex items-center gap-4 hover:bg-white/10 transition"
                   >
                      <div className="flex -space-x-3">
                         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-gray-900 object-cover" />
                         <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-gray-900 object-cover" />
                         <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-gray-900 object-cover" />
                      </div>
                      <div className="flex items-center gap-2">
                         <i className="fab fa-instagram text-pink-500"></i>
                         <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Siga @confia_creditofacilseguro</span>
                      </div>
                   </a>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                  Sua jornada de <br/>sucesso começa aqui.
                </h2>
                <p className="text-green-300 text-xl md:text-2xl font-bold mb-14 max-w-2xl mx-auto leading-relaxed">
                  Não deixe a oportunidade passar. Clique abaixo e fale agora com a <span className="text-white underline decoration-green-500">Confia Crédito</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a 
                    href="https://api.whatsapp.com/send/?phone=5588996842061&text=Ol%C3%A1!%20Estou%20na%20p%C3%A1gina%20da%20Confia%20no%20Empreende2026%20e%20gostaria%20de%20falar%20com%20um%20atendente%20para%20contratar%20meu%20empr%C3%A9stimo.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition transform active:scale-95"
                  >
                    <i className="fab fa-whatsapp text-3xl"></i>
                    Falar com a Confia
                  </a>
                  <a 
                    href={instagramUrl}
                    target="_blank"
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl backdrop-blur-md border border-white/10 transition flex items-center justify-center gap-4"
                  >
                    <i className="fab fa-instagram text-3xl"></i>
                    Ver Instagram
                  </a>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanPage;
