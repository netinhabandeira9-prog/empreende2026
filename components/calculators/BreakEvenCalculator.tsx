
import React, { useState, useMemo } from 'react';

const BreakEvenCalculator: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState<string>('');
  const [variableUnitCost, setVariableUnitCost] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');

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

  const results = useMemo(() => {
    const f = parseToNumber(fixedCosts);
    const v = parseToNumber(variableUnitCost);
    const p = parseToNumber(unitPrice);
    if (f <= 0 || p <= v) return null;
    const units = Math.ceil(f / (p - v));
    return { units, revenue: units * p };
  }, [fixedCosts, variableUnitCost, unitPrice]);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-balance-scale text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Ponto de Equilíbrio</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Gestão Financeira</p>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Custos Fixos Totais (Mês)</label>
            <div className="relative">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
               <input type="text" value={fixedCosts} onChange={(e) => handleCurrencyInput(e.target.value, setFixedCosts)} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-orange-600 outline-none text-xl font-black shadow-sm transition-all" placeholder="0,00" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Custo Unitário</label><input type="text" value={variableUnitCost} onChange={(e) => handleCurrencyInput(e.target.value, setVariableUnitCost)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-orange-600 outline-none text-base font-black shadow-sm" placeholder="R$ 0,00" /></div>
            <div><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Preço Venda Unitário</label><input type="text" value={unitPrice} onChange={(e) => handleCurrencyInput(e.target.value, setUnitPrice)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-orange-600 outline-none text-base font-black shadow-sm" placeholder="R$ 0,00" /></div>
          </div>
        </div>
      </div>

      <div className="bg-orange-900 rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl relative border-8 border-orange-800/30 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-orange-300 uppercase tracking-[0.4em] opacity-80 mb-3">Vendas p/ Equilíbrio</p>
              <div className="flex justify-center items-center min-h-[80px]">
                <h4 className="text-5xl sm:text-6xl lg:text-7xl font-black tabular-nums tracking-tighter transition-all duration-300 leading-tight">
                  {results.units}
                </h4>
              </div>
              <p className="text-xs font-black uppercase text-orange-200 mt-2">Unidades / Mês</p>
            </div>

            <div className="w-full pt-8 border-t border-white/10 text-center">
              <div className="inline-flex flex-col items-center space-y-2 bg-white/10 px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">Faturamento Mínimo:</span>
                <span className="text-white font-black text-2xl">{formatBRL(results.revenue)}</span>
              </div>
              <p className="text-[10px] text-orange-300/40 italic mt-8 max-w-sm mx-auto leading-relaxed">
                Este é o valor mínimo de vendas para cobrir todos os seus custos mensais.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-balance-scale text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando custos e preços</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakEvenCalculator;
