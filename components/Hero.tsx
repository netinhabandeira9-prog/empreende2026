
import React from 'react';
import { CalculatorType } from '../types';

interface HeroProps {
  onSelectTool: (tool: CalculatorType) => void;
  onSelectConsultant: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectTool, onSelectConsultant }) => {
  return (
    <div className="relative bg-blue-900 overflow-hidden py-16 sm:py-24 border-b border-blue-800">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000" 
          alt="Finanças Empreendedoras" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20">
           <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
           <span className="text-white text-[10px] font-black uppercase tracking-widest">Portal de Auxílio MEI 2026 Ativo</span>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl mb-8 leading-[0.9]">
          Navegue na Reforma <br/><span className="text-blue-400">Tributária de 2026</span>
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-6 mb-10">
          <p className="text-xl text-blue-100 leading-relaxed">
            O <strong>NB Empreende</strong> é a maior central de ferramentas e notícias para o Microempreendedor Individual (MEI) e profissionais autônomos em 2026.
          </p>
          <p className="hidden md:block text-sm text-blue-300 leading-relaxed">
            Prepare-se para a transição dos impostos ISS e ICMS para os novos IBS e CBS. Utilize nossos simuladores gratuitos para calcular sua alíquota de transição de 1%, planejar sua margem de lucro e garantir que sua empresa prospere no novo regime fiscal brasileiro.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onSelectTool(CalculatorType.TAX)}
            className="px-8 py-4 bg-white text-blue-900 font-black rounded-2xl shadow-2xl hover:bg-blue-50 transition transform active:scale-95 text-sm uppercase tracking-widest"
          >
            Calculadora Tributária
          </button>
          <button 
            onClick={onSelectConsultant}
            className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-500 transition transform active:scale-95 text-sm uppercase tracking-widest border border-blue-400/30"
          >
            Consultar IA Grátis
          </button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 text-blue-300/60 text-[10px] font-black uppercase tracking-widest">
           <span><i className="fas fa-check-circle mr-2"></i> Dados Oficiais</span>
           <span><i className="fas fa-check-circle mr-2"></i> LGPD Compliant</span>
           <span><i className="fas fa-check-circle mr-2"></i> Grátis</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
