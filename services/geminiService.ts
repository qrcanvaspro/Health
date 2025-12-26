
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

/**
 * Lead Pharmacologist Logic for Medicine Details
 */
export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Critical: API_KEY is missing.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Lead Pharmacologist at Manish Yadav MedCenter. 
      Analyze the following drug: "${name}".
      Language: Respond in ${lang === Language.HI ? 'Professional Hindi (Devanagari script)' : 'Technical Medical English'}.
      Note: Provide clinical facts only. Return a valid JSON matching the schema.`,
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

/**
 * Senior Medical Consultant Logic for Chat
 */
export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API key missing. Clinical connection failed.";

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
        Tone: Professional, clinical, yet helpful.
        Language: ${lang === Language.HI ? 'Devanagari Hindi' : 'Advanced Medical English'}.
        Medical Advice: Always qualify advice with "Based on AI analysis" and suggest visiting Manish Yadav MedCenter for critical care.`,
      }
    });

    return response.text || "Diagnostic data missing from stream.";
  } catch (error) {
    console.error("Consultation Error:", error);
    return "The clinical AI network is experiencing latency. Please try again.";
  }
};
