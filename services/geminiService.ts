import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getFileBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeInterviewVideo = async (file: File): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert file to base64
  const base64Data = await getFileBase64(file);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type, // e.g., 'video/mp4'
              data: base64Data
            }
          },
          {
            text: "Analyze this interview response based on the system instructions."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.4, // Lower temperature for more analytical/objective output
      }
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedResponse = JSON.parse(response.text) as AnalysisResponse;
    return parsedResponse;

  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};