
import React, { useState, useMemo } from 'react';
import { CalculatorTab } from '../../types';
import { TAX_RATES_2026 } from '../../constants';

const TaxCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.MEI);
  const [revenue, setRevenue] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<number>(0);

  const handleCurrencyInput = (value: string, setter: (v: string) => void) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) { setter(""); return; }
    const floatValue = parseFloat(numericValue) / 100;
    setter(floatValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const parseToNumber = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  };

  const results = useMemo(() => {
    const rev = parseToNumber(revenue);
    if (rev <= 0) return null;
    const breakdown = [];
    let totalTax = 0;
    
    if (activeTab === CalculatorTab.MEI) {
      const das = TAX_RATES_2026.MINIMUM_WAGE * TAX_RATES_2026.MEI_BASE_PERCENT;
      totalTax = das;
      breakdown.push({ label: 'Guia DAS Mensal', value: das, description: 'Fixo MEI 2026' });
      if (employeeCount > 0) {
        const emp = TAX_RATES_2026.MINIMUM_WAGE * 0.11;
        totalTax += emp;
        breakdown.push({ label: 'Custo Previdenciário', value: emp, description: 'Encargos sobre 1 Salário Mínimo' });
      }
    } else if (activeTab === CalculatorTab.ME) {
      const simples = rev * 0.06;
      totalTax = simples;
      breakdown.push({ label: 'Simples Nacional', value: simples, description: 'Anexo III (Alíquota inicial)' });
    } else {
      const cbs = rev * TAX_RATES_2026.CBS_RATE;
      const ibs = rev * TAX_RATES_2026.IBS_RATE;
      totalTax = cbs + ibs;
      breakdown.push({ label: 'CBS (Federal)', value: cbs, description: '8.8% Transição' });
      breakdown.push({ label: 'IBS (Mun./Est.)', value: ibs, description: '17.7% Transição' });
    }
    return { totalTax, netIncome: rev - totalTax, breakdown };
  }, [revenue, activeTab, employeeCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-gray-900">Configurações Fiscais</h3>
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab(CalculatorTab.MEI)} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black rounded-lg transition-all ${activeTab === CalculatorTab.MEI ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>MEI</button>
          <button onClick={() => setActiveTab(CalculatorTab.ME)} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black rounded-lg transition-all ${activeTab === CalculatorTab.ME ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>ME (SIMPLES)</button>
          <button onClick={() => setActiveTab(CalculatorTab.AUTONOMOUS)} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black rounded-lg transition-all ${activeTab === CalculatorTab.AUTONOMOUS ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>AUTÔNOMO</button>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Faturamento Mensal</label>
          <input type="text" value={revenue} onChange={(e) => handleCurrencyInput(e.target.value, setRevenue)} className="w-full px-6 py-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600 outline-none text-xl md:text-2xl font-black" placeholder="R$ 0,00" />
        </div>
        {activeTab === CalculatorTab.MEI && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setEmployeeCount(0)} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${employeeCount === 0 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}>Sem Funcionário</button>
            <button onClick={() => setEmployeeCount(1)} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${employeeCount === 1 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}>Com Funcionário</button>
          </div>
        )}
      </div>
      <div className="bg-gray-900 rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col justify-center min-h-[350px] lg:min-h-[400px] overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Lucro Líquido Mensal</p>
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 break-words leading-tight">
              {results.netIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h4>
            <div className="space-y-4 pt-6 border-t border-white/10">
              {results.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-4 text-xs sm:text-sm">
                  <span className="text-gray-400 font-bold truncate">{item.label}</span>
                  <span className="font-black text-red-400 whitespace-nowrap">-{item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-10">
            <i className="fas fa-university text-6xl"></i>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest">Aguardando Faturamento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;
