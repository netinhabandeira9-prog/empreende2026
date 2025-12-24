
import React, { useState, useMemo } from 'react';

type LoanModality = 'FGTS' | 'INSS' | 'BOLSA_FAMILIA' | 'SERVIDOR' | 'CONSIGNADO';

interface ModalityConfig {
  label: string;
  icon: string;
  rate: number; // Taxa mensal média estimada
  maxMonths: number;
  desc: string;
}

const MODALITIES: Record<LoanModality, ModalityConfig> = {
  FGTS: { label: 'Antecipação FGTS', icon: 'fa-money-bill-trend-up', rate: 1.9, maxMonths: 1, desc: 'Receba até 10 parcelas do seu saque-aniversário agora.' },
  INSS: { label: 'Aposentado / Pensionista', icon: 'fa-person-cane', rate: 1.6, maxMonths: 84, desc: 'Crédito consignado com as menores taxas do mercado.' },
  BOLSA_FAMILIA: { label: 'Bolsa Família', icon: 'fa-house-chimney-user', rate: 2.5, maxMonths: 24, desc: 'Auxílio financeiro rápido para beneficiários do programa.' },
  SERVIDOR: { label: 'Servidor Público', icon: 'fa-building-columns', rate: 1.4, maxMonths: 96, desc: 'Taxas exclusivas para servidores municipais, estaduais e federais.' },
  CONSIGNADO: { label: 'Consignado Privado', icon: 'fa-briefcase', rate: 2.1, maxMonths: 48, desc: 'Para funcionários de empresas parceiras com desconto em folha.' },
};

const LoanCalculator: React.FC = () => {
  const [modality, setModality] = useState<LoanModality>('INSS');
  const [amount, setAmount] = useState<string>('500000'); // 5.000,00 padrão
  const [months, setMonths] = useState<number>(24);

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
    }).format(val).replace(/\s/g, '\u00A0');
  };

  const results = useMemo(() => {
    const p = parseToNumber(amount);
    const n = modality === 'FGTS' ? 1 : months;
    const config = MODALITIES[modality];
    const i = config.rate / 100;

    if (p <= 0) return null;

    if (modality === 'FGTS') {
      const total = p * (1 + i); // Simples para FGTS
      return { installment: 0, total, interest: total - p };
    }

    // PRICE formula para os demais
    const installment = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = installment * n;
    return { installment, total, interest: total - p };
  }, [amount, months, modality]);

  const whatsappLink = `https://api.whatsapp.com/send/?phone=5588996842061&text=Ol%C3%A1!%20Simulei%20um%20empr%C3%A9stimo%20do%20tipo%20${MODALITIES[modality].label}%20no%20valor%20de%20${amount}%20pelo%20site%20Empreende2026%20e%20quero%20falar%20com%20um%20atendente%20da%20Confia.&type=phone_number&app_absent=0`;

  return (
    <div className="space-y-8">
      {/* Seletor de Modalidade */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(MODALITIES) as LoanModality[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              setModality(key);
              if (MODALITIES[key].maxMonths < months) setMonths(MODALITIES[key].maxMonths);
            }}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
              modality === key 
                ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                : 'border-gray-100 bg-white text-gray-400 hover:border-green-200'
            }`}
          >
            <i className={`fas ${MODALITIES[key].icon} text-xl`}></i>
            <span className="text-[9px] font-black uppercase leading-tight">{MODALITIES[key].label}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Quanto você precisa?</label>
            <div className="relative mt-2">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-green-600 text-xl">R$</span>
              <input 
                type="text" 
                inputMode="decimal" 
                value={amount} 
                onChange={(e) => handleCurrencyInput(e.target.value, setAmount)} 
                className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white border-2 border-transparent focus:border-green-500 outline-none text-3xl font-black shadow-sm"
              />
            </div>
          </div>

          {modality !== 'FGTS' && (
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Em quantas vezes?</label>
                <span className="text-sm font-black text-green-600">{months}x</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max={MODALITIES[modality].maxMonths} 
                value={months} 
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase mt-2">
                <span>6 Meses</span>
                <span>{MODALITIES[modality].maxMonths} Meses</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-green-100 shadow-xl space-y-6">
          {results ? (
            <div className="text-center animate-fadeIn">
              {modality !== 'FGTS' ? (
                <>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcela Mensal Estimada</p>
                  <h4 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter tabular-nums">
                    {formatBRL(results.installment)}
                  </h4>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total a Debitar do Saldo</p>
                  <h4 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter tabular-nums">
                    {formatBRL(results.total)}
                  </h4>
                </>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Taxa de Juros</p>
                  <p className="text-sm font-black text-green-600">{MODALITIES[modality].rate}% a.m.</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Custo Total</p>
                  <p className="text-sm font-black text-gray-900">{formatBRL(results.total)}</p>
                </div>
              </div>

              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition shadow-lg active:scale-95 group"
              >
                <i className="fab fa-whatsapp text-xl"></i>
                Solicitar Liberação Agora
              </a>
            </div>
          ) : (
            <div className="text-center py-10 opacity-20">
              <i className="fas fa-calculator text-4xl mb-2"></i>
              <p className="text-[10px] font-black uppercase">Aguardando dados</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
        <p className="text-[9px] font-bold text-red-600 leading-tight">
          *Esta é uma simulação baseada em taxas médias da Confia. Os valores finais dependem da análise do seu CPF/Convênio. 
          Sujeito a aprovação de crédito e condições contratuais.
        </p>
      </div>
    </div>
  );
};

export default LoanCalculator;
