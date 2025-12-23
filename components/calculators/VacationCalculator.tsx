
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

  const results = useMemo(() => {
    const s = parseToNumber(salary);
    if (s <= 0) return null;
    const third = s / 3;
    const total = s + third;
    const inss = total * 0.11; // Estimativa simplificada
    return { liquido: total - inss, breakdown: [{ l: 'Salário Base', v: s }, { l: '1/3 Constitucional', v: third }, { l: 'Deduções Estimadas', v: -inss }] };
  }, [salary]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-8">
        <h3 className="text-xl md:text-2xl font-black text-gray-900">Salário das Férias</h3>
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Salário Bruto Mensal</label>
          <input type="text" value={salary} onChange={(e) => handleCurrencyInput(e.target.value, setSalary)} className="w-full p-4 md:p-6 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-lg md:text-2xl font-black" placeholder="R$ 0,00" />
        </div>
      </div>
      <div className="bg-green-900 rounded-[2rem] md:rounded-[2.5rem] px-4 py-8 md:p-10 text-white flex flex-col justify-center shadow-2xl shadow-green-100 min-h-[300px] lg:min-h-[400px] overflow-hidden">
        {results ? (
          <div className="space-y-8 animate-fadeIn w-full">
            <div className="text-center">
              <p className="text-[9px] font-black text-green-300 uppercase mb-2 tracking-widest">Valor Líquido Estimado</p>
              <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black break-words leading-tight">
                {results.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h4>
            </div>
            <div className="space-y-4 pt-8 border-t border-white/10">
              {results.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-2 text-[10px] sm:text-xs font-bold">
                  <span className="text-green-200 truncate">{item.l}</span>
                  <span className={`${item.v < 0 ? 'text-red-400' : 'text-white'} whitespace-nowrap`}>{item.v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-center opacity-20 py-10"><i className="fas fa-umbrella-beach text-5xl"></i><p className="mt-4 text-[10px] font-bold uppercase tracking-widest">Simule agora</p></div>}
      </div>
    </div>
  );
};

export default VacationCalculator;
