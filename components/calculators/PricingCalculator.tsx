
import React, { useState, useMemo } from 'react';

const PricingCalculator: React.FC = () => {
  const [totalCost, setTotalCost] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
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
    const cost = parseToNumber(totalCost);
    const m = parseFloat(margin);
    const q = quantity || 1;

    if (cost <= 0 || isNaN(m) || m >= 100) return null;

    const totalSalePrice = cost / (1 - (m / 100));
    const unitSalePrice = totalSalePrice / q;
    const unitCost = cost / q;
    const totalProfit = totalSalePrice - cost;

    return {
      totalSalePrice,
      unitSalePrice,
      unitCost,
      totalProfit,
      markup: totalSalePrice / cost
    };
  }, [totalCost, margin, quantity]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-gray-900">Configurar Precificação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Custo Total (Fardo/Caixa)</label>
            <input 
              type="text" 
              value={totalCost} 
              onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
              className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg md:text-xl font-black" 
              placeholder="R$ 0,00" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Unidades no Fardo</label>
              <input 
                type="number" 
                min="1"
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black" 
                placeholder="1" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Margem Lucro (%)</label>
              <input 
                type="number" 
                value={margin} 
                onChange={(e) => setMargin(e.target.value)} 
                className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black" 
                placeholder="30" 
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
          <p className="text-[10px] text-blue-800 leading-relaxed italic">
            <strong>Dica de 2026:</strong> Lembre-se que com o CBS e IBS, você deve calcular seu custo já considerando os créditos tributários de entrada.
          </p>
        </div>
      </div>

      <div className="bg-purple-950 rounded-[2rem] md:rounded-[2.5rem] px-6 py-8 md:p-10 text-white flex flex-col justify-center shadow-2xl shadow-purple-200 overflow-hidden">
        {results ? (
          <div className="space-y-8 animate-fadeIn w-full">
            <div className="text-center pb-6 border-b border-white/10">
              <p className="text-[9px] font-black text-purple-300 uppercase mb-2 tracking-widest">Preço Sugerido (Fardo/Total)</p>
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black break-words leading-tight text-purple-100">
                {results.totalSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h4>
            </div>

            <div className="text-center py-2">
              <p className="text-[9px] font-black text-green-400 uppercase mb-1 tracking-widest">Valor de Venda por Unidade</p>
              <h5 className="text-3xl sm:text-4xl md:text-5xl font-black text-white break-words">
                {results.unitSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Lucro Total</p>
                <p className="font-black text-sm sm:text-lg text-green-400 truncate">
                  {results.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Custo Unitário</p>
                <p className="font-black text-sm sm:text-lg truncate">
                  {results.unitCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-10">
            <i className="fas fa-tag text-5xl mb-4"></i>
            <p className="text-[10px] font-bold uppercase tracking-widest">Preencha os valores para precificar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
