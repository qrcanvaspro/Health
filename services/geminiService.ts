
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing in environment.");
    return null;
  }

  try {
    // Correct initialization: Always use a named parameter { apiKey: process.env.API_KEY }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Lead Pharmacologist at Manish Yadav MedCenter. 
      TASK: Provide a comprehensive clinical analysis for the drug: "${name}".
      LANGUAGE: Respond ENTIRELY in ${lang === Language.HI ? 'Pure Professional Hindi (Devanagari script)' : 'Professional Medical English'}.
      IMPORTANT: If Hindi, do not use Hinglish. Use technical medical Hindi terms.
      FORMAT: Response must be a valid JSON object matching the requested schema.`,
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
    if (!text) return null;
    return JSON.parse(text) as MedicineDetails;
  } catch (error) {
    console.error("Clinical Database Error:", error);
    return null;
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  if (!process.env.API_KEY) return "Service disconnected.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the Senior Medical Consultant at Manish Yadav MedCenter.
        TONE: Clinical, expert, and reassuring.
        LANGUAGE: 
        1. Hindi mode: Use pure professional Hindi (Devanagari).
        2. English mode: Use advanced clinical English.
        STRUCTURE: Include headers like [Consultant Summary] and [Clinical Advice].
        DISCLAIMER: Always emphasize that this is AI support and a physical visit to Manish Yadav MedCenter is recommended.`,
      }
    });

    return response.text || "Diagnostic stream interrupted. Please retry.";
  } catch (error) {
    console.error("AI Consultation Error:", error);
    return "The clinical AI network is currently busy. Please try again.";
  }
};
