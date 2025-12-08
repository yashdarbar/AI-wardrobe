import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// --- Mock Data: Separated into User Question vs AI Response ---
const MOCK_MESSAGES = [
    {
        id: "1",
        sender: "user",
        text: "I have a casual party, what can I wear?",
        isOutfit: false,
    },
    {
        id: "2",
        sender: "ai",
        text: "I found this great combination for you!",
        isOutfit: true,
        outfitData: {
            topImage:
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
            bottomImage:
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
        },
    },
];

const AVATAR_URL = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

export default function PairChat() {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const router = useRouter();

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                sender: "user",
                text: inputText,
                isOutfit: false,
            };
            // Add new message to the list
            setMessages([...messages, newMessage]);
            setInputText("");
        }
    };

    const renderMessage = ({ item }) => {
        // --- USER MESSAGE (Right Side) ---
        if (item.sender === "user") {
            return (
                <View className="flex-row justify-end mb-4">
                    <View className="bg-[#33A6E3] p-3 rounded-2xl rounded-br-sm max-w-[80%]">
                        <Text className="text-white text-[15px]">
                            {item.text}
                        </Text>
                    </View>
                </View>
            );
        }

        // --- AI MESSAGE (Left Side) ---
        return (
            <View className="flex-row mb-6 items-start">
                {/* Avatar */}
                <View className="mr-3 mt-1">
                    <Image
                        source={{ uri: AVATAR_URL }}
                        className="w-9 h-9 rounded-full border border-gray-200"
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-xs text-slate-600 mb-1 font-semibold">
                        AI Assistant
                    </Text>

                    {/* AI Text Bubble */}
                    <View className="bg-[#E8F1F5] p-3 rounded-xl rounded-tl-sm mb-3 self-start">
                        <Text className="text-gray-800 text-[15px]">
                            {item.text}
                        </Text>
                    </View>

                    {/* Outfit Suggestion Card */}
                    {item.isOutfit && (
                        <View className="w-full">
                            {/* Stacked Images */}
                            <View className="rounded-2xl overflow-hidden mb-3">
                                <Image
                                    source={{ uri: item.outfitData.topImage }}
                                    className="w-full h-[200px]"
                                    resizeMode="cover"
                                />
                                <Image
                                    source={{
                                        uri: item.outfitData.bottomImage,
                                    }}
                                    className="w-full h-[180px] -mt-1"
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row justify-between gap-3 mb-3">
                                <TouchableOpacity className="flex-1 bg-[#E8F1F5] py-3 rounded-lg items-center">
                                    <Text className="text-black font-semibold text-sm">
                                        Save Pair
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-[#E8F1F5] py-3 rounded-lg items-center">
                                    <Text className="text-black font-semibold text-sm">
                                        Regenerate
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Main Button */}
                            <TouchableOpacity className="bg-[#33A6E3] py-3.5 rounded-lg items-center w-full">
                                <Text className="text-white font-bold text-base">
                                    Try on Me
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={()=> router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black">PairChat</Text>
                <View className="w-6" />
            </View>

            {/* Chat List (Inverted for natural chat behavior) */}
            <FlatList
                inverted
                data={[...messages].reverse()} // Reverse data so newest is at the bottom
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                }}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <View className="px-4 py-3 bg-white border-t border-gray-100">
                    <TextInput
                        className="bg-[#E8F1F5] px-4 py-3.5 rounded-xl text-base text-gray-800"
                        placeholder="Ask me anything..."
                        placeholderTextColor="#888"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
