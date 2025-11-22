import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

export interface AIAnalysisResult {
    category: "Top" | "Bottom" | "Footwear";
    description: string;
    tags: string[];
}

export const generateClothingDetails = async (base64Image: string) => {
    try {
        const prompt = `Analyze this clothing image. Return JSON with category, description, tags.`;

        const result = await model.generateContent([
            prompt, {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanJson = text.replace(/```json|```/g, "").trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("GeminiAI Error", error);
        return null;
    }
}