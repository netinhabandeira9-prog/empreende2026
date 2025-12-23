
import React, { useState } from 'react';
import { getTaxAdvice } from '../services/geminiService';
import { GroundingSource } from '../types';

const AIConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setSources([]);
    const result = await getTaxAdvice(query);
    setResponse(result.text);
    setSources(result.sources);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="consultant" className="py-20 bg-blue-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-blue-700 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Consultor Tributário 2026 Online</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Dúvidas sobre a Reforma?</h2>
          <p className="text-blue-100 text-lg">Nossa IA está conectada às fontes oficiais de 2026 para te guiar.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleConsult} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Qual o novo teto do MEI para 2026?"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <button
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 px-8 rounded-2xl transition shadow-lg flex items-center justify-center min-w-[150px] active:scale-95"
              >
                {loading ? (
                  <i className="fas fa-spinner animate-spin text-xl"></i>
                ) : (
                  <>Consultar <i className="fas fa-paper-plane ml-2"></i></>
                )}
              </button>
            </div>
          </form>

          {response && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-3 rounded-xl shrink-0">
                  <i className="fas fa-robot text-xl"></i>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-blue-200">Consultoria Digital</h4>
                    <button 
                      onClick={copyToClipboard}
                      className="text-xs text-blue-300 hover:text-white transition flex items-center bg-white/5 px-2 py-1 rounded"
                    >
                      {copied ? <><i className="fas fa-check mr-1"></i> Copiado</> : <><i className="far fa-copy mr-1"></i> Copiar</>}
                    </button>
                  </div>
                  <p className="text-blue-50 leading-relaxed whitespace-pre-wrap">{response}</p>
                </div>
              </div>

              {sources.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <h5 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Fontes da Resposta:</h5>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-800/50 hover:bg-blue-700 transition px-3 py-2 rounded-lg border border-white/10 flex items-center"
                      >
                        <i className="fas fa-external-link-alt mr-2 text-[10px]"></i>
                        {source.title || 'Ver Fonte Oficial'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
