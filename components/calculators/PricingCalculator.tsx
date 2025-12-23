
import React, { useState, useMemo } from 'react';

interface CalculationResult {
  totalSalePrice: number;
  unitSalePrice: number;
  unitCost: number;
  taxAmount: number;
  totalProfit: number;
  unitProfit: number;
  marginApplied: number;
  markup: number;
  error?: string;
}

const PricingCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'UNIT' | 'BATCH'>('UNIT');
  const [totalCost, setTotalCost] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [margin, setMargin] = useState<string>('30');
  const [includeTax, setIncludeTax] = useState<boolean>(true);

  // Alíquota de referência para a Reforma Tributária 2026 (CBS + IBS estimado)
  const TAX_2026_RATE = 0.265; 

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

    const effectiveTax = includeTax ? TAX_2026_RATE : 0;
    
    /**
     * CÁLCULO DE MARGEM SOBRE O PREÇO DE VENDA (Ideal para varejo)
     * Fórmula: PV = Custo / (1 - %Margem - %Impostos)
     */
    const denominator = 1 - mPercent - effectiveTax;
    
    if (denominator <= 0) {
      return { 
        error: "Margem inviável: a soma da margem e impostos atinge 100% do preço. Reduza a margem desejada.",
        totalSalePrice: 0, unitSalePrice: 0, unitCost: 0, taxAmount: 0, totalProfit: 0, unitProfit: 0, marginApplied: 0, markup: 0
      };
    }

    const totalSalePrice = cost / denominator;
    const unitSalePrice = totalSalePrice / q;
    const unitCost = cost / q;
    const taxAmount = totalSalePrice * effectiveTax;
    const totalProfit = totalSalePrice - cost - taxAmount;
    const unitProfit = totalProfit / q;
    const markup = totalSalePrice / cost;

    return {
      totalSalePrice,
      unitSalePrice,
      unitCost,
      taxAmount,
      totalProfit,
      unitProfit,
      marginApplied: mPercent * 100,
      markup
    };
  }, [totalCost, margin, quantity, calcMode, includeTax]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <i className="fas fa-calculator"></i>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-tight">Calculadora de Preços</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ajudante para Comércio e Empresas</p>
          </div>
        </div>
        
        {/* Seletor de Modo: Unidade ou Fardo */}
        <div className="flex p-1.5 bg-gray-100 rounded-2xl">
          <button 
            onClick={() => setCalcMode('UNIT')}
            className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fas fa-tag mr-2"></i> Unidade
          </button>
          <button 
            onClick={() => setCalcMode('BATCH')}
            className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fas fa-box-open mr-2"></i> Fardo/Caixa
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">
              {calcMode === 'UNIT' ? 'Custo de Compra (Unidade)' : 'Custo Total do Fardo'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">R$</span>
              <input 
                type="text" 
                value={totalCost} 
                onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200 outline-none text-xl font-black focus:ring-2 focus:ring-purple-600 transition-all" 
                placeholder="0,00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Qtd no Fardo</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  className="w-full p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200 outline-none text-xl font-black focus:ring-2 focus:ring-purple-600 transition-all" 
                />
              </div>
            )}
            <div className={calcMode === 'UNIT' ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Margem de Lucro (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={margin} 
                  onChange={(e) => setMargin(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200 outline-none text-xl font-black focus:ring-2 focus:ring-purple-600 transition-all" 
                  placeholder="30" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIncludeTax(!includeTax)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400'}`}
          >
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-left">Impostos Reforma 2026 (CBS/IBS)</p>
              <p className="text-[9px] font-bold opacity-60 text-left">Provisionar ~26,5% para o governo</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${includeTax ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-transparent'}`}>
              <i className="fas fa-check text-[10px]"></i>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-purple-900 rounded-[2.5rem] p-6 md:p-8 text-white flex flex-col justify-center shadow-2xl shadow-purple-200 min-h-[480px] overflow-hidden">
        {results && !results.error ? (
          <div className="animate-fadeIn w-full space-y-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-purple-300 uppercase mb-3 tracking-widest opacity-80">
                Preço de Venda {calcMode === 'BATCH' ? 'do Fardo' : 'Sugerido'}
              </p>
              <div className="inline-block bg-white/5 px-6 py-4 rounded-3xl border border-white/10">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight break-all">
                  {results.totalSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h4>
              </div>
            </div>

            {calcMode === 'BATCH' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                  <p className="text-[9px] font-black text-green-400 uppercase mb-1">Venda / Unidade</p>
                  <p className="text-lg sm:text-xl font-black text-white break-all leading-tight">
                    {results.unitSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/5">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Lucro / Unidade</p>
                  <p className="text-lg sm:text-xl font-black text-white break-all leading-tight">
                    {results.unitProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 group hover:bg-black/30 transition-all">
                <p className="text-[8px] uppercase font-black text-purple-300 mb-1.5 opacity-60">Lucro Total</p>
                <p className="font-black text-sm sm:text-base md:text-lg text-green-400 break-all leading-tight">
                  {results.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 group hover:bg-black/30 transition-all">
                <p className="text-[8px] uppercase font-black text-purple-300 mb-1.5 opacity-60">Imposto 2026</p>
                <p className="font-black text-sm sm:text-base md:text-lg text-red-400 break-all leading-tight">
                  {results.taxAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-[10px] font-bold text-purple-200">
                <span className="uppercase tracking-widest">Markup Sugerido:</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg text-white font-black">{results.markup.toFixed(2)}x</span>
              </div>
              <p className="text-[9px] text-center text-purple-200/60 italic mt-4 leading-relaxed">
                Preço calculado para margem de {margin}% real sobre o faturamento, já descontando a reforma tributária.
              </p>
            </div>
          </div>
        ) : results?.error ? (
          <div className="text-center p-8 bg-red-500/10 rounded-[2.5rem] border border-red-500/30 animate-pulse">
            <div className="bg-red-500 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <i className="fas fa-exclamation-triangle text-lg"></i>
            </div>
            <p className="text-xs font-black leading-relaxed text-red-100">{results.error}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-10 space-y-4">
            <i className="fas fa-cash-register text-5xl mb-2"></i>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed">
              Pronto para Precificar<br/>
              <span className="text-[9px] font-bold opacity-60 italic tracking-normal">Informe custo e margem para ver o lucro</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
