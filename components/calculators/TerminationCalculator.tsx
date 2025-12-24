
import React, { useState, useMemo } from 'react';

const TerminationCalculator: React.FC = () => {
  const [admissionDate, setAdmissionDate] = useState<string>('');
  const [dismissalDate, setDismissalDate] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [terminationType, setTerminationType] = useState<'WITHOUT_CAUSE' | 'WITH_CAUSE' | 'RESIGNATION' | 'AGREEMENT'>('WITHOUT_CAUSE');
  const [noticeType, setNoticeType] = useState<'WORKED' | 'INDEMNIFIED' | 'DISPENSED'>('INDEMNIFIED');
  const [hasVestedVacation, setHasVestedVacation] = useState<boolean>(false);

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
    if (!admissionDate || !dismissalDate || s <= 0) return null;
    const start = new Date(admissionDate);
    const end = new Date(dismissalDate);
    if (end < start) return null;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const monthsTotal = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    const decimo = (s / 12) * (end.getMonth() + 1);
    const feriasProp = (s / 12) * (monthsTotal % 12 || 12) * 1.33;
    
    let penalty = 0;
    const fgtsBase = (s * 0.08) * Math.max(1, monthsTotal);
    if (terminationType === 'WITHOUT_CAUSE') penalty = fgtsBase * 0.4;
    if (terminationType === 'AGREEMENT') penalty = fgtsBase * 0.2;

    const notice = (terminationType === 'WITHOUT_CAUSE' && noticeType === 'INDEMNIFIED') ? s : 0;

    const breakdown = [{ l: 'Saldo Salário', v: balanceCalculation(s, end) }, { l: '13º Proporcional', v: decimo }, { l: 'Férias Prop + 1/3', v: feriasProp }];
    if (hasVestedVacation) breakdown.push({ l: 'Férias Vencidas + 1/3', v: s * 1.33 });
    if (notice > 0) breakdown.push({ l: 'Aviso Prévio', v: notice });
    if (penalty > 0) breakdown.push({ l: 'Multa FGTS', v: penalty });

    function balanceCalculation(sal: number, dateEnd: Date) {
        return (sal / 30) * dateEnd.getDate();
    }

    let finalItems = [...breakdown];
    if (terminationType === 'WITH_CAUSE') finalItems = [{ l: 'Saldo Salário', v: balanceCalculation(s, end) }];
    if (terminationType === 'RESIGNATION') finalItems = finalItems.filter(i => i.l !== 'Multa FGTS' && i.l !== 'Aviso Prévio');

    const total = finalItems.reduce((acc, curr) => acc + curr.v, 0);
    return { total, breakdown: finalItems, totalDays: Math.ceil(diffTime / (1000 * 60 * 60 * 24)) };
  }, [salary, admissionDate, dismissalDate, terminationType, noticeType, hasVestedVacation]);

  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    if (len > 22) return 'text-2xl sm:text-3xl';
    if (len > 18) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl lg:text-6xl';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-file-signature text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Cálculo Rescisório</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Simulador de Verbas</p>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black uppercase text-gray-400 ml-1">Admissão</label><input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-red-600 outline-none font-bold mt-1 text-sm shadow-sm" /></div>
              <div><label className="text-[10px] font-black uppercase text-gray-400 ml-1">Demissão</label><input type="date" value={dismissalDate} onChange={(e) => setDismissalDate(e.target.value)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-red-600 outline-none font-bold mt-1 text-sm shadow-sm" /></div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Salário Bruto</label>
              <div className="relative">
                 <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">R$</span>
                 <input type="text" value={salary} onChange={(e) => handleCurrencyInput(e.target.value, setSalary)} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-red-600 outline-none text-xl font-black shadow-sm transition-all" placeholder="0,00" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <select value={terminationType} onChange={(e:any) => setTerminationType(e.target.value)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-xs uppercase tracking-wider shadow-sm">
                <option value="WITHOUT_CAUSE">Sem Justa Causa</option>
                <option value="RESIGNATION">Pedido Demissão</option>
                <option value="WITH_CAUSE">Com Justa Causa</option>
                <option value="AGREEMENT">Acordo (Reforma)</option>
              </select>
              <select value={noticeType} onChange={(e:any) => setNoticeType(e.target.value)} className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-red-600 outline-none font-black text-xs uppercase tracking-wider shadow-sm">
                <option value="INDEMNIFIED">Aviso Indenizado</option>
                <option value="WORKED">Aviso Trabalhado</option>
                <option value="DISPENSED">Aviso Dispensado</option>
              </select>
            </div>
            <button onClick={() => setHasVestedVacation(!hasVestedVacation)} className={`w-full p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-between ${hasVestedVacation ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-400'}`}>
                <span>Férias Vencidas?</span>
                <i className={`fas ${hasVestedVacation ? 'fa-check-circle text-lg' : 'fa-circle text-lg opacity-20'}`}></i>
            </button>
        </div>
      </div>

      <div className="bg-red-900 rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl relative border-8 border-red-800/30 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-red-300 uppercase tracking-[0.4em] opacity-80 mb-3">Total Bruto Estimado</p>
              <div className="flex justify-center items-center min-h-[80px]">
                <h4 className={`font-black text-white leading-tight tabular-nums tracking-tighter transition-all duration-300 ${getDynamicFontSize(formatBRL(results.total))}`}>
                  {formatBRL(results.total)}
                </h4>
              </div>
              <p className="text-[10px] text-red-200 font-bold uppercase mt-4">Vínculo: {results.totalDays} dias</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {results.breakdown.map((item, i) => (
                <div key={i} className="bg-white/5 p-5 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-black text-red-200 uppercase mb-2 leading-none">{item.l}</span>
                  <span className="font-black text-white text-sm sm:text-base">{formatBRL(item.v)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-file-signature text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Insira os dados do vínculo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminationCalculator;
