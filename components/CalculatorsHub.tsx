
import React from 'react';
import { CalculatorType } from '../types';

interface CalculatorsHubProps {
  onSelectTool: (tool: CalculatorType) => void;
}

const CalculatorsHub: React.FC<CalculatorsHubProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: CalculatorType.TAX,
      title: "Simulador Tributário 2026",
      desc: "Cálculo de IBS, CBS e IRRF para MEI e Autônomos com regras de 2026.",
      icon: "fa-university",
      color: "blue",
      category: "Empresarial"
    },
    {
      id: CalculatorType.VACATION,
      title: "Cálculo de Férias",
      desc: "Simule o valor a receber com 1/3 constitucional e abono pecuniário.",
      icon: "fa-umbrella-beach",
      color: "green",
      category: "RH & Trabalhador"
    },
    {
      id: CalculatorType.TERMINATION,
      title: "Rescisão de Contrato",
      desc: "Estimativa completa de verbas rescisórias para CLT e pedidos de demissão.",
      icon: "fa-file-signature",
      color: "red",
      category: "RH & Trabalhador"
    },
    {
      id: CalculatorType.RETIREMENT,
      title: "Previsão Aposentadoria",
      desc: "Simule quanto tempo falta baseado nas regras atuais de idade e contribuição.",
      icon: "fa-hourglass-half",
      color: "amber",
      category: "Previdência"
    },
    {
      id: CalculatorType.PRICING,
      title: "Precificação e Lucro",
      desc: "Calcule o preço ideal para seus serviços garantindo sua margem de lucro.",
      icon: "fa-tag",
      color: "purple",
      category: "Empresarial"
    },
    {
      id: CalculatorType.BREAK_EVEN,
      title: "Ponto de Equilíbrio",
      desc: "Saiba exatamente quanto vender para cobrir seus custos fixos.",
      icon: "fa-balance-scale",
      color: "orange",
      category: "Empresarial"
    }
  ];

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            Ferramentas de Precisão 2026
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">Central de Calculadoras</h1>
          <p className="text-xl text-gray-500">Ferramentas desenhadas tanto para o empreendedor quanto para o trabalhador. Escolha um simulador abaixo para começar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group cursor-pointer bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col items-start"
            >
              <div className="flex justify-between w-full mb-6">
                <div className={`bg-${tool.color}-100 text-${tool.color}-600 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${tool.icon}`}></i>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-start pt-2">{tool.category}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">{tool.desc}</p>
              <span className={`text-${tool.color}-600 font-bold text-sm flex items-center mt-auto`}>
                Simular Agora <i className="fas fa-chevron-right ml-2 text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorsHub;
