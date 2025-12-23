
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

  const results = useMemo(() => {
    const f = parseToNumber(fixedCosts);
    const v = parseToNumber(variableUnitCost);
    const p = parseToNumber(unitPrice);
    if (f <= 0 || p <= v) return null;
    const units = Math.ceil(f / (p - v));
    return { units, revenue: units * p };
  }, [fixedCosts, variableUnitCost, unitPrice]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-gray-900">Saúde Financeira</h3>
        <div><label className="text-[10px] font-black text-gray-400 uppercase">Custos Fixos Totais (Mensal)</label><input type="text" value={fixedCosts} onChange={(e) => handleCurrencyInput(e.target.value, setFixedCosts)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-xl font-black mt-1" placeholder="R$ 0,00" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-[10px] font-black text-gray-400 uppercase">Custo Unitário</label><input type="text" value={variableUnitCost} onChange={(e) => handleCurrencyInput(e.target.value, setVariableUnitCost)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-bold mt-1" placeholder="R$ 0,00" /></div>
          <div><label className="text-[10px] font-black text-gray-400 uppercase">Preço Unitário</label><input type="text" value={unitPrice} onChange={(e) => handleCurrencyInput(e.target.value, setUnitPrice)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-bold mt-1" placeholder="R$ 0,00" /></div>
        </div>
      </div>
      <div className="bg-orange-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center text-center shadow-2xl shadow-orange-100 min-h-[400px]">
        {results ? (
          <div className="space-y-8">
            <div className="bg-white/10 p-8 rounded-[2rem]">
              <p className="text-[10px] font-black text-orange-300 uppercase mb-4 tracking-widest">Sua Meta Mensal</p>
              <h4 className="text-7xl font-black">{results.units}</h4>
              <p className="text-sm font-bold uppercase mt-2">Unidades p/ Mês</p>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs uppercase text-orange-200 mb-1 tracking-widest">Faturamento para Empatar</p>
              <p className="text-3xl font-black">{results.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
        ) : <div className="opacity-20"><i className="fas fa-balance-scale text-6xl"></i><p className="mt-4 text-xs font-bold uppercase">Calcular Meta</p></div>}
      </div>
    </div>
  );
};

export default BreakEvenCalculator;
