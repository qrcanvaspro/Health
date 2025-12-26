
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Critical: API Key is missing.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Clinical Pharmacist at Manish Yadav MedCenter. Provide exhaustive clinical data for "${name}". 
      LANGUAGE REQUIREMENT: Respond ONLY in ${lang === Language.HI ? 'Pure Formal Hindi (Devanagari script)' : 'Formal Medical English'}. 
      STRICTLY FORBIDDEN: Do not use mixed "Hinglish" or English words in Hindi text unless it's a specific scientific unit.
      Format the output as a valid JSON object.`,
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API configuration error.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the Lead Medical Consultant at "Manish Yadav MedCenter". 
        TONE: Highly professional, clinical, and reassuring. 
        LANGUAGE POLICY: 
        1. If language is Hindi: Use ONLY Pure Formal Hindi. No English words or sentences. Use Devanagari script. 
        2. If language is English: Use Professional Medical English.
        STRUCTURE: Use professional formatting with clear sections like [Consultation Summary], [Recommendations], and [Precautionary Advice].
        DISCLAIMER: Always emphasize that this is AI support and a physical doctor visit is essential.`,
      }
    });

    return response.text || "I apologize, but I am unable to process your request at this time.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "The system is currently undergoing maintenance. Please try again later.";
  }
};
