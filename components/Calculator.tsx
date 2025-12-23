
import React from 'react';
import { CalculatorType } from '../types';

// Importação das calculadoras independentes
import TaxCalculator from './calculators/TaxCalculator';
import TerminationCalculator from './calculators/TerminationCalculator';
import PricingCalculator from './calculators/PricingCalculator';
import VacationCalculator from './calculators/VacationCalculator';
import BreakEvenCalculator from './calculators/BreakEvenCalculator';
import RetirementCalculator from './calculators/RetirementCalculator';

interface CalculatorProps {
  activeTool: CalculatorType;
  onToolChange: (tool: CalculatorType) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ activeTool, onToolChange }) => {
  
  const renderSelectedCalculator = () => {
    switch (activeTool) {
      case CalculatorType.TAX:
        return <TaxCalculator />;
      case CalculatorType.TERMINATION:
        return <TerminationCalculator />;
      case CalculatorType.PRICING:
        return <PricingCalculator />;
      case CalculatorType.VACATION:
        return <VacationCalculator />;
      case CalculatorType.BREAK_EVEN:
        return <BreakEvenCalculator />;
      case CalculatorType.RETIREMENT:
        return <RetirementCalculator />;
      default:
        return <TaxCalculator />;
    }
  };

  return (
    <section className="p-4 md:p-12 animate-fadeIn overflow-hidden">
      {/* MENU DE FERRAMENTAS - SELETOR SUPERIOR */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 mb-10 pb-4">
        {[
          { id: CalculatorType.TAX, label: 'Impostos', icon: 'fa-university', color: 'blue' },
          { id: CalculatorType.TERMINATION, label: 'Rescisão', icon: 'fa-file-signature', color: 'red' },
          { id: CalculatorType.PRICING, label: 'Preços', icon: 'fa-tag', color: 'purple' },
          { id: CalculatorType.VACATION, label: 'Férias', icon: 'fa-umbrella-beach', color: 'green' },
          { id: CalculatorType.BREAK_EVEN, label: 'Equilíbrio', icon: 'fa-balance-scale', color: 'orange' },
          { id: CalculatorType.RETIREMENT, label: 'Previdência', icon: 'fa-hourglass-half', color: 'amber' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => onToolChange(t.id)}
            className={`px-6 py-4 rounded-2xl border-2 transition-all flex items-center space-x-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap shrink-0 ${
              activeTool === t.id 
              ? `border-${t.color}-600 bg-${t.color}-600 text-white shadow-xl scale-105` 
              : 'border-gray-100 bg-white text-gray-400 hover:text-gray-900'
            }`}
          >
            <i className={`fas ${t.icon}`}></i>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm min-h-[550px]">
        {renderSelectedCalculator()}
      </div>
    </section>
  );
};

export default Calculator;
