
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
    const target = gender === 'M' ? 103 : 93; 
    return { points, target, missing: Math.max(0, target - points) };
  }, [age, contributionYears, gender]);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-hourglass-half text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Previdência 2026</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Simulador de Pontos</p>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-5">
            <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <button onClick={() => setGender('F')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'F' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400'}`}>Feminino</button>
              <button onClick={() => setGender('M')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'M' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400'}`}>Masculino</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Sua Idade</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-5 rounded-2xl bg-white border-2 border-transparent focus:border-amber-600 shadow-sm outline-none text-xl font-black" placeholder="30" /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Contribuição (Anos)</label><input type="number" value={contributionYears} onChange={(e) => setContributionYears(e.target.value)} className="w-full p-5 rounded-2xl bg-white border-2 border-transparent focus:border-amber-600 shadow-sm outline-none text-xl font-black" placeholder="10" /></div>
            </div>
        </div>
      </div>

      <div className="bg-amber-900 rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl relative border-8 border-amber-800/30 overflow-hidden">
        {results ? (
          <div className="animate-fadeIn w-full flex flex-col items-center space-y-10">
            <div className="text-center w-full">
              <p className="text-[10px] font-black text-amber-300 uppercase tracking-[0.4em] opacity-80 mb-3">Sua Pontuação</p>
              <div className="flex justify-center items-center min-h-[80px]">
                <h4 className="text-6xl sm:text-7xl lg:text-8xl font-black tabular-nums tracking-tighter transition-all duration-300 leading-tight">
                  {results.points}
                </h4>
              </div>
              <p className="text-xs font-black uppercase text-amber-200 mt-2 tracking-widest">Meta 2026: {results.target} Pontos</p>
            </div>

            <div className="w-full pt-8 border-t border-white/10 text-center">
              {results.missing <= 0 ? (
                <div className="bg-green-500/20 text-green-400 px-8 py-4 rounded-3xl border border-green-500/30 inline-flex items-center space-x-3">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm font-black uppercase tracking-widest">Elegível para Aposentadoria</span>
                </div>
              ) : (
                <div className="inline-flex flex-col items-center space-y-2 bg-white/10 px-8 py-4 rounded-[2.5rem] border border-white/10 shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">Faltam Aproximadamente:</span>
                  <span className="text-white font-black text-2xl">{results.missing} pontos</span>
                </div>
              )}
              <p className="text-[10px] text-amber-300/40 italic mt-8 max-w-sm mx-auto leading-relaxed">
                A pontuação é a soma da idade + tempo de contribuição. Regras sujeitas à transição da Previdência.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
              <i className="fas fa-hourglass-half text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Informe sua idade e contribuição</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementCalculator;
