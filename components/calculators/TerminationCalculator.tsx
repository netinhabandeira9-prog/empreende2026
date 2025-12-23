
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

  const results = useMemo(() => {
    const s = parseToNumber(salary);
    if (!admissionDate || !dismissalDate || s <= 0) return null;
    const start = new Date(admissionDate);
    const end = new Date(dismissalDate);
    if (end < start) return null;

    const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    const balance = (s / 30) * end.getDate();
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const monthsTotal = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    const decimo = (s / 12) * (end.getMonth() + 1);
    const feriasProp = (s / 12) * (monthsTotal % 12 || 12) * 1.33;
    
    let penalty = 0;
    const fgtsBase = (s * 0.08) * Math.max(1, monthsTotal);
    if (terminationType === 'WITHOUT_CAUSE') penalty = fgtsBase * 0.4;
    if (terminationType === 'AGREEMENT') penalty = fgtsBase * 0.2;

    const notice = (terminationType === 'WITHOUT_CAUSE' && noticeType === 'INDEMNIFIED') ? s : 0;

    const breakdown = [{ l: 'Saldo Salário', v: balance }, { l: '13º Proporcional', v: decimo }, { l: 'Férias Prop + 1/3', v: feriasProp }];
    if (hasVestedVacation) breakdown.push({ l: 'Férias Vencidas + 1/3', v: s * 1.33 });
    if (notice > 0) breakdown.push({ l: 'Aviso Prévio Indenizado', v: notice });
    if (penalty > 0) breakdown.push({ l: 'Multa FGTS (Est.)', v: penalty });

    let finalItems = [...breakdown];
    if (terminationType === 'WITH_CAUSE') finalItems = [{ l: 'Saldo Salário', v: balance }];
    if (terminationType === 'RESIGNATION') finalItems = finalItems.filter(i => i.l !== 'Multa FGTS (Est.)' && i.l !== 'Aviso Prévio Indenizado');

    const total = finalItems.reduce((acc, curr) => acc + curr.v, 0);
    return { total, breakdown: finalItems, totalDays: Math.ceil(diffTime / (1000 * 60 * 60 * 24)) };
  }, [salary, admissionDate, dismissalDate, terminationType, noticeType, hasVestedVacation]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-gray-900">Dados do Vínculo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-[10px] font-black uppercase text-gray-400">Admissão</label><input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none font-bold mt-1" /></div>
          <div><label className="text-[10px] font-black uppercase text-gray-400">Demissão</label><input type="date" value={dismissalDate} onChange={(e) => setDismissalDate(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none font-bold mt-1" /></div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400">Último Salário Bruto</label>
          <input type="text" value={salary} onChange={(e) => handleCurrencyInput(e.target.value, setSalary)} className="w-full p-5 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-xl md:text-2xl font-black mt-1" placeholder="R$ 0,00" />
        </div>
        <select value={terminationType} onChange={(e:any) => setTerminationType(e.target.value)} className="w-full p-5 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none font-bold appearance-none">
          <option value="WITHOUT_CAUSE">Demissão Sem Justa Causa</option>
          <option value="RESIGNATION">Pedido de Demissão</option>
          <option value="WITH_CAUSE">Demissão Com Justa Causa</option>
          <option value="AGREEMENT">Acordo entre as Partes</option>
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select value={noticeType} onChange={(e:any) => setNoticeType(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none font-bold">
            <option value="INDEMNIFIED">Aviso Indenizado</option>
            <option value="WORKED">Aviso Trabalhado</option>
            <option value="DISPENSED">Aviso Não Cumprido</option>
          </select>
          <button onClick={() => setHasVestedVacation(!hasVestedVacation)} className={`p-4 rounded-xl font-bold border-2 transition-all ${hasVestedVacation ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 text-gray-400'}`}>Férias Vencidas: {hasVestedVacation ? 'Sim' : 'Não'}</button>
        </div>
      </div>
      <div className="bg-red-900 rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col justify-center min-h-[350px] lg:min-h-[400px] shadow-2xl shadow-red-100 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full">
            <p className="text-[10px] font-black text-red-300 uppercase mb-2 tracking-widest">Total Líquido Estimado</p>
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 break-words leading-tight">{results.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
            <p className="text-[10px] text-red-200 italic mb-4">Período calculado: {results.totalDays} dias</p>
            <div className="space-y-3 pt-6 border-t border-white/10">
              {results.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-4 text-xs sm:text-sm">
                  <span className="text-red-200 font-bold truncate">{item.l}</span>
                  <span className="font-black whitespace-nowrap">{item.v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-center opacity-20 py-10"><i className="fas fa-file-signature text-6xl"></i><p className="mt-4 text-xs font-bold uppercase tracking-widest">Aguardando dados</p></div>}
      </div>
    </div>
  );
};

export default TerminationCalculator;
