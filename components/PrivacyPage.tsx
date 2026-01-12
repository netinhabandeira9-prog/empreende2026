
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-gray-500">Última atualização: Janeiro de 2026</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Compromisso com a Transparência</h2>
            <p>
              No Empreende2026, a privacidade dos nossos usuários é prioridade. Como um portal focado em ferramentas financeiras e tributárias, entendemos a sensibilidade dos dados que você pode vir a inserir em nossas calculadoras ou consultas de Inteligência Artificial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Dados Coletados</h2>
            <p>Coletamos informações das seguintes formas:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Calculadoras:</strong> Os dados numéricos inseridos (faturamento, despesas, custos) são processados localmente em seu navegador para gerar resultados imediatos. Não armazenamos esses valores em nossos servidores de banco de dados de forma persistente.</li>
              <li><strong>Consultoria IA:</strong> As perguntas enviadas ao nosso consultor digital são processadas para fornecer respostas precisas. Utilizamos tecnologias que garantem o anonimato dos dados antes de qualquer processamento externo.</li>
              <li><strong>Formulários de Contato:</strong> Nome e e-mail são utilizados exclusivamente para responder às suas solicitações.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. Uso de Inteligência Artificial</h2>
            <p>
              Nosso sistema utiliza modelos avançados da Google Gemini para interpretar a legislação de 2026. Ao interagir com a IA, evite fornecer dados pessoais sensíveis (como CPF ou endereço real) para garantir sua segurança total.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">4. Proteção de Dados (LGPD 2026)</h2>
            <p>
              Operamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD), incluindo as atualizações normativas de 2026 relativas ao Domicílio Eletrônico Trabalhista (DET) e segurança cibernética.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seus Direitos</h2>
            <p className="text-sm mb-4">Você tem o direito de:</p>
            <ul className="text-sm space-y-2">
              <li><i className="fas fa-check text-blue-600 mr-2"></i> Solicitar a exclusão de seus dados de contato.</li>
              <li><i className="fas fa-check text-blue-600 mr-2"></i> Saber quais informações processamos sobre suas interações.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">5. Contato sobre Privacidade</h2>
            <p>
              Para qualquer dúvida sobre como tratamos suas informações, entre em contato através do e-mail: <span className="font-bold text-blue-600">netinhabandeira9@gmail.com</span>
            </p>
          </section>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
           <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 font-bold hover:underline"
           >
             Voltar ao topo
           </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
