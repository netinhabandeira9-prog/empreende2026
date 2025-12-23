import { GoogleGenAI } from "@google/genai";

export async function getTaxAdvice(userContext: string) {
  // Always initialize with named parameter and ensure apiKey is from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Using gemini-3-pro-preview for complex text tasks requiring advanced reasoning about legislation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Você é um consultor tributário especialista em Brasil. O ano atual é 2026. 
      Ajude o usuário com esta dúvida: ${userContext}. 
      Seja específico sobre as regras do IBS, CBS e limites do MEI vigentes em 2026.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Forneça respostas precisas e sempre cite fontes se houver mudanças recentes na legislação de 2026.",
      },
    });

    // Access the .text property directly to get the generated content
    const text = response.text;
    
    // Extract grounding URLs from groundingMetadata as required when using search tools
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter(s => s.uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return { 
      text: "Desculpe, tive um problema ao processar sua consulta tributária. Tente novamente em instantes.",
      sources: []
    };
  }
}