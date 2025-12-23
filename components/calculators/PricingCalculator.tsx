
import React, { useState, useMemo } from 'react';

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

  const results = useMemo(() => {
    const cost = parseToNumber(totalCost);
    const mPercent = parseFloat(margin) / 100;
    const q = calcMode === 'UNIT' ? 1 : (quantity || 1);

    if (cost <= 0 || isNaN(mPercent) || mPercent >= 1) return null;

    // Lógica 2026: Preço de Venda considerando Impostos e Margem sobre o valor final
    // Preço = Custo / (1 - Margem - Imposto)
    const effectiveTax = includeTax ? TAX_2026 : 0;
    const denominator = 1 - mPercent - effectiveTax;
    
    // Se o denominador for <= 0, a margem + impostos é impossível
    if (denominator <= 0) return { error: "Margem/Imposto muito alto" };

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
        <h3 className="text-xl md:text-2xl font-black text-gray-900">Calculadora de Venda 2026</h3>
        
        {/* Seletor de Tipo de Produto */}
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button 
            onClick={() => setCalcMode('UNIT')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
          >
            Unidade Única
          </button>
          <button 
            onClick={() => setCalcMode('BATCH')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
          >
            Fardo / Caixa
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
              {calcMode === 'UNIT' ? 'Custo da Unidade' : 'Custo Total do Lote'}
            </label>
            <input 
              type="text" 
              value={totalCost} 
              onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
              className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black" 
              placeholder="R$ 0,00" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Unidades</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black" 
                />
              </div>
            )}
            <div className={calcMode === 'UNIT' ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Margem Desejada (%)</label>
              <input 
                type="number" 
                value={margin} 
                onChange={(e) => setMargin(e.target.value)} 
                className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg font-black" 
                placeholder="30" 
              />
            </div>
          </div>

          <button 
            onClick={() => setIncludeTax(!includeTax)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400'}`}
          >
            <div className="text-left">
              <p className="text-[10px] font-black uppercase">Impostos Reforma 2026 (CBS/IBS)</p>
              <p className="text-[9px] opacity-70">Estimativa de 26,5% inclusa no preço</p>
            </div>
            <i className={`fas ${includeTax ? 'fa-check-circle text-xl' : 'fa-circle text-xl opacity-20'}`}></i>
          </button>
        </div>
      </div>

      <div className="bg-purple-900 rounded-[2.5rem] p-6 md:p-8 text-white flex flex-col justify-center shadow-2xl shadow-purple-200 min-h-[400px]">
        {results && !results.error ? (
          <div className="animate-fadeIn w-full space-y-6">
            <div className="text-center">
              <p className="text-[9px] font-black text-purple-300 uppercase mb-2 tracking-widest">Preço Sugerido de Venda {calcMode === 'BATCH' ? '(Fardo)' : ''}</p>
              <h4 className="text-3xl md:text-4xl font-black text-white leading-none break-all">
                {results.totalSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h4>
            </div>

            {calcMode === 'BATCH' && (
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                <p className="text-[9px] font-black text-green-400 uppercase mb-1">Preço por Unidade</p>
                <p className="text-2xl font-black text-white">
                  {results.unitSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Lucro Líquido</p>
                <p className="font-black text-sm text-green-400">
                  {results.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl">
                <p className="text-[8px] uppercase font-bold text-purple-300 mb-1">Impostos (Gasto)</p>
                <p className="font-black text-sm text-red-400">
                  {results.taxAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] text-purple-200 italic leading-tight">
                Para ganhar {margin}% de lucro, você precisa vender por este valor para cobrir custos e impostos.
              </p>
            </div>
          </div>
        ) : results?.error ? (
          <div className="text-center p-6 bg-red-500/20 rounded-3xl border border-red-500/50">
            <i className="fas fa-exclamation-triangle text-2xl mb-2 text-red-400"></i>
            <p className="text-xs font-bold">A margem e os impostos somados superam 100% do preço. Reduza a margem desejada.</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-10">
            <i className="fas fa-calculator text-5xl mb-4"></i>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Insira o custo e a margem<br/>para calcular o preço ideal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
