//lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { encode } from "base64-arraybuffer";
// import * as FileSystem from "expo-file-system";

const API_KEY = "AIzaSyA1KCpMErEGPuSJ5rLN41LkxxRsq6gRGDM";
// const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
const ai = new GoogleGenAI({ apiKey: API_KEY });

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

export interface OutfitImages {
    top?: string;
    bottom?: string;
    footwear?: string;
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
        // console.log("TEXT", text);

        const cleanJson = text.replace(/```json|```/g, "").trim();
        // console.log("CJ", cleanJson);
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

export const generateGeminiTryOn = async (
    userImageBase64: string,
    clothes: OutfitImages
): Promise<string | null> => {
    try {
        console.log("Starting Multi-Item VTO with Gemini...");
        // console.log("gertmeat", userImageBase64);
        console.log("CLOTHS", clothes);

        let promptText = `Act as a professional fashion photo editor. I'm providing you with multiple images:\n\n`;
        promptText += `Image 1: A person (the MODAL)\n`;

        const parts: any[] = [];

        const cleanUserBase64 = userImageBase64.replace(
            /^data:image\/\w+;base64,/,
            ""
        );
        parts.push({
            inlineData: { mimeType: "image/jpeg", data: cleanUserBase64 },
        });

        let imageIndex = 2;

        if (clothes.top) {
            const topBase64 = await urlToBase64(clothes.top);
            if (topBase64) {
                parts.push({
                    inlineData: { mimeType: "image/jpeg", data: topBase64 },
                });
                promptText += `Image ${imageIndex}: TOP clothing item (shirt/jacket)\n`;
                imageIndex++;
            }
        }

        // if (clothes.bottom) {
        //     const bottomBase64 = await urlToBase64(clothes.bottom);
        //     if (bottomBase64) {
        //         parts.push({
        //             inlineData: { mimeType: "image/jpeg", data: bottomBase64 },
        //         });
        //         promptText += `Image ${imageIndex}: BOTTOM clothing item (pants/skirt)\n`;
        //         imageIndex++;
        //     }
        // }

        // if (clothes.footwear) {
        //     const footwearBase64 = await urlToBase64(clothes.footwear);
        //     if (footwearBase64) {
        //         parts.push({
        //             inlineData: {
        //                 mimeType: "image/jpeg",
        //                 data: footwearBase64,
        //             },
        //         });
        //         promptText += `Image ${imageIndex}: FOOTWEAR (shoes)\n`;
        //         imageIndex++;
        //     }
        // }

        promptText += `\nTASK: Generate a photorealistic image showing the MODEL (from Image 1) wearing ALL the clothing items provided in the subsequent images.

REQUIREMENTS:
- Keep the model's face, body shape, pose, and background EXACTLY the same
- Replace their current outfit with the new clothing items
- Ensure realistic fabric draping, proper fit, and natural shadows
- Maintain high image quality and photorealistic rendering
- The clothing should look natural on the person's body`;

        //     promptText += `
        //     TASK: Generate a photorealistic image of the MODEL (Image 1) wearing these specific clothing items.
        // - Replace the model's current clothes with the provided items.
        // - Keep the model's pose, face, body shape, and background EXACTLY the same.
        // - Ensure high quality and realistic fabric draping.`;

        parts.unshift({ text: promptText });

        // console.log("Parts", parts);

        // const result = await model.generateContent({
        //     contents: [{ role: "user", parts: parts }],
        // });

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-image-preview",
            // contents: parts,
            contents: [{ role: "user", parts}],
        })

        // const response = await result.response;
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            console.error("No candidates returned");
            return null
        }

        const content = candidates[0].content;

        const partsResponse = content?.parts;
        const imagePart = partsResponse?.find((part: any) => part.inlineData || part.inline_data);
        // console.log("imagePPPPaarrt", imagePart);

        if (imagePart) {
            const data = imagePart.inlineData?.data;
            if (data) {
                return `data:image/png;base64,${data}`;
            }
        }

        console.log("No image generated in response");
        return null;

    } catch (error) {
        console.error("Multi-VTO Error:", error);
        return null;
    }
};

async function urlToBase64(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer(); // Get raw bytes
        return encode(buffer); // Convert to Base64 using your library
    } catch (err) {
        console.error("Fetch Error:", err);
        return null;
    }
}
