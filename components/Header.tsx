
import React, { useState } from 'react';
import { CalculatorType } from '../types';

interface HeaderProps {
  onSelectTool: (tool: CalculatorType) => void;
  onSelectBlog: () => void;
  onSelectConsultant: () => void;
  onOpenMemberArea: () => void;
  onNavigate: (view: any) => void;
  onOpenAdmin: () => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onSelectTool, onSelectBlog, onSelectConsultant, onOpenMemberArea, onNavigate, onOpenAdmin, currentView }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      onOpenAdmin();
      setClickCount(0);
    } else {
      setClickCount(newCount);
      setTimeout(() => setClickCount(0), 2000);
      onNavigate('home');
    }
  };

  const menuItems = [
    { label: 'Início', view: 'home', icon: 'fa-home' },
    { label: 'Blog Editorial', view: 'blog', icon: 'fa-newspaper' },
    { label: 'Simulador de Crédito', view: 'loan', icon: 'fa-hand-holding-dollar' },
    { label: 'Performance & Sono', view: 'sono-score', icon: 'fa-moon' },
    { label: 'Calculadoras', view: 'calculators', icon: 'fa-calculator' },
    { label: 'Sobre', view: 'about', icon: 'fa-info-circle' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-2 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="bg-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-700/20">
              <i className="fas fa-chart-line text-white text-xl"></i>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">NB <span className="text-blue-700">Empreende</span></h1>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <button 
                key={item.view}
                onClick={() => onNavigate(item.view)} 
                className={`font-bold text-[10px] xl:text-[11px] uppercase tracking-widest transition-all hover:text-blue-700 whitespace-nowrap ${currentView === item.view ? 'text-blue-700 border-b-2 border-blue-700 pb-1' : 'text-gray-500'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
             <button 
              onClick={onOpenMemberArea}
              className="bg-gray-900 text-white px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-sm font-black hover:bg-blue-700 transition shadow-lg active:scale-95 flex items-center space-x-2"
             >
               <i className="fas fa-user-circle"></i>
               <span className="hidden sm:inline">Portal do Aluno</span>
             </button>

             <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 border border-gray-200"
              aria-label="Abrir Menu"
             >
               <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
             </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 z-[110] transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
        <nav className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} p-8 flex flex-col`}>
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
            <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Menu NB</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500"><i className="fas fa-times"></i></button>
          </div>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <button 
                key={item.view}
                onClick={() => { onNavigate(item.view); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${currentView === item.view ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <i className={`fas ${item.icon} w-6`}></i>
                <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
