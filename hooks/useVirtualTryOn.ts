import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ClothingItem } from "./useWardrobe";
import { generateGeminiTryOn } from "@/lib/gemini";

export const useVirtualTryOn = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [resultImage, setResultImage] = useState<string | null>(null);

    const [userPhotoBase64, setUserPhotoBase64] = useState<string | null>(null);
    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);

    const pickUserImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: false,
            quality: 0.7,
            base64: true,
        });


        if (!result.canceled && result.assets[0].base64) {
            const asset = result.assets[0];

            // console.log("RR", result.assets[0].assetId);
            setUserPhotoUri(asset.uri);

            if (asset.base64) {
                setUserPhotoBase64(asset.base64);
            }
        }
    };

    const startTryOn = async (outfitItems: ClothingItem[]) => {
        if (!userPhotoBase64) return;

        setIsProcessing(true);
        setStatusMessage("AI is styling your full outfit...");
        setResultImage(null);

        try {
            const topItem = outfitItems.find(
                (i) => i.type.toLowerCase() === "top"
            );
            const bottomItem = outfitItems.find(
                (i) => i.type.toLowerCase() === "bottom"
            );
            const footwearItem = outfitItems.find(
                (i) =>
                    i.type.toLowerCase() === "footwear" ||
                    i.type.toLowerCase() === "shoes"
            );

            const clothesPayload = {
                top: topItem?.image_url,
                bottom: bottomItem?.image_url,
                footwear: footwearItem?.image_url,
            };

            // console.log("UP", userPhotoBase64);
            // console.log("CP", clothesPayload);

            const generateBase64 = await generateGeminiTryOn(
                userPhotoBase64,
                clothesPayload
            );

            // console.log("RESTs", generateBase64)

            if (generateBase64) {
                setResultImage(generateBase64);
            } else {
                throw new Error("Generation returned no image");
            }
        } catch (error) {
            console.error(error);
            setStatusMessage("Failed to create outfit. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const resetTryOn = () => {
        setResultImage(null);
        setUserPhotoBase64(null);
        setUserPhotoUri(null);
        setStatusMessage("");
    };

    return {
        pickUserImage,
        userPhotoUri,
        startTryOn,
        isProcessing,
        statusMessage,
        resultImage,
        resetTryOn,
    };
};
