
import React, { useState } from 'react';
import { CalculatorType } from '../types';

interface HeaderProps {
  onSelectTool: (tool: CalculatorType) => void;
  onSelectBlog: () => void;
  onSelectConsultant: () => void;
  onOpenMemberArea: () => void;
  onNavigate: (view: any) => void;
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSelectTool, onSelectBlog, onSelectConsultant, onOpenMemberArea, onNavigate, onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      onOpenAdmin();
      setClickCount(0);
    } else {
      setClickCount(newCount);
      // Reseta o contador se não houver novo clique em 2 segundos
      setTimeout(() => setClickCount(0), 2000);
      onNavigate('home');
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <i className="fas fa-chart-line text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Empreende<span className="text-blue-600">2026</span></span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-10">
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors uppercase tracking-widest">Início</button>
            <button onClick={onSelectBlog} className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors uppercase tracking-widest">Blog Editorial</button>
            <button onClick={() => onNavigate('calculators')} className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors uppercase tracking-widest">Calculadoras</button>
            <button onClick={() => onNavigate('about')} className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors uppercase tracking-widest">Sobre</button>
          </nav>

          <div className="flex items-center space-x-4">
             <button 
              onClick={onOpenMemberArea}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-blue-600 transition shadow-lg active:scale-95 flex items-center space-x-2"
             >
               <i className="fas fa-user-circle"></i>
               <span>Área de Membros</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
