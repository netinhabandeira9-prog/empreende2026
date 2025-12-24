
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

  // Alíquota de teste 2026: 1%
  const TAX_2026_RATE = 0.01; 

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

  // Formatação BRL padrão rigorosa
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  // Lógica de escala de fonte ultra-segura para evitar transbordo (overflow)
  const getDynamicFontSize = (text: string, type: 'hero' | 'grid' | 'mini') => {
    const len = text.length;
    
    if (type === 'hero') {
      if (len > 16) return 'text-2xl sm:text-3xl';
      if (len > 12) return 'text-3xl sm:text-4xl';
      if (len > 9)  return 'text-4xl sm:text-5xl';
      return 'text-4xl sm:text-5xl lg:text-6xl'; // Reduzido o máximo de 7xl para 6xl por segurança
    }

    if (type === 'grid') {
      if (len > 12) return 'text-sm sm:text-base';
      if (len > 10) return 'text-base sm:text-lg';
      return 'text-lg sm:text-xl';
    }

    if (type === 'mini') {
      if (len > 12) return 'text-[10px]';
      return 'text-xs';
    }

    return 'text-base';
  };

  const results = useMemo<CalculationResult | null>(() => {
    const cost = parseToNumber(totalCost);
    const mPercent = parseFloat(margin) / 100;
    const q = calcMode === 'UNIT' ? 1 : (quantity || 1);

    if (cost <= 0 || isNaN(mPercent) || mPercent >= 0.99 || mPercent < 0) return null;

    const effectiveTax = includeTax ? TAX_2026_RATE : 0;
    const denominator = 1 - mPercent - effectiveTax;
    
    if (denominator <= 0) {
      return { 
        error: "Margem inviável com impostos.",
        totalSalePrice: 0, unitSalePrice: 0, unitCost: 0, taxAmount: 0, totalProfit: 0, unitProfit: 0, marginApplied: 0, markup: 0
      };
    }

    const totalSalePrice = cost / denominator;
    const unitSalePrice = totalSalePrice / q;
    const taxAmount = totalSalePrice * effectiveTax;
    const totalProfit = totalSalePrice - cost - taxAmount;
    const unitProfit = totalProfit / q;
    const markup = totalSalePrice / cost;

    return {
      totalSalePrice,
      unitSalePrice,
      unitCost: cost / q,
      taxAmount,
      totalProfit,
      unitProfit,
      marginApplied: mPercent * 100,
      markup
    };
  }, [totalCost, margin, quantity, calcMode, includeTax]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
      {/* Coluna de Inputs */}
      <div className="space-y-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md">
            <i className="fas fa-calculator text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-tight">Precificação</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Reforma Tributária 2026</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button onClick={() => setCalcMode('UNIT')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>Unidade</button>
          <button onClick={() => setCalcMode('BATCH')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>Fardo</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Custo de Compra</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300 text-sm">R$</span>
              <input type="text" value={totalCost} onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-lg font-black transition-all" placeholder="0,00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Qtd.</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-lg font-black transition-all" />
              </div>
            )}
            <div className={calcMode === 'UNIT' ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Margem (%)</label>
              <div className="relative">
                <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-lg font-black transition-all" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
              </div>
            </div>
          </div>

          <button onClick={() => setIncludeTax(!includeTax)} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400'}`}>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase">Provisionar Impostos (1%)</p>
              <p className="text-[8px] font-bold opacity-60 italic">Alíquota teste transição 2026</p>
            </div>
            <i className={`fas ${includeTax ? 'fa-check-circle text-lg' : 'fa-circle text-lg opacity-20'}`}></i>
          </button>
          
          <p className="text-[8px] text-gray-400 text-center italic mt-2">Valores aproximados. Consulte um contador.</p>
        </div>
      </div>

      {/* Painel de Resultados */}
      <div className="bg-purple-900 rounded-[2.5rem] p-6 sm:p-8 text-white flex flex-col justify-center shadow-xl min-h-[500px] overflow-hidden">
        {results && !results.error ? (
          <div className="animate-fadeIn w-full space-y-6">
            <div className="text-center space-y-1">
              <p className="text-[9px] font-black text-purple-300 uppercase tracking-widest opacity-80">Preço Sugerido</p>
              <div className="flex items-center justify-center py-2 px-1">
                <h4 className={`font-black text-white leading-tight break-all transition-all duration-300 ${getDynamicFontSize(formatBRL(results.totalSalePrice), 'hero')}`}>
                  {formatBRL(results.totalSalePrice)}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10 flex flex-col justify-center min-h-[90px] overflow-hidden">
                <p className="text-[8px] font-black text-green-400 uppercase mb-1 tracking-widest">Lucro</p>
                <p className={`font-black text-white break-words ${getDynamicFontSize(formatBRL(results.totalProfit), 'grid')}`}>
                  {formatBRL(results.totalProfit)}
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10 flex flex-col justify-center min-h-[90px] overflow-hidden">
                <p className="text-[8px] font-black text-blue-400 uppercase mb-1 tracking-widest">Imposto</p>
                <p className={`font-black text-white break-words ${getDynamicFontSize(formatBRL(results.taxAmount), 'grid')}`}>
                  {formatBRL(results.taxAmount)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col items-center">
              <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block">Markup: {results.markup.toFixed(2)}x</span>
              </div>
              <p className="text-[8px] text-center text-purple-200/50 italic mt-4 leading-snug px-4">Preço ideal para garantir sua margem livre após custos e taxas.</p>
            </div>
          </div>
        ) : results?.error ? (
          <div className="text-center p-6 bg-red-500/10 rounded-2xl border border-red-500/30">
            <i className="fas fa-exclamation-circle text-xl text-red-500 mb-2"></i>
            <p className="text-xs font-black text-red-100">{results.error}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-6 space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10 animate-pulse">
              <i className="fas fa-calculator text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando dados...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
