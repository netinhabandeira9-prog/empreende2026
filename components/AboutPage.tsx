
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6">Nossa Missão</h1>
          <p className="text-xl text-gray-500">Apoiar o motor da economia brasileira: o Microempreendedor.</p>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            O <strong>Empreende2026</strong> nasceu da necessidade urgente de traduzir a complexa reforma tributária brasileira para aqueles que não têm tempo a perder: os MEIs e profissionais autônomos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Educação Financeira</h3>
              <p className="text-sm">Acreditamos que a informação de qualidade é a melhor ferramenta contra a inadimplência e o fechamento precoce de empresas.</p>
            </div>
            <div className="bg-blue-50 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Tecnologia Ética</h3>
              <p className="text-sm">Utilizamos Inteligência Artificial para democratizar o acesso à consultoria tributária de alto nível, antes restrita a grandes empresas.</p>
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mt-12">Por que 2026?</h2>
          <p>
            Este ano marca a consolidação da maior mudança nos impostos brasileiros das últimas décadas. Com a entrada definitiva do IBS e CBS, o empreendedor precisa estar vigilante. Nosso portal é atualizado semanalmente para refletir cada vírgula da nova legislação.
          </p>

          <div className="bg-gray-900 p-12 rounded-[3rem] text-center mt-20">
            <div className="text-blue-500 text-4xl mb-6">
              <i className="fas fa-quote-left"></i>
            </div>
            <p className="text-white text-2xl font-medium italic mb-8">
              "O sucesso do pequeno negócio é o que constrói um país forte. Nossa tecnologia serve para garantir que você foque no seu talento, enquanto nós cuidamos dos números."
            </p>
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Equipe Empreende2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
