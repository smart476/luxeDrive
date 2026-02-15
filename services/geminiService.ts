
import { GoogleGenAI } from "@google/genai";
import { Car } from '../types';

export const getSmartCarDescription = async (car: Car): Promise<string> => {
  try {
    // Initialized GoogleGenAI with the required configuration object and process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a compelling 3-sentence rental advertisement for a ${car.year} ${car.brand} ${car.model}. 
    Highlight its ${car.fuelType} engine and ${car.transmission} transmission. Make it sound luxury and premium.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Accessing .text property directly from GenerateContentResponse as per guidelines.
    return response.text || car.description;
  } catch (error) {
    console.error("Gemini Error:", error);
    return car.description;
  }
};

export const getAIAssistantResponse = async (query: string): Promise<string> => {
  try {
    // Initialized GoogleGenAI with the required configuration object and process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful car rental assistant for LuxeDrive. Answer this user query professionally: ${query}`,
    });
    // Accessing .text property directly from GenerateContentResponse as per guidelines.
    return response.text || "I'm sorry, I couldn't process that right now.";
  } catch (error) {
    return "Our AI concierge is currently unavailable. Please contact support.";
  }
};
