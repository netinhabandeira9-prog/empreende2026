
import React, { useState, useMemo } from 'react';

const VacationCalculator: React.FC = () => {
  const [salary, setSalary] = useState<string>('');

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
    const s = parseToNumber(salary);
    if (s <= 0) return null;
    const third = s / 3;
    const total = s + third;
    const inss = total * 0.11; 
    return { liquido: total - inss, breakdown: [{ l: 'Salário Base', v: s }, { l: '1/3 Constitucional', v: third }, { l: 'Descontos (INSS/IR)', v: -inss }] };
  }, [salary]);

  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    if (len > 22) return 'text-2xl sm:text-3xl';
    if (len > 18) return 'text-3xl sm:text-4xl';
    return 'text-5xl sm:text-6xl lg:text-7xl';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-umbrella-beach text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Cálculo de Férias</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Simulador de Recibo</p>
          </div>
        </div>

        <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Salário Bruto Mensal</label>
          <div className="relative">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
             <input type="text" inputMode="decimal" value={salary} onChange={(e) => handleCurrencyInput(e.target.value, setSalary)} className="w-full pl-14 pr-8 py-6 rounded-3xl bg-white border-2 border-transparent focus:border-green-600 outline-none text-2xl font-black shadow-sm transition-all" placeholder="0,00" />
          </div>
        </div>
      </div>

      <div className="bg-green-900 rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl relative border-8 border-green-800/30 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-green-300 uppercase tracking-[0.4em] opacity-80 mb-3 text-center">Líquido a Receber</p>
              <div className="flex justify-center items-center min-h-[80px]">
                <h4 className={`font-black text-white whitespace-nowrap leading-none tabular-nums tracking-tighter transition-all duration-300 ${getDynamicFontSize(formatBRL(results.liquido))}`}>
                    {formatBRL(results.liquido)}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {results.breakdown.map((item, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-black text-green-200 uppercase mb-2 tracking-widest">{item.l}</span>
                  <span className={`font-black text-sm ${item.v < 0 ? 'text-red-400' : 'text-white'}`}>{formatBRL(item.v)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-umbrella-beach text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando Valor do Salário</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationCalculator;
