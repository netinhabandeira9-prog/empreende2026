import React from 'react';

interface AppsPageProps {
  onSelectApp: (appId: string) => void;
}

const AppsPage: React.FC<AppsPageProps> = ({ onSelectApp }) => {
  const apps = [
    {
      id: 'preco-certo',
      name: 'NB Preço Certo',
      desc: 'Escaneie notas fiscais e defina seu preço de venda com margem real instantaneamente.',
      icon: 'fa-tags',
      color: 'blue',
      tag: 'Mais Popular',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'meu-ir',
      name: 'NB Meu IR',
      desc: 'Controle de Carnê-Leão, Auditoria contra Malha Fina e organização de recibos 100% offline.',
      icon: 'fa-shield-halved',
      color: 'slate',
      tag: 'Proteção Fiscal',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'mei-control',
      name: 'NB MEI Control',
      desc: 'Gestão completa de faturamento anual para nunca estourar o limite do MEI.',
      icon: 'fa-chart-pie',
      color: 'purple',
      tag: 'Em Breve',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            Ecossistema NB 2026
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">Soluções Digitais para o seu Negócio</h1>
          <p className="text-xl text-gray-500">Desenvolvemos aplicativos focados na simplicidade e na lucratividade do pequeno empreendedor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {apps.map((app) => (
            <div 
              key={app.id}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img src={app.image} alt={app.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6">
                  <span className={`bg-${app.color === 'slate' ? 'gray-800' : app.color + '-600'} text-white text-[9px] font-black uppercase px-3 py-1 rounded-lg`}>{app.tag}</span>
                </div>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <div className={`bg-${app.color === 'slate' ? 'gray-100' : app.color + '-100'} text-${app.color === 'slate' ? 'gray-800' : app.color + '-600'} w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6`}>
                  <i className={`fas ${app.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{app.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{app.desc}</p>
                <button 
                  onClick={() => onSelectApp(app.id)}
                  className={`w-full py-3.5 ${app.id === 'mei-control' ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-700'} text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition active:scale-95 shadow-lg`}
                  disabled={app.id === 'mei-control'}
                >
                  {app.id === 'mei-control' ? 'Aguarde' : 'Saiba Mais'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left md:w-2/3">
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Dificuldade com algum app?</h2>
            <p className="text-gray-500 leading-relaxed max-w-md">Nosso time de suporte técnico está pronto para ajudar você a configurar e extrair o máximo das nossas ferramentas.</p>
          </div>
          <a 
            href="https://api.whatsapp.com/send?phone=5588994517595&text=Olá! Preciso de suporte técnico nos apps da NB."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-10 py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-green-600 transition shadow-xl shadow-green-500/20 active:scale-95"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            Suporte via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppsPage;