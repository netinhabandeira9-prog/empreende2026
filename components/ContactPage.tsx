
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-6">Fale Conosco</h1>
            <p className="text-xl text-gray-600 mb-12">Dúvidas, sugestões ou feedbacks? Nossa equipe técnica está pronta para te ouvir.</p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                  <i className="fas fa-envelope text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Editorial</h4>
                  <p className="text-gray-500">contato@empreende2026.com.br</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-green-500 text-white p-4 rounded-2xl shadow-lg">
                  <i className="fab fa-whatsapp text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Suporte WhatsApp</h4>
                  <p className="text-gray-500">(11) 99999-0000</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-12">
                <h4 className="font-bold text-gray-900 mb-4">Horário de Atendimento</h4>
                <p className="text-sm text-gray-500">Segunda a Sexta: 09h às 18h<br/>Sábados: 09h às 13h</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Seu Nome</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="João Silva" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Seu Email</label>
                  <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="joao@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Assunto</label>
                <select className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
                  <option>Dúvida sobre Calculadora</option>
                  <option>Sugestão de Artigo</option>
                  <option>Problemas Técnicos</option>
                  <option>Parcerias</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Mensagem</label>
                <textarea rows={5} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Como podemos te ajudar?"></textarea>
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition active:scale-95">Enviar Mensagem</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
