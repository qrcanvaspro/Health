
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

/* Initializing with process.env.API_KEY directly as required by guidelines */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  try {
    /* Fetching medicine details using gemini-3-flash-preview for structured output */
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed information about the medicine "${name}" in ${lang === Language.HI ? 'Hindi' : 'English'}.`,
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

    /* Directly accessing .text property of the GenerateContentResponse as per SDK best practices */
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as MedicineDetails;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, text: string}[], lang: Language) => {
  try {
    /* Using gemini-3-pro-preview for complex medical reasoning tasks */
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are a professional health expert. Address the person you are chatting with as "User". 
        Respond in ${lang === Language.HI ? 'Hindi' : 'English'}.
        Be polite, accurate, and always suggest consulting a real doctor for serious issues.
        The app name is Manish Yadav Health. Never use the name "Manish Yadav" for the person you are talking to; always use "User" or "Aap" (in Hindi).`,
      }
    });

    /* Returning the generated text content directly using the .text property */
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Chat Error:", error);
    return "Something went wrong. Please try again later.";
  }
};
