
import React from 'react';
import { CalculatorType } from '../types';

interface HeroProps {
  onSelectTool: (tool: CalculatorType) => void;
  onSelectConsultant: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectTool, onSelectConsultant }) => {
  return (
    <div className="relative bg-blue-900 overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000" 
          alt="Finanças" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Navegue na Reforma Tributária de 2026
        </h1>
        <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
          Ferramentas completas para o MEI e Autônomo prosperarem com as novas regras do IBS, CBS e gestão financeira de ponta.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onSelectTool(CalculatorType.TAX)}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-lg transition transform active:scale-95"
          >
            Calculadora de Impostos
          </button>
          <button 
            onClick={onSelectConsultant}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg transition transform active:scale-95"
          >
            Consultoria IA Grátis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
