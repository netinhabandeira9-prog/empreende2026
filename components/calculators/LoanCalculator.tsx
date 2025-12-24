
import React, { useState, useMemo } from 'react';

type LoanModality = 'FGTS' | 'INSS' | 'BOLSA_FAMILIA' | 'SERVIDOR' | 'CONSIGNADO';

interface ModalityConfig {
  label: string;
  icon: string;
  rate: number; // Taxa mensal média estimada
  maxMonths: number;
  maxAmountDesc: string;
  desc: string;
}

const MODALITIES: Record<LoanModality, ModalityConfig> = {
  FGTS: { 
    label: 'Antecipação FGTS', 
    icon: 'fa-money-bill-trend-up', 
    rate: 1.9, 
    maxMonths: 1, 
    maxAmountDesc: 'Conforme seu saldo FGTS',
    desc: 'Receba até 10 parcelas do seu saque-aniversário agora.' 
  },
  INSS: { 
    label: 'Aposentado / INSS', 
    icon: 'fa-person-cane', 
    rate: 1.6, 
    maxMonths: 84, 
    maxAmountDesc: 'Até R$ 150.000,00',
    desc: 'Crédito consignado com as menores taxas do mercado.' 
  },
  BOLSA_FAMILIA: { 
    label: 'Bolsa Família', 
    icon: 'fa-house-chimney-user', 
    rate: 2.5, 
    maxMonths: 24, 
    maxAmountDesc: 'Até R$ 2.500,00',
    desc: 'Auxílio financeiro rápido para beneficiários do programa.' 
  },
  SERVIDOR: { 
    label: 'Servidor Público', 
    icon: 'fa-building-columns', 
    rate: 1.4, 
    maxMonths: 96, 
    maxAmountDesc: 'Até R$ 200.000,00',
    desc: 'Taxas exclusivas para servidores municipais, estaduais e federais.' 
  },
  CONSIGNADO: { 
    label: 'Consignado Privado', 
    icon: 'fa-briefcase', 
    rate: 2.1, 
    maxMonths: 48, 
    maxAmountDesc: 'Conforme sua margem salarial',
    desc: 'Para funcionários de empresas parceiras com desconto em folha.' 
  },
};

