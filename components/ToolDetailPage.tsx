
import React from 'react';
import { CalculatorType } from '../types';
import Calculator from './Calculator';

interface ToolDetailPageProps {
  toolType: CalculatorType;
  onToolChange: (tool: CalculatorType) => void;
}

const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ toolType, onToolChange }) => {
  const getContent = () => {
    switch (toolType) {
      case CalculatorType.TAX:
        return {
          title: "Simulador Tributário 2026",
          intro: "Descubra como os novos impostos IBS e CBS impactam seu lucro em 2026.",
          importance: "Planejamento é a base da sobrevivência no novo regime fiscal.",
          image: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=800"
        };
      case CalculatorType.VACATION:
        return {
          title: "Calculadora de Férias 2026",
          intro: "Simule quanto você vai receber no seu período de descanso com as novas alíquotas de desconto.",
          importance: "Garanta que seus direitos trabalhistas estão sendo calculados corretamente conforme a lei atual.",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
        };
      case CalculatorType.TERMINATION:
        return {
          title: "Simulador de Verbas Rescisórias",
          intro: "Calcule os valores devidos em caso de fim de contrato, seja por demissão ou pedido de saída.",
          importance: "Evite erros em homologações e tenha clareza sobre seu acerto final.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
        };
      case CalculatorType.RETIREMENT:
        return {
          title: "Simulador de Aposentadoria 2026",
          intro: "Confira sua idade mínima e tempo de contribuição necessário para se aposentar no INSS ou RPPS.",
          importance: "A regra de transição de 2026 é fundamental para seu planejamento de longo prazo.",
          image: "https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=800"
        };
      case CalculatorType.PRICING:
        return {
          title: "Gestão de Preços e Margens",
          intro: "Defina o preço ideal para seus produtos ou serviços baseado na margem de contribuição.",
          importance: "Cobrar o valor correto é o que separa um negócio lucrativo de um prejuízo invisível.",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
        };
      case CalculatorType.BREAK_EVEN:
        return {
          title: "Cálculo do Ponto de Equilíbrio",
          intro: "Saiba quanto você precisa vender para cobrir todos os seus custos fixos e variáveis.",
          importance: "O Ponto de Equilíbrio é o seu norte de vendas mensal para não fechar no vermelho.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
        };
      default:
        return {
          title: "Calculadora de Negócios",
          intro: "Ferramentas essenciais para o dia a dia do empreendedor e trabalhador.",
          importance: "Dados precisos para decisões inteligentes.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
        };
    }
  };

  const info = getContent();

  return (
    <div className="py-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              Simulador 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">{info.title}</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{info.intro}</p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl">
              <h4 className="font-bold text-blue-900 mb-2">Para que serve?</h4>
              <p className="text-blue-800 text-sm">{info.importance}</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-gray-100 rounded-[3rem] p-4">
              <img 
                src={info.image} 
                className="rounded-[2.5rem] shadow-2xl grayscale-[30%] hover:grayscale-0 transition-all duration-700 w-full h-[400px] object-cover"
                alt={info.title}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 border border-gray-100 overflow-hidden">
          <Calculator activeTool={toolType} onToolChange={onToolChange} />
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
