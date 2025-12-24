
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

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val).replace(/\s/g, '\u00A0');
  };

  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    if (len > 22) return 'text-2xl sm:text-3xl';
    if (len > 18) return 'text-3xl sm:text-4xl';
    if (len > 14) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl lg:text-7xl';
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
        breakdown.push({ label: 'Custo Previdenciário', value: emp, description: 'Encargos sobre Mínimo' });
      }
    } else if (activeTab === CalculatorTab.ME) {
      const simples = rev * 0.06;
      totalTax = simples;
      breakdown.push({ label: 'Simples Nacional', value: simples, description: 'Anexo III Base' });
    } else {
      const cbs = rev * TAX_RATES_2026.CBS_RATE;
      const ibs = rev * TAX_RATES_2026.IBS_RATE;
      totalTax = cbs + ibs;
      breakdown.push({ label: 'CBS (Federal)', value: cbs, description: '0.9% Transição' });
      breakdown.push({ label: 'IBS (Mun./Est.)', value: ibs, description: '0.1% Transição' });
    }
    return { totalTax, netIncome: rev - totalTax, breakdown };
  }, [revenue, activeTab, employeeCount]);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-university text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Simulador Fiscal</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Regras Projetadas 2026</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
          <button onClick={() => setActiveTab(CalculatorTab.MEI)} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === CalculatorTab.MEI ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}>MEI</button>
          <button onClick={() => setActiveTab(CalculatorTab.ME)} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === CalculatorTab.ME ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}>Simples</button>
          <button onClick={() => setActiveTab(CalculatorTab.AUTONOMOUS)} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === CalculatorTab.AUTONOMOUS ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}>Autônomo</button>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Faturamento Mensal</label>
            <div className="relative">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
               <input type="text" inputMode="decimal" value={revenue} onChange={(e) => handleCurrencyInput(e.target.value, setRevenue)} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-blue-600 shadow-sm outline-none text-xl font-black transition-all" placeholder="0,00" />
            </div>
          </div>
          {activeTab === CalculatorTab.MEI && (
            <div className="flex gap-3">
              <button onClick={() => setEmployeeCount(0)} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase border-2 transition-all ${employeeCount === 0 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-400'}`}>Individual</button>
              <button onClick={() => setEmployeeCount(1)} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase border-2 transition-all ${employeeCount === 1 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-400'}`}>Com Auxiliar</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl relative border-8 border-gray-800/30 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] opacity-80 mb-3">Renda Líquida Mensal</p>
              <div className="flex justify-center items-center min-h-[80px]">
                 <h4 className={`font-black text-white whitespace-nowrap leading-none tabular-nums tracking-tighter transition-all duration-300 ${getDynamicFontSize(formatBRL(results.netIncome))}`}>
                  {formatBRL(results.netIncome)}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {results.breakdown.map((item, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</span>
                  <span className="text-red-400 font-black text-lg">-{formatBRL(item.value)}</span>
                  <span className="text-[8px] text-gray-500 uppercase mt-1">{item.description}</span>
                </div>
              ))}
            </div>

            <div className="w-full pt-8 border-t border-white/10 text-center">
              <div className="inline-flex items-center space-x-4 bg-white/10 px-8 py-3 rounded-full border border-white/10 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Total Impostos:</span>
                <span className="text-white font-black text-lg">{formatBRL(results.totalTax)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-university text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando Faturamento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;
