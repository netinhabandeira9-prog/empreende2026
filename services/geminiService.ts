
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost } from "../types";

/**
 * Busca notícias reais e gera postagens de blog estruturadas.
 */
export async function fetchAndGenerateNews(): Promise<Partial<BlogPost>[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = `Faça uma busca detalhada nos sites da Receita Federal (fazenda.gov.br), INSS e portais de notícias sobre MEI, Reforma Tributária e Empreendedorismo no cenário de 2026. 
    Gere 3 postagens de blog inéditas e informativas baseadas nos fatos mais recentes.
    Para cada postagem, forneça: 
    1. Um título chamativo.
    2. Um resumo curto (excerpt).
    3. Categoria (ex: Legislação, Mercado, INSS).
    4. Conteúdo completo formatado em Markdown (use ### para subtítulos).
    5. Uma sugestão de URL de imagem do Unsplash que combine com o tema.
    
    Retorne os dados estritamente em formato JSON seguindo este esquema: 
    Array<{title: string, excerpt: string, category: string, content: string, image: string}>`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              category: { type: Type.STRING },
              content: { type: Type.STRING },
              image: { type: Type.STRING }
            },
            required: ["title", "excerpt", "category", "content", "image"]
          }
        },
        systemInstruction: "Você é um jornalista econômico especializado em microempreendedorismo no Brasil. Sua função é buscar fatos reais e transformá-los em artigos úteis.",
      },
    });

    const news = JSON.parse(response.text || "[]");
    return news;
  } catch (error) {
    console.error("Erro ao gerar notícias via IA:", error);
    return [];
  }
}

/**
 * Consulta o consultor tributário IA focado no cenário brasileiro de 2026.
 */
export async function getTaxAdvice(userContext: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `O usuário tem a seguinte dúvida sobre empreendedorismo/tributação no Brasil em 2026: "${userContext}". 
      Responda como um especialista sênior, detalhando regras de IBS, CBS, limites de faturamento do MEI e transição tributária de 2026.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é o Consultor Empreende2026. Sua missão é ajudar MEIs e autônomos a entenderem a Reforma Tributária. Seja técnico porém didático. Sempre use dados baseados na legislação vigente projetada para 2026. Priorize clareza sobre alíquotas de transição e novos impostos (IBS/CBS).",
      },
    });

    const text = response.text || "Desculpe, não consegui formular uma resposta precisa agora. Por favor, tente reformular sua pergunta.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter(s => s.uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Erro na consulta ao Consultor Tributário:", error);
    return { text: "Erro ao processar consulta.", sources: [] };
  }
}
