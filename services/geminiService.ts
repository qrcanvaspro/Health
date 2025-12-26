
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MedicineDetails, Language } from "../types";

export const getMedicineDetails = async (name: string, lang: Language): Promise<MedicineDetails | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing in environment.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Lead Pharmacologist at Manish Yadav MedCenter. Provide a complete analysis for the drug: "${name}".
      LANGUAGE: Respond ONLY in ${lang === Language.HI ? 'Pure Professional Hindi (Devanagari script)' : 'Formal Clinical English'}.
      IMPORTANT: If Hindi is selected, do not use English words. Use formal medical Hindi terms.
      Return the data strictly in valid JSON format.`,
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
  if (!process.env.API_KEY) return "Service disconnected.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the Chief Medical Consultant at "Manish Yadav MedCenter". 
        TONE: Authoritative, empathetic, and clinical.
        LANGUAGE REQUIREMENT: 
        1. If mode is Hindi: Use ONLY professional Hindi (Devanagari). No Hinglish. 
        2. If mode is English: Use Advanced Clinical English.
        FORMATTING: Structure your response like a formal medical report with [Medical Summary] and [Clinical Advice].
        MANDATORY: Always mention that this is AI support and a physical consultation with Manish Yadav MedCenter is advised.`,
      }
    });

    return response.text || "Consultation report failed to generate.";
    // Fixed: Changed opening parenthesis '(' to curly brace '{' to correctly define catch block scope
  } catch (error) {
    console.error("Consultant Error:", error);
    return "The clinical network is currently busy. Please try again.";
  }
};
