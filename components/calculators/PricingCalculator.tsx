
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

  // Função de ajuste fino de fonte para evitar quebra em qualquer cenário
  const getDynamicFontSize = (text: string, base: 'large' | 'medium' | 'small') => {
    const len = text.length;
    
    if (base === 'large') {
      if (len > 18) return 'text-xl sm:text-2xl';
      if (len > 15) return 'text-2xl sm:text-3xl';
      if (len > 12) return 'text-3xl sm:text-4xl';
      return 'text-4xl sm:text-5xl lg:text-6xl';
    }
    
    if (base === 'medium') {
      if (len > 15) return 'text-sm sm:text-base';
      if (len > 12) return 'text-base sm:text-lg';
      if (len > 10) return 'text-lg sm:text-xl';
      return 'text-xl sm:text-2xl md:text-3xl';
    }

    if (base === 'small') {
      if (len > 15) return 'text-[10px] sm:text-xs';
      if (len > 12) return 'text-xs sm:text-sm';
      return 'text-sm sm:text-lg';
    }
    
    return 'text-base';
  };

  const results = useMemo<CalculationResult | null>(() => {
    const cost = parseToNumber(totalCost);
    const mPercent = parseFloat(margin) / 100;
    const q = calcMode === 'UNIT' ? 1 : (quantity || 1);

    if (cost <= 0 || isNaN(mPercent) || mPercent >= 1) return null;

    const effectiveTax = includeTax ? TAX_2026_RATE : 0;
    const denominator = 1 - mPercent - effectiveTax;
    
    if (denominator <= 0) {
      return { 
        error: "Margem inviável: reduza a margem para permitir o cálculo com impostos.",
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

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-100">
            <i className="fas fa-calculator text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Calculadora de Preços</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Consultor de Lucratividade</p>
          </div>
        </div>
        
        <div className="flex p-1.5 bg-gray-100 rounded-[1.5rem]">
          <button 
            onClick={() => setCalcMode('UNIT')}
            className={`flex-1 flex items-center justify-center py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fas fa-tag mr-2"></i> Unidade
          </button>
          <button 
            onClick={() => setCalcMode('BATCH')}
            className={`flex-1 flex items-center justify-center py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className="fas fa-box-open mr-2"></i> Fardo/Caixa
          </button>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">
              {calcMode === 'UNIT' ? 'Quanto você pagou por cada peça?' : 'Quanto custou o fardo inteiro?'}
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
              <input 
                type="text" 
                value={totalCost} 
                onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
                className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-2xl font-black transition-all shadow-inner" 
                placeholder="0,00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Quantas peças vem?</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-2xl font-black transition-all shadow-inner" 
                />
              </div>
            )}
            <div className={calcMode === 'UNIT' ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-2">Sua Margem Desejada (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={margin} 
                  onChange={(e) => setMargin(e.target.value)} 
                  className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-2xl font-black transition-all shadow-inner" 
                  placeholder="30" 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIncludeTax(!includeTax)}
            className={`w-full p-5 rounded-[1.5rem] border-2 flex items-center justify-between transition-all group ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400'}`}
          >
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-tight">Provisionar Impostos (CBS/IBS 2026)</p>
              <p className="text-[9px] font-bold opacity-60">Calcula o preço já descontando 26,5% do governo</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${includeTax ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-transparent'}`}>
              <i className="fas fa-check text-xs"></i>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-purple-900 rounded-[3rem] p-6 md:p-10 text-white flex flex-col justify-center shadow-2xl shadow-purple-200 min-h-[550px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        {results && !results.error ? (
          <div className="animate-fadeIn w-full space-y-6 relative z-10">
            <div className="text-center">
              <p className="text-[11px] font-black text-purple-300 uppercase mb-4 tracking-[0.3em] opacity-80">
                Preço de Venda Sugerido
              </p>
              <div className="bg-white/10 px-4 py-8 rounded-[2.5rem] border border-white/10 w-full flex items-center justify-center overflow-hidden min-h-[140px]">
                <h4 className={`font-black text-white leading-none whitespace-nowrap transition-all duration-300 ${getDynamicFontSize(formatBRL(results.totalSalePrice), 'large')}`}>
                  {formatBRL(results.totalSalePrice)}
                </h4>
              </div>
            </div>

            {calcMode === 'BATCH' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-[2rem] p-6 text-center border border-white/5 flex flex-col justify-center min-h-[120px] overflow-hidden">
                  <p className="text-[10px] font-black text-green-400 uppercase mb-2 tracking-widest">Venda / Unit.</p>
                  <p className={`font-black text-white whitespace-nowrap transition-all duration-300 ${getDynamicFontSize(formatBRL(results.unitSalePrice), 'medium')}`}>
                    {formatBRL(results.unitSalePrice)}
                  </p>
                </div>
                <div className="bg-white/10 rounded-[2rem] p-6 text-center border border-white/5 flex flex-col justify-center min-h-[120px] overflow-hidden">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">Lucro / Unit.</p>
                  <p className={`font-black text-white whitespace-nowrap transition-all duration-300 ${getDynamicFontSize(formatBRL(results.unitProfit), 'medium')}`}>
                    {formatBRL(results.unitProfit)}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 flex flex-col justify-center min-h-[100px] overflow-hidden">
                <p className="text-[9px] uppercase font-black text-purple-300 mb-2 opacity-60">Lucro Total</p>
                <p className={`font-black text-green-400 whitespace-nowrap ${getDynamicFontSize(formatBRL(results.totalProfit), 'small')}`}>
                  {formatBRL(results.totalProfit)}
                </p>
              </div>
              <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 flex flex-col justify-center min-h-[100px] overflow-hidden">
                <p className="text-[9px] uppercase font-black text-purple-300 mb-2 opacity-60">Imposto Governal</p>
                <p className={`font-black text-red-400 whitespace-nowrap ${getDynamicFontSize(formatBRL(results.taxAmount), 'small')}`}>
                  {formatBRL(results.taxAmount)}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col items-center">
              <div className="inline-flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Markup Ideal:</span>
                <span className="text-white font-black text-sm">{results.markup.toFixed(2)}x</span>
              </div>
              <p className="text-[10px] text-center text-purple-200/50 italic mt-6 leading-relaxed max-w-xs mx-auto">
                Valores calculados com base na Reforma Tributária 2026 para garantir sua margem de lucro livre.
              </p>
            </div>
          </div>
        ) : results?.error ? (
          <div className="text-center p-10 bg-red-500/10 rounded-[3rem] border border-red-500/30">
            <div className="bg-red-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
              <i className="fas fa-exclamation-triangle text-xl"></i>
            </div>
            <p className="text-sm font-black leading-relaxed text-red-100">{results.error}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-10 space-y-6">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
              <i className="fas fa-hand-holding-usd text-4xl"></i>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] leading-relaxed">
              Descubra seu Preço Ideal<br/>
              <span className="text-[10px] font-bold opacity-60 italic tracking-normal">Preencha os campos ao lado</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
