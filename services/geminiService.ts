import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export interface ServiceResponse {
  data: MedicineDetails | null;
  error?: string;
}

const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key || key === 'undefined' || key === '') {
    // This is a common public fallback, but users should ideally provide their own.
    return 'AIzaSyDuc3LRQw68kyqeE_g2peE-MGGLjyp35GU';
  }
  return key;
};

const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown formatting if the model ignored system instructions
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
};

export const getMedicineDetails = async (name: string, lang: Language): Promise<ServiceResponse> => {
  const apiKey = getApiKey();
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional pharmacologist. Analyze the medicine "${name}" and provide clinical data. 
      Language: ${lang === Language.HI ? 'Hindi' : 'English'}.
      Return a valid JSON object with these keys: name, use, dosage, sideEffects, composition.`,
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
        }
      }
    });

    const text = response.text;
    if (!text) return { data: null, error: "Empty AI response" };
    
    const cleaned = cleanJsonResponse(text);
    const parsed = JSON.parse(cleaned) as MedicineDetails;
    return { data: parsed };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    let errorMsg = error.message || "Unknown Connection Error";
    if (errorMsg.includes("API_KEY_INVALID")) errorMsg = "API Key Invalid - Please update settings.";
    if (errorMsg.includes("SAFETY")) errorMsg = "Restricted content - AI cannot provide details for this drug.";
    return { data: null, error: errorMsg };
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  const apiKey = getApiKey();
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are Dr. Manish Yadav AI. Provide medical insights in ${lang === Language.HI ? 'Hindi' : 'English'}.`,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || "No response.";
  } catch (error: any) {
    return `Error: ${error.message || "Consultation failed"}`;
  }
};