//lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface AIAnalysisResult {
    category: "Top" | "Bottom" | "Footwear";
    description: string;
    tags: string[];
}

export interface OutfitSuggestion {
    ai_description: string;
    occasion: string;
    selected_item_ids: string[];
}

export const generateOutfitRecommendation = async (
    userQuery: string,
    wardrobeContext: any[]
): Promise<OutfitSuggestion | null> => {
    try {
        const prompt = `You are a personal fashion stylist.
        User Request: "${userQuery}"

        Here is the user's AVAILABLE WARDROBE (JSON):
        ${JSON.stringify(wardrobeContext)}

        TASK:
        1. Select the best combination of items from the wardrobe to create an outfit.
        2. You MUST use the exact 'id' provided in the JSON.
        3. Return STRICT JSON (no markdown) with this structure:
        {
            "ai_description": "Brief, friendly advice on why this works.",
            "occasion": "One word category (e.g. Party, Work, Date)",
            "selected_item_ids": ["uuid-1", "uuid-2"]
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("TEXT", text);

        const cleanJson = text.replace(/```json|```/g, "").trim();
        console.log("CJ", cleanJson);
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Outfit Error:", error);
        return null;
    }
};

export const generateClothingDetails = async (base64Image: string) => {
    try {
        const prompt = `Analyze this clothing image. Return JSON with category, description, tags.`;

        const result = await model.generateContent([
            prompt,
            {
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
};
