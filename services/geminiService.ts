import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

const getApiKey = () => {
  // Check multiple sources for the key to ensure it works on Netlify
  const key = process.env.API_KEY;
  if (!key || key === 'undefined' || key === '') {
    // Immediate fallback for testing
    return 'AIzaSyDuc3LRQw68kyqeE_g2peE-MGGLjyp35GU';
  }
  return key;
};

const cleanJsonResponse = (text: string): string => {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  const apiKey = getApiKey();
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Lead Pharmacologist at Manish Yadav MedCenter. 
      Analyze the drug: "${name}". 
      Respond strictly in ${lang === Language.HI ? 'Hindi (Devanagari script)' : 'Medical English'}. 
      Provide ONLY a JSON object with keys: name, use, dosage, sideEffects, composition. No markdown, no extra text.`,
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
    if (!text) return null;
    
    const cleaned = cleanJsonResponse(text);
    return JSON.parse(cleaned) as MedicineDetails;
  } catch (error) {
    console.error("Clinical Search Error:", error);
    return null;
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
        systemInstruction: `You are Dr. Manish Yadav AI, Senior Medical Consultant. Tone: Professional. Language: ${lang === Language.HI ? 'Hindi' : 'English'}.`,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return lang === Language.HI ? "कनेक्शन एरर। कृपया दोबारा प्रयास करें।" : "Connection Error. Please try again.";
  }
};