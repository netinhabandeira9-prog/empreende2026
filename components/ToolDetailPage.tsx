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
          image: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=800",
          faq: [
            { q: "O que é a alíquota de transição de 1%?", a: "Em 2026, o Brasil inicia um teste prático da reforma tributária com 0,9% de CBS e 0,1% de IBS para ajustar os sistemas arrecadadores." },
            { q: "Como o MEI deve se preparar?", a: "O MEI deve continuar no Simples Nacional, mas precisa monitorar as notas de compra, que passarão a gerar créditos tributários no futuro." }
          ]
        };
      case CalculatorType.VACATION:
        return {
          title: "Calculadora de Férias 2026",
          intro: "Simule quanto você vai receber no seu período de descanso com as novas alíquotas de desconto.",
          importance: "Garanta que seus direitos trabalhistas estão sendo calculados corretamente conforme a lei atual.",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
          faq: [
            { q: "Como calcular o 1/3 constitucional?", a: "Basta dividir o seu salário bruto por 3. Esse valor é somado ao seu salário no mês de férias." },
            { q: "O abono pecuniário vale a pena?", a: "Vender 10 dias de férias pode ser vantajoso financeiramente, mas deve ser avaliado conforme o cansaço do trabalhador." }
          ]
        };
      case CalculatorType.PRICING:
        return {
          title: "Gestão de Preços e Margens",
          intro: "Defina o preço ideal para seus produtos ou serviços baseado na margem de contribuição.",
          importance: "Cobrar o valor correto é o que separa um negócio lucrativo de um prejuízo invisível.",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
          faq: [
            { q: "O que é Markup?", a: "É um multiplicador aplicado sobre o custo de um produto para encontrar o preço de venda necessário para cobrir despesas e gerar lucro." },
            { q: "Como a reforma afeta o preço?", a: "Como os novos impostos incidem sobre o valor agregado, sua precificação deve ser ajustada para não perder competitividade." }
          ]
        };
      default:
        return {
          title: "Calculadora de Negócios",
          intro: "Ferramentas essenciais para o dia a dia do empreendedor e trabalhador.",
          importance: "Dados precisos para decisões inteligentes.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
          faq: []
        };
    }
  };

  const info = getContent();

  return (
    <div className="py-20 animate-fadeIn bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              Simulador Editorial 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">{info.title}</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{info.intro}</p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl mb-8">
              <h4 className="font-bold text-blue-900 mb-2">Orientações Técnicas</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Nossos algoritmos são validados por consultores contábeis especializados no cenário da Reforma de 2026. Use os resultados como base para seu planejamento estratégico semestral.
              </p>
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

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 border border-gray-100 overflow-hidden mb-16">
          <Calculator activeTool={toolType} onToolChange={onToolChange} />
        </div>

        {info.faq.length > 0 && (
          <div className="bg-gray-50 rounded-[3rem] p-10 md:p-16">
            <h3 className="text-2xl font-black text-gray-900 mb-10 text-center uppercase tracking-widest">Guia Rápido & Perguntas Frequentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {info.faq.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <h5 className="font-black text-blue-700 text-sm uppercase tracking-wider flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">Q</span>
                    {item.q}
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed pl-9">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetailPage;