
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Critical: API Key is missing. Check your environment variables or vite.config.ts.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide complete and accurate medical details for "${name}" in ${lang === Language.HI ? 'Hindi' : 'English'}. Include scientific composition and common side effects. Format the output as a valid JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            use: { type: Type.STRING },
            dosage: { type: Type.STRING },
            sideEffects: { type: Type.STRING },
            composition: { type: Type.STRING },
          },
          required: ["name", "use", "dosage", "sideEffects", "composition"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      console.warn("No text returned from Gemini API");
      return null;
    }
    return JSON.parse(text) as MedicineDetails;
  } catch (error) {
    console.error("AI Medicine Explorer Error:", error);
    return null;
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API configuration error. Please set the API_KEY.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the premium health assistant for "Manish Yadav Health". 
        Address the user as "User" or "Aap". 
        Language: ${lang === Language.HI ? 'Hindi' : 'English'}.
        Provide expert, empathetic advice. 
        Always include a disclaimer that this is AI-generated advice and they should consult a doctor.`,
      }
    });

    return response.text || "I'm sorry, I encountered an issue processing your request.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "The system is currently busy or configured incorrectly. Please check the API key.";
  }
};
