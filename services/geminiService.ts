import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

// Safety helper to get API Key
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
};

export const getMedicineDetails = async (name: string, lang: Language): Promise<{ data: MedicineDetails | null; error?: string; isKeyError?: boolean }> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return { data: null, error: "API Key not found. Please select a key using the icon.", isKeyError: true };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Report for medicine: "${name}". Lang: ${lang === Language.HI ? 'Hindi' : 'English'}. Return JSON: {name, use, dosage, sideEffects, composition}.`,
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
    if (!text) return { data: null, error: "Empty response." };
    
    const cleaned = cleanJsonResponse(text);
    return { data: JSON.parse(cleaned) as MedicineDetails };
  } catch (error: any) {
    const msg = error.message || "";
    const isKeyError = msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("not found");
    return { data: null, error: msg, isKeyError };
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key error.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `Senior Consultant mode. Lang: ${lang === Language.HI ? 'Hindi' : 'English'}.`,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || "Error.";
  } catch (error: any) {
    return `System Error: ${error.message}`;
  }
};