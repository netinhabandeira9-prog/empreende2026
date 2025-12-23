
import React, { useState, useMemo } from 'react';

const RetirementCalculator: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [contributionYears, setContributionYears] = useState<string>('');
  const [gender, setGender] = useState<'M' | 'F'>('F');

  const results = useMemo(() => {
    const a = parseInt(age);
    const c = parseInt(contributionYears);
    if (!a || !c) return null;
    const points = a + c;
    const target = gender === 'M' ? 103 : 93; // Regra projetada 2026
    return { points, target, missing: Math.max(0, target - points) };
  }, [age, contributionYears, gender]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-gray-900">Seu Futuro em 2026</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setGender('F')} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${gender === 'F' ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400'}`}>MULHER</button>
          <button onClick={() => setGender('M')} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${gender === 'M' ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400'}`}>HOMEM</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-[10px] font-black text-gray-400 uppercase">Sua Idade</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-2xl font-black mt-1" placeholder="30" /></div>
          <div><label className="text-[10px] font-black text-gray-400 uppercase">Anos Pagos</label><input type="number" value={contributionYears} onChange={(e) => setContributionYears(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200 outline-none text-2xl font-black mt-1" placeholder="10" /></div>
        </div>
      </div>
      <div className="bg-amber-900 rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col justify-center text-center shadow-2xl shadow-amber-100 min-h-[350px] lg:min-h-[400px] overflow-hidden">
        {results ? (
          <div className="space-y-8 animate-fadeIn w-full">
            <div className="bg-white/10 p-6 md:p-10 rounded-[2.5rem] border border-white/5">
              <p className="text-[10px] font-black text-amber-300 uppercase mb-2">Pontuação Atual</p>
              <h4 className="text-5xl sm:text-6xl md:text-7xl font-black break-words leading-tight">{results.points}</h4>
              <p className="text-[10px] sm:text-xs font-bold text-amber-200 mt-2 uppercase tracking-widest">Meta 2026: {results.target} Pontos</p>
            </div>
            {results.missing <= 0 ? (
              <div className="bg-green-500 p-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase">✅ Elegível para Requerer</div>
            ) : (
              <p className="text-xs sm:text-sm italic text-amber-100">Faltam aproximadamente {results.missing} pontos para atingir a meta.</p>
            )}
          </div>
        ) : <div className="opacity-20 py-10"><i className="fas fa-hourglass-half text-6xl"></i><p className="mt-4 text-xs font-bold uppercase tracking-widest">Verificar Vínculos</p></div>}
      </div>
    </div>
  );
};

export default RetirementCalculator;
