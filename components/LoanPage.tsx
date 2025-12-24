
import React, { useEffect, useState } from 'react';
import LoanCalculator from './calculators/LoanCalculator';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { LoanService } from '../types';

const LoanPage: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/confia_creditofacilseguro/";
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            {/* Bloco de Texto Superior */}
            <div className="w-full text-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-100 rounded-full mb-6 shadow-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-[0.25em]">Parceiro Oficial Confia Crédito</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                Dinheiro na mão, <br/><span className="text-green-500">planos em ação.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Crédito liberado em até <span className="text-gray-900 font-black underline decoration-green-400 decoration-2 underline-offset-4">24 horas</span> diretamente na sua conta.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 px-4">
                <a 
                  href="#simulator" 
                  className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition transform active:scale-95"
                >
                  Simular Agora
                </a>
                <a 
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white border-2 border-pink-100 text-pink-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-pink-50 transition transform active:scale-95"
                >
                  <i className="fab fa-instagram text-lg"></i>
                  Siga a Confia
                </a>
              </div>
            </div>

            {/* CARROSSEL - INFINITO E CONTÍNUO */}
            <div className="w-full relative overflow-hidden mask-linear-horizontal py-8">
               <div className="flex gap-4 md:gap-8 animate-infiniteScroll whitespace-nowrap w-max">
                  {/* Duplicamos os itens para garantir o scroll infinito sem quebras */}
                  {[...loanServices, ...loanServices].map((item, i) => (
                    <div 
                      key={`${item.id}-${i}`} 
                      className="inline-block min-w-[140px] md:min-w-[380px] h-[200px] md:h-[500px] bg-gray-900 rounded-[1.5rem] md:rounded-[3.5rem] relative overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
                    >
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1556742049-13da73667422?auto=format&fit=crop&q=80&w=800'} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-70" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-10">
                        <div className="bg-green-500 text-white w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-2xl flex items-center justify-center text-[12px] md:text-2xl mb-2 shadow-xl">
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <h3 className="text-[12px] md:text-3xl font-black text-white leading-tight mb-1 whitespace-normal break-words">{item.title}</h3>
                        {item.description && (
                          <div className="flex items-center gap-1">
                            <span className="text-[7px] md:text-[9px] font-black text-green-400 uppercase tracking-widest bg-white/5 px-1 py-0.5 rounded-full border border-white/10">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Selos de Confiança menores */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 w-full px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                    <i className="fas fa-bolt text-base md:text-xl"></i>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-gray-700 uppercase tracking-widest leading-tight">Rápido &<br/>Digital</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                    <i className="fas fa-shield-halved text-base md:text-xl"></i>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-gray-700 uppercase tracking-widest leading-tight">Seguro &<br/>Garantido</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Section */}
      <section id="simulator" className="py-20 bg-gray-50 border-y border-gray-100 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Simulador Confia 2026
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight px-4">Qual o tamanho do seu sonho?</h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
              Temos taxas competitivas para cada perfil. Escolha a modalidade, digite o valor e receba sua proposta agora.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl shadow-green-900/5 border border-white relative overflow-hidden">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* Pilares da Confiança */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all duration-500">
              <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
                <i className="fas fa-bolt-lightning text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Aprovação em Minutos</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Sabemos que o tempo é dinheiro. Análise em minutos e depósito no mesmo dia útil.
              </p>
            </div>

            <div className="relative group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all duration-500">
              <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
                <i className="fas fa-hand-holding-heart text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Fale com especialistas reais. A Confia prioriza a relação próxima com o cliente.
              </p>
            </div>

            <div className="relative group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all duration-500">
              <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
                <i className="fas fa-shield-check text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Segurança Absoluta</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Processos transparentes seguindo normas do Banco Central. Seus dados estão protegidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final com Prova Social */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 text-center relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                  Sua jornada de <br/>sucesso começa aqui.
                </h2>
                <p className="text-green-300 text-lg md:text-2xl font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
                  Não deixe a oportunidade passar. Fale agora com a Confia Crédito.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="https://api.whatsapp.com/send/?phone=5588996842061&text=Ol%C3%A1!%20Estou%20na%20p%C3%A1gina%20da%20Confia%20no%20Empreende2026%20e%20gostaria%20de%20falar%20com%20um%20atendente%20para%20contratar%20meu%20empr%C3%A9stimo.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl flex items-center justify-center gap-4 transition transform active:scale-95"
                  >
                    <i className="fab fa-whatsapp text-2xl group-hover:rotate-12 transition-transform"></i>
                    Falar com a Confia
                  </a>
                  <a 
                    href={instagramUrl}
                    target="_blank"
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black text-lg backdrop-blur-md border border-white/10 transition flex items-center justify-center gap-4"
                  >
                    <i className="fab fa-instagram text-2xl"></i>
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