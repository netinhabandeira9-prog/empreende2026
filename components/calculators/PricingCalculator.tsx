
import React, { useState, useMemo } from 'react';

const PricingCalculator: React.FC = () => {
  const [cost, setCost] = useState<string>('');
  const [margin, setMargin] = useState<string>('');

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
    const c = parseToNumber(cost);
    const m = parseFloat(margin);
    if (c <= 0 || !m || m >= 100) return null;
    const price = c / (1 - (m / 100));
    return { price, profit: price - c, markup: price / c };
  }, [cost, margin]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-8">
        <h3 className="text-xl md:text-2xl font-black text-gray-900">Custos e Margens</h3>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Custo de Produção/Compra</label>
          <input type="text" value={cost} onChange={(e) => handleCurrencyInput(e.target.value, setCost)} className="w-full p-4 md:p-5 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg md:text-2xl font-black" placeholder="R$ 0,00" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Margem Desejada (%)</label>
          <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full p-4 md:p-5 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg md:text-2xl font-black" placeholder="30" />
        </div>
      </div>
      <div className="bg-purple-900 rounded-[2rem] md:rounded-[2.5rem] px-4 py-8 md:p-10 text-white flex flex-col justify-center text-center shadow-2xl shadow-purple-100 min-h-[300px] lg:min-h-[400px] overflow-hidden">
        {results ? (
          <div className="space-y-10 animate-fadeIn w-full">
            <div>
              <p className="text-[9px] font-black text-purple-300 uppercase mb-4 tracking-widest">Preço Sugerido de Venda</p>
              <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black break-words leading-tight">
                {results.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] uppercase font-bold text-purple-200 mb-1">Lucro Limpo</p>
                <p className="font-black text-lg text-green-400 truncate">{results.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[8px] uppercase font-bold text-purple-200 mb-1">Markup</p>
                <p className="font-black text-lg">{results.markup.toFixed(2)}x</p>
              </div>
            </div>
          </div>
        ) : <div className="opacity-20 py-10"><i className="fas fa-tag text-5xl"></i><p className="mt-4 text-[10px] font-bold uppercase tracking-widest">Aguardando dados</p></div>}
      </div>
    </div>
  );
};

export default PricingCalculator;
