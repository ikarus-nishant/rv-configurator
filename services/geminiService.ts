import { GoogleGenAI } from "@google/genai";
import { ProductConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConfigurationAdvice = async (config: ProductConfig): Promise<string> => {
  const prompt = `
    You are an expert RV and travel trailer consultant. 
    The user has configured a luxury travel trailer with the following specs:
    - Model/Length: ${config.size}
    - Exterior Packages: ${config.exterior.length > 0 ? config.exterior.join(', ') : 'Standard'}
    - Interior Decor: ${config.interior.length > 0 ? config.interior.join(', ') : 'Standard'}
    - Shell Finish: ${config.material}

    Provide a short, adventurous, and premium description of this specific build (max 60 words). 
    Focus on where they could take this RV (e.g., "Perfect for coastal highways..." or "Ready for deep woods boondocking...").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "This configuration is ready for the open road.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to retrieve AI advice at this moment.";
  }
};