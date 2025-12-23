
import { GoogleGenAI } from "@google/genai";

/**
 * Consulta o consultor tributário IA focado no cenário brasileiro de 2026.
 * Utiliza o modelo gemini-3-pro-preview com orçamento de pensamento (thinking budget)
 * para lidar com a complexidade da Reforma Tributária (IBS/CBS).
 */
export async function getTaxAdvice(userContext: string) {
  // A instância é criada dentro da função para garantir o uso da chave processada pelo Vercel
  // através da variável de ambiente process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `O usuário tem a seguinte dúvida sobre empreendedorismo/tributação no Brasil em 2026: "${userContext}". 
      Responda como um especialista sênior, detalhando regras de IBS, CBS, limites de faturamento do MEI e transição tributária de 2026.`,
      config: {
        // Habilitamos o raciocínio profundo (thinking) para lidar com a complexidade da nova legislação.
        // O gemini-3-pro-preview utilizará este orçamento para "pensar" antes de gerar a resposta final.
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é o Consultor Empreende2026. Sua missão é ajudar MEIs e autônomos a entenderem a Reforma Tributária. Seja técnico porém didático. Sempre use dados baseados na legislação vigente projetada para 2026. Priorize clareza sobre alíquotas de transição e novos impostos (IBS/CBS).",
      },
    });

    // Acessa a propriedade .text diretamente para obter a resposta gerada.
    const text = response.text || "Desculpe, não consegui formular uma resposta precisa agora. Por favor, tente reformular sua pergunta.";
    
    // Extração obrigatória de fontes de grounding ao usar o Google Search.
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter(s => s.uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Erro na consulta ao Consultor Tributário:", error);
    
    let errorMessage = "Ocorreu um erro ao processar sua consulta. ";
    // Caso a chave ainda não tenha sido configurada no Vercel, o erro será capturado aqui.
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("403"))) {
      errorMessage += "Parece haver um problema com a configuração da chave de API. Certifique-se de que a variável API_KEY está configurada corretamente nas variáveis de ambiente do seu projeto.";
    } else {
      errorMessage += "Por favor, tente novamente em alguns instantes.";
    }

    return { 
      text: errorMessage,
      sources: []
    };
  }
}
