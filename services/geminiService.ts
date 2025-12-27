import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

const getApiKey = () => {
  const key = process.env.API_KEY;
  // Checking for 'undefined' string which sometimes happens in misconfigured build environments
  if (!key || key === 'undefined') {
    return 'AIzaSyDuc3LRQw68kyqeE_g2peE-MGGLjyp35GU';
  }
  return key;
};

/**
 * Helper to clean JSON string from potential markdown wrappers
 */
const cleanJson = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

/**
 * Lead Pharmacologist Logic for Medicine Details
 */
export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  const apiKey = getApiKey();
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Lead Pharmacologist at Manish Yadav MedCenter. 
      Task: Analyze the drug "${name}" for clinical information.
      Language Requirements: Respond strictly in ${lang === Language.HI ? 'Professional Hindi (Devanagari script)' : 'Technical Medical English'}.
      Note: Return only clinical facts in JSON format. Do not include introductory or concluding text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the medicine" },
            use: { type: Type.STRING, description: "Key clinical uses" },
            dosage: { type: Type.STRING, description: "Standard adult dosage" },
            sideEffects: { type: Type.STRING, description: "Common side effects" },
            composition: { type: Type.STRING, description: "Chemical or herbal composition" },
          },
          required: ["name", "use", "dosage", "sideEffects", "composition"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      console.warn("AI returned empty response for drug:", name);
      return null;
    }

    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText) as MedicineDetails;
  } catch (error) {
    console.error("AI Medicine Explorer Error Details:", error);
    return null;
  }
};

/**
 * Senior Medical Consultant Logic for Chat
 */
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
        systemInstruction: `You are Dr. Manish Yadav AI, Senior Medical Consultant.
        Tone: Professional, authoritative, yet compassionate.
        Language: Use ${lang === Language.HI ? 'proper Hindi' : 'medical English'}.
        Legal: Start or end responses involving specific medicine with "Based on AI analysis...". Recommend a physical visit to Manish Yadav MedCenter for critical diagnosis.`,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    return response.text || "Diagnostic stream unavailable.";
  } catch (error) {
    console.error("Medical Consultant Error Details:", error);
    return lang === Language.EN 
      ? "Connectivity issues with the medical database. Please try again." 
      : "मेडिकल डेटाबेस के साथ कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।";
  }
};