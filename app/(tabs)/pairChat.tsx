import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Hooks
import { ClothingItem, useWardrobe } from "@/hooks/useWardrobe";
import { usePairChat, ChatMessage } from "@/hooks/usePairChat";
import { useVirtualTryOn } from "@/hooks/useVirtualTryOn";

const AVATAR_URL = "https://i.pravatar.cc/150?u=ai-wardrobe-bot";

export default function PairChat() {
    const [inputText, setInputText] = useState("");

    // 1. Fetch Wardrobe Data (The Context)
    const { data: wardrobe } = useWardrobe("All");

    // 2. Initialize Chat Logic
    const { messages, isThinking, sendMessage } = usePairChat(wardrobe || []);

    const {
        pickUserImage,
        startTryOn,
        userPhotoUri,
        isProcessing,
        statusMessage,
        resultImage,
        resetTryOn,
    } = useVirtualTryOn();

    const [isModalVisible, setModalVisible] = useState(false);
    const [activeOutfitItems, setActiveOutfitItems] = useState<ClothingItem[]>(
        []
    );

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText("");
        }
    };

    const handleTryOnClick = (items: ClothingItem[]) => {
        setActiveOutfitItems(items);
        setModalVisible(true);
    };

    const closeTryOnModal = () => {
        setModalVisible(false);
        resetTryOn();
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        // --- USER MESSAGE ---
        if (item.sender === "user") {
            return (
                <View className="flex-row justify-end mb-4 px-4">
                    <View className="bg-[#33A6E3] p-3 rounded-2xl rounded-br-sm max-w-[80%]">
                        <Text className="text-white text-[15px]">
                            {item.text}
                        </Text>
                    </View>
                </View>
            );
        }

        // --- AI MESSAGE ---
        return (
            <View className="flex-row mb-6 items-start px-4">
                {/* Avatar */}
                <View className="mr-3 mt-1">
                    <Image
                        source={{ uri: AVATAR_URL }}
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-xs text-slate-500 mb-1 font-bold">
                        Stylist AI
                    </Text>

                    {/* Text Bubble */}
                    <View className="bg-[#F0F2F5] p-3 rounded-xl rounded-tl-sm mb-3 self-start">
                        <Text className="text-gray-800 text-[15px] leading-5">
                            {item.text}
                        </Text>
                    </View>

                    {/* OUTFIT CARD (If Gemini found clothes) */}
                    {item.isOutfit && item.outfitItems && (
                        <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-[280px]">
                            {/* Header */}
                            {item.occasion && (
                                <View className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {item.occasion}
                                    </Text>
                                </View>
                            )}

                            {/* Images Grid */}
                            <View className="flex-row flex-wrap">
                                {item.outfitItems.map((cloth, index) => (
                                    <Image
                                        key={cloth.id}
                                        source={{ uri: cloth.image_url }}
                                        className={`h-40 flex-1 ${
                                            index === 0 ? "mr-0.5" : "ml-0.5"
                                        }`}
                                        resizeMode="cover"
                                    />
                                ))}
                            </View>

                            {/* Actions */}
                            <View className="p-3 gap-2">
                                <TouchableOpacity
                                    className="bg-[#33A6E3] py-2.5 rounded-lg items-center"
                                    onPress={() =>
                                        handleTryOnClick(item.outfitItems!)
                                    }
                                >
                                    <Text className="text-white font-bold text-sm">
                                        Try on Me
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gray-100 py-2.5 rounded-lg items-center"
                                    onPress={() =>
                                        alert("Save Feature coming in Phase 3!")
                                    }
                                >
                                    <Text className="text-gray-700 font-semibold text-sm">
                                        Save Outfit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-center p-4 p-3 border-b border-gray-100">
                <Text className="text-lg font-bold text-slate-800">
                    PairChat
                </Text>
                {/* <Ionicons name="sparkles-outline" size={20} color="#33A6E3" /> */}
            </View>

            {/* Input Area */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                {/* Chat List */}
                <FlatList
                    inverted
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                />

                <View className="px-4 py-3 mb-3 bg-white border-t border-gray-50">
                    <View className="flex-row items-center gap-2">
                        <TextInput
                            className="flex-1 bg-gray-100 px-4 py-3 rounded-full text-base text-gray-800"
                            placeholder={
                                isThinking
                                    ? "Consulting Stylist..."
                                    : "Ask for an outfit..."
                            }
                            placeholderTextColor="#94A3B8"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSend}
                            editable={!isThinking}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={isThinking || !inputText.trim()}
                            className={`w-11 h-11 rounded-full items-center justify-center ${
                                isThinking || !inputText.trim()
                                    ? "bg-gray-200"
                                    : "bg-[#33A6E3]"
                            }`}
                        >
                            {isThinking ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Ionicons name="send" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* --- VTO MODAL --- */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1 bg-white p-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">
                            Virtual Try-On
                        </Text>
                        <TouchableOpacity onPress={closeTryOnModal}>
                            <Ionicons
                                name="close-circle"
                                size={30}
                                color="#E2E8F0"
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 items-center justify-center">
                        {/* State 3: Result */}
                        {resultImage ? (
                            <View className="w-full h-full items-center">
                                <Image
                                    source={{ uri: resultImage }}
                                    className="w-full h-[65%] rounded-2xl mb-6 bg-gray-50"
                                    resizeMode="contain"
                                />
                                <Text className="text-green-600 font-bold text-lg mb-4">
                                    ✨ Outfit Generated!
                                </Text>
                                <TouchableOpacity
                                    className="bg-black w-full py-4 rounded-xl items-center"
                                    onPress={() =>
                                        alert("Save Feature coming in Phase 3!")
                                    }
                                >
                                    <Text className="text-white font-bold text-lg">
                                        Save to Collection
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="mt-4"
                                    onPress={resetTryOn} // Try again
                                >
                                    <Text className="text-gray-500 font-semibold">
                                        Try Different Photo
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            /* State 1 & 2: Upload & Processing */
                            <View className="w-full items-center">
                                {/* Photo Preview Box */}
                                <View className="w-64 h-80 bg-gray-50 rounded-2xl mb-8 items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
                                    {userPhotoUri ? (
                                        <Image
                                            source={{ uri: userPhotoUri }}
                                            // className="w-full h-full"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View className="items-center opacity-40">
                                            <Ionicons
                                                name="person"
                                                size={60}
                                                color="#94A3B8"
                                            />
                                            <Text className="text-gray-500 font-medium mt-3">
                                                No Photo Selected
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Status / Loading */}
                                {isProcessing ? (
                                    <View className="items-center mb-8">
                                        <ActivityIndicator
                                            size="large"
                                            color="#33A6E3"
                                        />
                                        <Text className="text-[#33A6E3] font-semibold mt-4 text-center">
                                            {statusMessage ||
                                                "Generating your look..."}
                                        </Text>
                                    </View>
                                ) : (
                                    /* Action Buttons */
                                    <View className="w-full gap-3">
                                        {!userPhotoUri ? (
                                            <TouchableOpacity
                                                className="bg-black w-full py-4 rounded-xl items-center flex-row justify-center gap-2"
                                                onPress={pickUserImage}
                                            >
                                                <Ionicons
                                                    name="image-outline"
                                                    size={20}
                                                    color="#fff"
                                                />
                                                <Text className="text-white font-bold text-lg">
                                                    Upload Full Body Photo
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                className="bg-[#33A6E3] w-full py-4 rounded-xl items-center"
                                                onPress={() =>
                                                    startTryOn(
                                                        activeOutfitItems
                                                    )
                                                }
                                            >
                                                <Text className="text-white font-bold text-lg">
                                                    Generate Try-On
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
