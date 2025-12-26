
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Consultant at Manish Yadav MedCenter. Analyze the drug: "${name}".
      LANGUAGE: Respond ENTIRELY in ${lang === Language.HI ? 'Pure Hindi (Devanagari script)' : 'Clinical English'}.
      FORMAT: Valid JSON. Use professional medical terminology.`,
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
    console.error("Clinical Search Error:", error);
    return null;
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  if (!process.env.API_KEY) return "Service offline.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the Lead Medical Consultant at "Manish Yadav MedCenter". 
        TONE: Clinical, empathetic, highly professional.
        LANGUAGE: If Hindi mode is active, use ONLY formal Hindi (Devanagari). No Hinglish.
        STYLE: Structure your reply like a medical consultation report with headers like [Medical Assessment] and [Advisory Notes].
        IMPORTANT: Mention clearly that physical examination is necessary.`,
      }
    });

    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("AI Consultant Error:", error);
    return "Clinical database currently unreachable.";
  }
};
