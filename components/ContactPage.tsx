
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest">
              Oportunidade B2B 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">Seja nosso <br/><span className="text-blue-700">parceiro.</span></h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Expanda sua marca no maior portal de auxílio ao empreendedor de 2026. Tenha sua logo e seus serviços em destaque no nosso blog editorial e ferramentas.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <i className="fas fa-envelope text-xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest">E-mail para Parcerias</h4>
                  <p className="text-gray-500 font-bold">netinhabandeira9@gmail.com</p>
                </div>
              </div>
              
              <a 
                href="https://api.whatsapp.com/send?phone=5588981960272" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all"
              >
                <div className="bg-green-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <i className="fab fa-whatsapp text-2xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest">WhatsApp Comercial</h4>
                  <p className="text-gray-500 font-bold">(88) 9 8196-0272</p>
                </div>
              </a>

              <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h4 className="font-black mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-line text-blue-400"></i>
                  Por que anunciar conosco?
                </h4>
                <ul className="text-xs space-y-3 text-gray-400 font-medium">
                  <li className="flex items-center gap-2"><i className="fas fa-check text-blue-500"></i> Audiência qualificada de MEIs e Autônomos.</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-blue-500"></i> Autoridade máxima em Reforma Tributária 2026.</li>
                  <li className="flex items-center gap-2"><i className="fas fa-check text-blue-500"></i> Integração nativa com nossas calculadoras.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 relative">
            <div className="absolute -top-6 -left-6 bg-amber-400 text-gray-900 px-6 py-2 rounded-2xl font-black text-xs uppercase shadow-xl rotate-[-5deg]">
              Formulário Direto
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-8">Envie sua Proposta</h3>
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nome da Empresa</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" placeholder="Sua Marca Ltda" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">E-mail de Contato</label>
                  <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold" placeholder="comercial@suaempresa.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Seu Serviço/Produto</label>
                  <textarea rows={4} className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold resize-none" placeholder="Descreva brevemente como podemos colaborar..."></textarea>
                </div>
              </div>
              <button className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition active:scale-95 text-xs uppercase tracking-widest">
                Solicitar Parceria <i className="fas fa-paper-plane ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
