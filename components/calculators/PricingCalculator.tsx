
import React, { useState, useMemo } from 'react';

interface CalculationResult {
  totalSalePrice: number;
  unitSalePrice: number;
  unitCost: number;
  taxAmount: number;
  totalProfit: number;
  marginApplied: number;
  error?: string;
}

const PricingCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'UNIT' | 'BATCH'>('UNIT');
  const [totalCost, setTotalCost] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [margin, setMargin] = useState<string>('30');
  const [includeTax, setIncludeTax] = useState<boolean>(true);

  // Alíquotas estimadas para 2026 (CBS + IBS transição)
  const TAX_2026 = 0.265; 

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

  const results = useMemo<CalculationResult | null>(() => {
    const cost = parseToNumber(totalCost);
    const mPercent = parseFloat(margin) / 100;
    const q = calcMode === 'UNIT' ? 1 : (quantity || 1);

    if (cost <= 0 || isNaN(mPercent) || mPercent >= 1) return null;

    const effectiveTax = includeTax ? TAX_2026 : 0;
    const denominator = 1 - mPercent - effectiveTax;
    
    if (denominator <= 0) {
      return { 
        error: "A margem + impostos excedem 100% do preço. Reduza a margem.",
        totalSalePrice: 0, unitSalePrice: 0, unitCost: 0, taxAmount: 0, totalProfit: 0, marginApplied: 0
      };
    }

    const totalSalePrice = cost / denominator;
    const unitSalePrice = totalSalePrice / q;
    const unitCost = cost / q;
    const taxAmount = totalSalePrice * effectiveTax;
    const totalProfit = totalSalePrice - cost - taxAmount;

    return {
      totalSalePrice,
      unitSalePrice,
      unitCost,
      taxAmount,
      totalProfit,
      marginApplied: mPercent * 100
    };
  }, [totalCost, margin, quantity, calcMode, includeTax]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-purple-600 p-2 rounded-lg text-white">
            <i className="fas fa-calculator"></i>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900">Precificação Estratégica</h3>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          <button 
            onClick={() => setCalcMode('UNIT')}
            className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-sm scale-[1.02]' : 'text-gray-400'}`}
          >
            <i className="fas fa-box mr-2"></i> Unidade
          </button>
          <button 
            onClick={() => setCalcMode('BATCH')}
            className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-sm scale-[1.02]' : 'text-gray-400'}`}
          >
            <i className="fas fa-boxes mr-2"></i> Fardo/Caixa
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
              {calcMode === 'UNIT' ? 'Custo de Compra (Unidade)' : 'Custo Total do Fardo/Lote'}
            </label>
            <input 
              type="text" 
              value={totalCost} 
              onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
              className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black focus:ring-2 focus:ring-purple-600" 
              placeholder="R$ 0,00" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Qtd no Fardo</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black focus:ring-2 focus:ring-purple-600" 
                />
              </div>
            )}
            <div className={calcMode === 'UNIT' ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Margem de Lucro (%)</label>
              <input 
                type="number" 
                value={margin} 
                onChange={(e) => setMargin(e.target.value)} 
                className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black focus:ring-2 focus:ring-purple-600" 
                placeholder="30" 
              />
            </div>
          </div>

          <button 
            onClick={() => setIncludeTax(!includeTax)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400'}`}
          >
            <div className="text-left">
              <p className="text-[10px] font-black uppercase">Considerar Impostos 2026 (CBS/IBS)</p>
              <p className="text-[9px] opacity-70">Ajusta o preço para sobrar lucro limpo</p>
            </div>
            <i className={`fas ${includeTax ? 'fa-check-circle text-xl' : 'fa-circle text-xl opacity-20'}`}></i>
          </button>
        </div>
      </div>

      <div className="bg-purple-900 rounded-[2.5rem] p-6 md:p-8 text-white flex flex-col justify-center shadow-2xl shadow-purple-200 min-h-[420px]">
        {results && !results.error ? (
          <div className="animate-fadeIn w-full space-y-8">
            <div className="text-center">
              <p className="text-[9px] font-black text-purple-300 uppercase mb-2 tracking-widest">Preço Sugerido {calcMode === 'BATCH' ? '(Fardo Total)' : '(Venda)'}</p>
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight break-words">
                {results.totalSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h4>
            </div>

            {calcMode === 'BATCH' && (
              <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/5 shadow-inner">
                <p className="text-[9px] font-black text-green-400 uppercase mb-1">Preço Sugerido por Unidade</p>
                <p className="text-3xl font-black text-white">
                  {results.unitSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Lucro Real</p>
                <p className="font-black text-sm sm:text-lg text-green-400 truncate">
                  {results.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Imposto Retido</p>
                <p className="font-black text-sm sm:text-lg text-red-400 truncate">
                  {results.taxAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-center text-purple-200 italic px-4">
              Valor calculado para garantir {margin}% de lucro livre sobre o preço final.
            </p>
          </div>
        ) : results?.error ? (
          <div className="text-center p-8 bg-red-500/10 rounded-[2rem] border border-red-500/30">
            <i className="fas fa-exclamation-triangle text-3xl mb-4 text-red-400"></i>
            <p className="text-sm font-bold leading-relaxed">{results.error}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-10">
            <i className="fas fa-tag text-5xl mb-6"></i>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Informe os custos e a margem<br/>para gerar o preço ideal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
