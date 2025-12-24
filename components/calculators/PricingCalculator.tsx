
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
  const [quantity, setQuantity] = useState<string>('1'); // Alterado para string para permitir campo vazio ao digitar
  const [margin, setMargin] = useState<string>('30');
  const [includeTax, setIncludeTax] = useState<boolean>(true);

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

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val).replace(/\s/g, '\u00A0'); // Previne quebra de linha entre R$ e o número
  };

  // Lógica de escala de fonte melhorada para evitar cortes horizontais
  const getDynamicFontSize = (text: string, type: 'hero' | 'grid') => {
    const len = text.length;
    if (type === 'hero') {
      if (len > 18) return 'text-xl sm:text-2xl';
      if (len > 14) return 'text-2xl sm:text-3xl';
      if (len > 10) return 'text-3xl sm:text-4xl';
      return 'text-4xl sm:text-5xl lg:text-6xl';
    }
    if (type === 'grid') {
      if (len > 14) return 'text-[10px] sm:text-xs';
      if (len > 10) return 'text-xs sm:text-sm';
      return 'text-sm sm:text-base md:text-lg';
    }
    return 'text-base';
  };

  const results = useMemo<CalculationResult | null>(() => {
    const cost = parseToNumber(totalCost);
    const mPercent = parseFloat(margin) / 100;
    const q = calcMode === 'UNIT' ? 1 : (parseInt(quantity) || 1);

    if (cost <= 0 || isNaN(mPercent) || mPercent >= 0.99 || mPercent < 0) return null;

    const effectiveTax = includeTax ? TAX_2026_RATE : 0;
    const denominator = 1 - mPercent - effectiveTax;
    
    if (denominator <= 0) {
      return { 
        error: "Margem inviável.",
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start max-w-full">
      {/* Coluna de Configuração */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-calculator text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Precificação</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Reforma Tributária 2026</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
          <button onClick={() => setCalcMode('UNIT')} className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${calcMode === 'UNIT' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-400'}`}>Individual</button>
          <button onClick={() => setCalcMode('BATCH')} className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${calcMode === 'BATCH' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-400'}`}>Fardo/Lote</button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Custo de Compra (Líquido)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
              <input 
                type="text" 
                value={totalCost} 
                onChange={(e) => handleCurrencyInput(e.target.value, setTotalCost)} 
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-xl font-black transition-all" 
                placeholder="0,00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {calcMode === 'BATCH' && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Quantidade</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} // Permite apagar livremente
                  className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-xl font-black transition-all" 
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
                  className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-purple-600 focus:bg-white outline-none text-xl font-black transition-all" 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
              </div>
            </div>
          </div>

          <button onClick={() => setIncludeTax(!includeTax)} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${includeTax ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' : 'border-gray-100 text-gray-400'}`}>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase">Considerar Reforma 2026 (1%)</p>
              <p className="text-[9px] font-bold opacity-60 italic">Fase de teste (CBS + IBS)</p>
            </div>
            <i className={`fas ${includeTax ? 'fa-check-circle text-xl' : 'fa-circle text-xl opacity-20'}`}></i>
          </button>
        </div>
      </div>

      {/* Card de Resultados - Visual Premium e Fluído */}
      <div className="bg-purple-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col justify-center shadow-2xl min-h-[500px] overflow-hidden relative border-8 border-purple-800/20">
        {results && !results.error ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em] opacity-80 mb-4">Preço Sugerido Final</p>
              <div className="flex items-center justify-center w-full min-h-[60px]">
                <h4 className={`font-black text-white leading-none whitespace-nowrap tabular-nums tracking-tighter transition-all duration-300 ${getDynamicFontSize(formatBRL(results.totalSalePrice), 'hero')}`}>
                  {formatBRL(results.totalSalePrice)}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/5 rounded-[2rem] p-6 text-center border border-white/10 flex flex-col justify-center min-h-[110px]">
                <p className="text-[9px] font-black text-green-400 uppercase mb-3 tracking-widest">Lucro {calcMode === 'BATCH' ? 'Total' : 'Líquido'}</p>
                <p className={`font-black text-white tabular-nums transition-all ${getDynamicFontSize(formatBRL(results.totalProfit), 'grid')}`}>
                  {formatBRL(results.totalProfit)}
                </p>
              </div>
              <div className="bg-white/5 rounded-[2rem] p-6 text-center border border-white/10 flex flex-col justify-center min-h-[110px]">
                <p className="text-[9px] font-black text-blue-400 uppercase mb-3 tracking-widest">Imposto (1%)</p>
                <p className={`font-black text-white tabular-nums transition-all ${getDynamicFontSize(formatBRL(results.taxAmount), 'grid')}`}>
                  {formatBRL(results.taxAmount)}
                </p>
              </div>
            </div>

            <div className="w-full pt-8 border-t border-white/10 text-center">
              <div className="inline-flex items-center space-x-3 bg-white/10 px-6 py-2.5 rounded-full border border-white/10 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Markup Recomendado:</span>
                <span className="text-white font-black text-sm">{results.markup.toFixed(2)}x</span>
              </div>
              <p className="text-[10px] text-purple-300/40 italic mt-6 max-w-[200px] mx-auto leading-relaxed">Simulação baseada nas regras vigentes de 2026.</p>
            </div>
          </div>
        ) : results?.error ? (
          <div className="text-center p-10 bg-red-500/10 rounded-[2.5rem] border-2 border-red-500/30">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <p className="text-sm font-black text-red-100 uppercase tracking-widest">{results.error}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 py-10 space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-tags text-3xl"></i>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">Pronto para Calcular<br/><span className="text-[9px] font-bold opacity-60 tracking-normal italic">Insira os valores ao lado</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
