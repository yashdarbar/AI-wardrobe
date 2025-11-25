import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    UIManager,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Plus, X, Wand2, Save, Camera } from "lucide-react-native";

// Custom Hooks
import { useUpload } from "@/hooks/useUpload";
import { useGemini } from "@/hooks/useGemini";
import { useRouter } from "expo-router";

// Enable smooth animations on Android
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Upload() {
    // --- STATE ---
    const [clothingType, setClothingType] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const router = useRouter();

    // Controls whether the details form is visible
    const [formVisible, setFormVisible] = useState(false);

    // --- HOOKS ---
    // useUpload handles the "Logistics" (Picker + Supabase Upload)
    const { imageUri, imageBase64, pickImage, uploadItem, isUploading } =
        useUpload();

    // useGemini handles the "Intelligence" (Google AI Analysis)
    const { analyzeImage, isAnalyzing } = useGemini();

    const clothingOptions = ["top", "bottom", "footwear"];

    // --- HANDLERS ---

    // 1. Pick Image
    const handleImagePicked = async () => {
        await pickImage();
        // Reset form state when a new image is picked
        setFormVisible(false);
        setClothingType(null);
        setDescription("");
        setTags([]);
    };

    // 2. Generate AI Details
    const handleGenerate = async () => {
        if (!imageBase64) return;

        // Triggers the AI hook
        const result = await analyzeImage(imageBase64);

        if (result) {
            // Auto-fill state
            if (result.category && clothingOptions.includes(result.category)) {
                setClothingType(result.category);
            }
            if (result.description) setDescription(result.description);
            if (result.tags) setTags(result.tags);

            // Smoothly reveal the form
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            setFormVisible(true);
        }
    };

    // 3. Manual Fallback
    const handleManualEntry = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFormVisible(true);
    };

    // 4. Tag Logic
    const handleAddTag = () => {
        if (currentTag.trim().length > 0 && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag("");
        }
    };
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    // 5. Final Save
    const handleSave = async () => {
        if (isUploading) {
            return;
        }

        if (!clothingType) {
            Alert.alert(
                "Missing Category",
                "Please select a clothing category before saving your item."
            );
            return;
        }

        const uploadSuccessful = await uploadItem(
            clothingType,
            description,
            tags
        );

        if (uploadSuccessful) {
            Alert.alert("Success", "Item added to your wardrobe!");
            resetForm();
        }

        // if (clothingType) {
        // const uploadSuccessful = await uploadItem(clothingType, description, tags);

        // if (uploadSuccessful) {
        //     Alert.alert('Success', 'Item added to your wardrobe!');
        //     resetForm();
        // }
        // resetForm();
        // router.back();
        // }
    };

    const resetForm = () => {
        setClothingType(null);
        setDescription("");
        setTags([]);
        setCurrentTag("");

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFormVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex flex-row items-center bg-slate-50 p-4 pb-2 justify-between">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Feather name="arrow-left" size={24} color="#0e171b" />
                </Pressable>
                <Text className="text-[#0e171b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Upload
                </Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={[
                        {
                            paddingBottom: 150,
                            paddingTop: 20,
                            paddingHorizontal: 10,
                        },
                        !imageUri &&
                            !formVisible && {
                                paddingBottom: 20,
                                flexGrow: 1,
                                justifyContent: "center",
                            },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* --- SECTION 1: IMAGE PREVIEW --- */}
                    <View className="px-4 mb-6">
                        {imageUri ? (
                            <View className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-200 h-96">
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                {/* Change Photo Button */}
                                <Pressable
                                    onPress={handleImagePicked}
                                    className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full"
                                >
                                    <Text className="text-white font-semibold text-xs">
                                        Change
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={handleImagePicked}
                                className="h-80 border-2 border-dashed border-slate-300 rounded-2xl bg-white items-center justify-center gap-4 active:bg-slate-50"
                            >
                                <View className="h-16 w-16 bg-blue-50 rounded-full items-center justify-center">
                                    <Camera size={32} color="#3b82f6" />
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-slate-700">
                                        Upload Photo
                                    </Text>
                                    <Text className="text-slate-400 text-sm">
                                        Tap to select from gallery
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>

                    {/* --- SECTION 2: AI ACTION (Only if Image exists & Form Hidden) --- */}
                    {imageUri && !formVisible && (
                        <View className="px-4 gap-4">
                            <Pressable
                                onPress={handleGenerate}
                                disabled={isAnalyzing}
                                className="flex-row items-center justify-center bg-primary h-14 rounded-xl shadow-indigo-200 shadow-lg"
                            >
                                {isAnalyzing ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Wand2 size={20} color="white" />
                                        <Text className="text-white font-bold text-lg ml-2">
                                            Generate Details
                                        </Text>
                                    </>
                                )}
                            </Pressable>

                            <Pressable
                                onPress={handleManualEntry}
                                className="items-center py-2"
                            >
                                <Text className="text-slate-500 font-medium">
                                    Skip and fill manually
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {/* --- SECTION 3: DETAILS FORM (Revealed) --- */}
                    {formVisible && (
                        <View className="px-4 animate-fade-in-up">
                            {/* Category */}
                            <Text className="text-slate-900 text-lg font-bold mb-3">
                                Category
                            </Text>
                            <View className="flex-row gap-3 mb-6">
                                {clothingOptions.map((opt) => {
                                    const checked = clothingType === opt;
                                    return (
                                        <Pressable
                                            key={opt}
                                            onPress={() => setClothingType(opt)}
                                            className={`flex-1 h-12 justify-center items-center rounded-xl border ${
                                                checked
                                                    ? "bg-black border-black"
                                                    : "bg-white border-slate-200"
                                            }`}
                                        >
                                            <Text
                                                className={`font-semibold ${
                                                    checked
                                                        ? "text-white"
                                                        : "text-slate-600"
                                                }`}
                                            >
                                                {opt}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Description */}
                            <Text className="text-slate-900 text-lg font-bold mb-3">
                                Description
                            </Text>
                            <View className="bg-white rounded-xl border border-slate-200 p-2 mb-6">
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Enter description..."
                                    multiline
                                    className="text-base text-slate-800 min-h-[80px]"
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Tags */}
                            <Text className="text-slate-900 text-lg font-bold mb-3">
                                Tags
                            </Text>
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {tags.map((tag, index) => (
                                    <View
                                        key={index}
                                        className="flex-row items-center bg-gray-200 border border-gray-200 rounded-lg px-4 py-1.5"
                                    >
                                        <Text className="text-black font-medium mr-1">
                                            {tag}
                                        </Text>
                                        <Pressable
                                            onPress={() => handleRemoveTag(tag)}
                                        >
                                            <X size={14} color="#000000" />
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                            <View className="flex-row gap-2 mb-6">
                                <TextInput
                                    value={currentTag}
                                    onChangeText={setCurrentTag}
                                    placeholder="Add tag..."
                                    className="flex-1 h-12 bg-white border border-slate-200 rounded-xl px-4"
                                    onSubmitEditing={handleAddTag}
                                />
                                <Pressable
                                    onPress={handleAddTag}
                                    className="h-12 w-12 bg-slate-900 rounded-xl items-center justify-center"
                                >
                                    <Plus size={24} color="white" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Footer Button */}
            {formVisible && (
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg">
                    <Pressable
                        onPress={handleSave}
                        // disabled={isUploading || !clothingType}
                        className={`h-14 rounded-xl flex-row items-center justify-center gap-2 ${
                            isUploading || !clothingType
                                ? "bg-slate-300"
                                : "bg-green-600"
                        }`}
                    >
                        {isUploading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save size={20} color="white" />
                                <Text className="text-white text-lg font-bold">
                                    Save Item
                                </Text>
                            </>
                        )}
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