const LoanCalculator: React.FC = () => {
  const [modality, setModality] = useState<LoanModality>('INSS');
  const [amount, setAmount] = useState<string>(''); // Inicialmente vazio para o usuário preencher
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
    if (p <= 0) return null;

    const n = modality === 'FGTS' ? 1 : months;
    const config = MODALITIES[modality];
    const i = config.rate / 100;

    if (modality === 'FGTS') {
      const total = p * (1 + i); // Simples para FGTS
      return { installment: 0, total, interest: total - p };
    }

    // PRICE formula para os demais
    const installment = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = installment * n;
    return { installment, total, interest: total - p };
  }, [amount, months, modality]);

  const whatsappLink = `https://api.whatsapp.com/send/?phone=5588996842061&text=Ol%C3%A1!%20Estou%20no%20site%20Empreende2026%20e%20gostaria%20de%20simular%20um%20empr%C3%A9stimo%20do%20tipo%20${MODALITIES[modality].label}%20no%20valor%20de%20R$%20${amount || '0,00'}.%20Pode%20me%20ajudar?&type=phone_number&app_absent=0`;

  return (
    <div className="space-y-10">
      {/* Seletor de Modalidade com Informações de Limite */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(MODALITIES) as LoanModality[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              setModality(key);
              if (MODALITIES[key].maxMonths < months) setMonths(MODALITIES[key].maxMonths);
            }}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 group ${
              modality === key 
                ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                : 'border-gray-100 bg-white text-gray-400 hover:border-green-200'
            }`}
          >
            <i className={`fas ${MODALITIES[key].icon} text-xl group-hover:scale-110 transition-transform`}></i>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase leading-tight mb-1">{MODALITIES[key].label}</span>
              <span className="text-[7px] font-bold text-gray-400 group-hover:text-green-600 transition-colors uppercase tracking-tighter">
                {MODALITIES[key].maxAmountDesc}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-6 md:p-10 rounded-[3rem] border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-end mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Quanto você precisa?</label>
              <span className="text-[9px] font-bold text-green-500 bg-green-100 px-2 py-0.5 rounded-full uppercase">
                {MODALITIES[modality].maxAmountDesc}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-green-600 text-2xl">R$</span>
              <input 
                type="text" 
                inputMode="decimal" 
                value={amount} 
                onChange={(e) => handleCurrencyInput(e.target.value, setAmount)} 
                className="w-full pl-16 pr-6 py-7 rounded-3xl bg-white border-2 border-transparent focus:border-green-500 outline-none text-4xl font-black shadow-sm placeholder:text-gray-200 transition-all"
                placeholder="0,00"
              />
            </div>
            <p className="mt-3 text-[10px] text-gray-400 font-medium italic px-1">
              * Digite apenas os números, o sistema formata o valor automaticamente.
            </p>
          </div>

          {modality !== 'FGTS' && (
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Prazo de Pagamento</label>
                <div className="bg-green-600 text-white px-4 py-1.5 rounded-xl text-lg font-black shadow-lg shadow-green-600/20">
                  {months}x
                </div>
              </div>
              <input 
                type="range" 
                min="6" 
                max={MODALITIES[modality].maxMonths} 
                value={months} 
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-2xl appearance-none cursor-pointer accent-green-500 border-4 border-white shadow-inner"
              />
              <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase mt-3 px-1">
                <span>Mínimo: 6 Meses</span>
                <span>Máximo: {MODALITIES[modality].maxMonths} Meses</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Badge de Oferta */}
          <div className="absolute -top-4 -right-4 z-20 bg-amber-400 text-gray-900 px-4 py-2 rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-amber-400/20 rotate-12">
            Taxa Reduzida!
          </div>

          <div className="bg-white p-10 rounded-[3rem] border-2 border-green-100 shadow-2xl relative overflow-hidden group">
            {/* Background pattern inside the card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            {results ? (
              <div className="text-center animate-fadeIn relative z-10">
                {modality !== 'FGTS' ? (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Parcela Mensal Estimada</p>
                    <h4 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter tabular-nums mb-2">
                      {formatBRL(results.installment)}
                    </h4>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total a Debitar do Saldo</p>
                    <h4 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter tabular-nums mb-2">
                      {formatBRL(results.total)}
                    </h4>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Taxa Juros</p>
                    <p className="text-base font-black text-green-600">{MODALITIES[modality].rate}% <span className="text-[10px] text-gray-400">a.m.</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Custo Total</p>
                    <p className="text-base font-black text-gray-900">{formatBRL(results.total)}</p>
                  </div>
                </div>

                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-10 bg-green-500 hover:bg-green-600 text-white py-6 rounded-3xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 transition shadow-2xl shadow-green-500/30 active:scale-95 group"
                >
                  <i className="fab fa-whatsapp text-2xl group-hover:rotate-12 transition-transform"></i>
                  Liberar meu crédito
                </a>
              </div>
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
                  <i className="fas fa-hand-pointer text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 uppercase text-xs">Aguardando Valor</h4>
                  <p className="text-[10px] text-gray-400 font-bold max-w-[180px] mx-auto mt-2 uppercase leading-relaxed">
                    Preencha o valor acima para ver as melhores taxas da Confia.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer de Confiança */}
      <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
          <i className="fas fa-user-shield text-2xl text-white"></i>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h5 className="font-black text-sm uppercase tracking-widest mb-2">Simulação Segura & Transparente</h5>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Nossos cálculos são atualizados em tempo real conforme as normas do Banco Central e as diretrizes da <strong>Confia Crédito</strong>. O valor final e a aprovação dependem da análise cadastral e margem disponível. Não solicitamos pagamentos antecipados para liberação de crédito.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
