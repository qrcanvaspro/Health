
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  // Use process.env.API_KEY directly to initialize GoogleGenAI as per coding guidelines
  if (!process.env.API_KEY) {
    console.error("Critical: API Key is missing. Check your environment variables.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Pharmacologist at Manish Yadav MedCenter. Analyze the following medicine: "${name}".
      LANGUAGE: Provide the entire analysis ONLY in ${lang === Language.HI ? 'Pure Professional Hindi (Devanagari script)' : 'Scientific Medical English'}.
      IMPORTANT: If the language is Hindi, do NOT use English characters or words. Use the official Hindi medical terminology.
      Respond strictly in JSON format.`,
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
    console.error("AI Medicine Explorer Error:", error);
    return null;
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  // Use process.env.API_KEY directly to initialize GoogleGenAI as per coding guidelines
  if (!process.env.API_KEY) return "Critical System Error: Configuration Missing.";

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
        TONE: Highly clinical, professional, authoritative, and helpful.
        LANGUAGE REQUIREMENT: 
        1. If user preference is Hindi: Respond ENTIRELY in Pure Professional Hindi (Devanagari). No English mixing (Hinglish). 
        2. If user preference is English: Use Advanced Clinical English.
        FORMATTING: Use structured reports with headings like [Diagnosis Overview], [Professional Guidance], and [Next Steps].
        MANDATORY: Address the user respectfully. Always emphasize clinical consultation is required.`,
      }
    });

    return response.text || "Consultation error: No data returned.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "The clinical database is currently unreachable. Please try again shortly.";
  }
};
