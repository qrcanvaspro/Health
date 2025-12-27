import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export interface ServiceResponse {
  data: MedicineDetails | null;
  error?: string;
  isKeyError?: boolean;
}

const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
};

export const getMedicineDetails = async (name: string, lang: Language): Promise<ServiceResponse> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    return { data: null, error: "API Key not selected. Please click the key icon to select a key.", isKeyError: true };
  }

  try {
    // Create instance right before call as per guidelines
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pharmacologist report for: "${name}". Language: ${lang === Language.HI ? 'Hindi' : 'English'}. Return valid JSON: {name, use, dosage, sideEffects, composition}.`,
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
    if (!text) return { data: null, error: "Empty response from AI." };
    
    const cleaned = cleanJsonResponse(text);
    const parsed = JSON.parse(cleaned) as MedicineDetails;
    return { data: parsed };
  } catch (error: any) {
    console.error("Clinical Search Error:", error);
    const msg = error.message || "";
    // FIX: Included "Requested entity was not found." to trigger key selection reset as per guidelines
    const isLeaked = msg.includes("leaked") || msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("Requested entity was not found.");
    return { 
      data: null, 
      error: isLeaked ? "API Key has been revoked, leaked, or not found. Please select a new valid key." : msg,
      isKeyError: isLeaked
    };
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key error. Please select a key.";

  try {
    // Create instance right before call as per guidelines
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `Senior Consultant mode. Language: ${lang === Language.HI ? 'Hindi' : 'English'}.`,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || "Error generating response.";
  } catch (error: any) {
    return `System Error: ${error.message}`;
  }
};