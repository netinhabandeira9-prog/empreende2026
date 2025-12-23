
import React from 'react';

interface MemberAreaProps {
  onClose: () => void;
}

const MemberArea: React.FC<MemberAreaProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="relative z-10">
          <div className="bg-yellow-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-500/20 rotate-3">
            <i className="fas fa-rocket text-gray-900 text-4xl"></i>
          </div>

          <h2 className="text-3xl font-black text-white mb-4">Área de Membros</h2>
          <div className="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Em Breve
          </div>

          <p className="text-gray-400 leading-relaxed mb-10 text-sm">
            Estamos construindo o ecossistema de gestão mais avançado para o MEI e Autônomo de 2026. 
            <br/><br/>
            Prepare-se para ter acesso a geradores de contratos, dashboards financeiros exclusivos e consultoria jurídica personalizada em um só lugar.
          </p>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition transform active:scale-95 shadow-xl"
          >
            Voltar ao Início
          </button>

          <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            Lançamento previsto para o segundo semestre
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberArea;
