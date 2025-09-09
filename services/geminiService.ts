import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, the GoogleGenAI client must be initialized with process.env.API_KEY.
// The deployment environment is expected to provide this variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFosisAnswer = async (prompt: string): Promise<string> => {
  // Although the guidelines assume the API key is always present, this check
  // provides a better user experience than a generic error if it's missing.
  if (!process.env.API_KEY) {
    return "Error: La clave de API de Gemini no está configurada. Por favor, contacte al administrador del sistema.";
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: `Eres un asistente experto en el FOSIS (Fondo de Solidaridad e Inversión Social) de Chile. Tu rol es responder preguntas de manera clara, concisa y precisa sobre los procesos, programas, normativas y gestión de proyectos del FOSIS. Basa tus respuestas únicamente en el conocimiento público y oficial del FOSIS. Si no sabes una respuesta, indica que no tienes la información. Sé siempre profesional y servicial.`
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al procesar tu consulta. Por favor, inténtalo de nuevo más tarde.";
  }
};
