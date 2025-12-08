//hooks/useUpload.ts
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/stores/useAuthStore";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";

export const useUpload = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const userId = useAuthStore((state) => state.session?.user.id);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [9, 16],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 ?? null);
        }
    };

    const uploadItem = async (
        category: string,
        description: string,
        tags: string[]
    ) => {
        if (!imageBase64 || !userId) return;

        setIsUploading(true);
        try {
            const fileName = `${userId}/${Date.now()}.png`;

            const { error: uploadError } = await supabase.storage
                .from("wardrobe")
                .upload(fileName, decode(imageBase64), {
                    contentType: "image/png",
                });

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from("wardrobe").getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from("clothing_items")
                .insert({
                    user_id: userId,
                    image_url: publicUrl,
                    storage_path: fileName,
                    type: category,
                    description: description,
                    tags: tags,
                });

            if (dbError) throw dbError;

            // Alert.alert("Success", "Item added to your wardrobe!");
            resetState();
            return true;
        } catch (error: any) {
            console.error(error);
            Alert.alert("Upload Failed", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const resetState = () => {
        setImageUri(null);
        setImageBase64(null);
    };

    return {
        pickImage,
        uploadItem,
        imageUri,
        imageBase64,
        isUploading,
    };
};
