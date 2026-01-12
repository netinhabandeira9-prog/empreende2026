
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Termos e Condições de Uso</h1>
          <p className="text-gray-500">Vigente a partir de: 01 de Janeiro de 2026</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar o portal <strong>NB Empreende</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Uso de Licença</h2>
            <p>
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site NB Empreende, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modificar ou copiar os materiais;</li>
              <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
              <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
              <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. Isenção de Responsabilidade</h2>
            <p>
              Os materiais no site da NB Empreende são fornecidos 'como estão'. NB Empreende não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            </p>
            <p>
              Além disso, o NB Empreende não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site. As calculadoras fornecidas são simulações baseadas em projeções da Reforma Tributária de 2026 e não substituem o aconselhamento de um contador profissional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">4. Limitações</h2>
            <p>
              Em nenhum caso o NB Empreende ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em NB Empreende.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">5. Precisão dos Materiais</h2>
            <p>
              Os materiais exibidos no site da NB Empreende podem incluir erros técnicos, tipográficos ou fotográficos. NB Empreende não garante que qualquer material em seu site seja preciso, completo ou atual. NB Empreende pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">6. Links e Referências Externas</h2>
            <p>
              O portal NB Empreende preza pela segurança e integridade das informações fornecidas. Todos os links externos presentes em nossas páginas são criteriosamente selecionados e apontam exclusivamente para sites de propriedade da NB Empreende ou para parceiros estratégicos de total confiança, como a Confia Crédito. 
            </p>
            <p>
              Embora mantenhamos um controle rigoroso sobre essas conexões para garantir um ambiente seguro, ressaltamos que a navegação em domínios de parceiros segue os termos de serviço e políticas de privacidade de seus respectivos sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">7. Modificações</h2>
            <p>
              O NB Empreende pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">8. Lei Aplicável</h2>
            <p>
              Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
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

export default TermsPage;
