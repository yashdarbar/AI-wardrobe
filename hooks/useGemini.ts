//hooks/useGemini.ts
import { useState } from "react";
import { generateClothingDetails, AIAnalysisResult } from "@/lib/gemini";
import { Alert } from "react-native";

export const useGemini = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const analyzeImage = async (
        base64Image: string
    ): Promise<AIAnalysisResult | null> => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await generateClothingDetails(base64Image);

            if (!result) {
                throw new Error("AI could not identify the clothing.");
            }

            return result;
        } catch (error: any) {
            const errorMessage = error.message || "Something went wrong";
            setError(errorMessage);
            Alert.alert("AI Analysis Failed", errorMessage);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return { analyzeImage, isAnalyzing, error };
};
