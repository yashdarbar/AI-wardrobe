import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import {
    ScrollView,
    View,
    Text,
    Pressable,
    TextInput,
    StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Plus } from "lucide-react-native";

/**
 * UploadScreen - Pixel-faithful conversion of the provided HTML into
 * React Native + Expo + NativeWind classes.
 */
export default function Upload() {
    const [clothingType, setClothingType] = useState(null); // "Top" | "Bottom" | "Footwear"
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const clothingOptions = ["Top", "Bottom", "Footwear"];

    function handleUploadPress() {
        // placeholder upload action
        setIsUploading(true);
        setTimeout(() => setIsUploading(false), 1000);
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* <StatusBar barStyle={"light-content"}/> */}
            <View className="flex flex-row items-center bg-slate-50 p-4 pb-2 justify-between">
                <Pressable className="w-10 h-10 items-center justify-center">
                    <Feather name="arrow-left" size={24} color="#0e171b" />
                </Pressable>

                <Text className="text-[#0e171b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Upload
                </Text>

                {/* spacer so title centers */}
                <View className="w-10" />
            </View>
            <ScrollView
                contentContainerStyle={{
                    minHeight: "100%",
                    flexGrow: 1,
                    paddingBottom: 150,
                    // marginBottom: 80,
                }}
                showsVerticalScrollIndicator={false}
                className="min-h-screen"
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-between">
                    {/* Header */}
                    <View>
                        <Text className="text-[#0e171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-5">
                            Clothing Type
                        </Text>

                        {/* Radio options */}
                        <View className="flex flex-row flex-wrap gap-3 p-3">
                            {clothingOptions.map((opt) => {
                                const checked = clothingType === opt;
                                return (
                                    <Pressable
                                        key={opt}
                                        onPress={() => setClothingType(opt)}
                                        className={`text-sm font-medium leading-normal flex items-center justify-center rounded-lg border px-4 h-10 ${
                                            checked
                                                ? "border-[#30abe8] border-[3px] px-3.5"
                                                : "border-[#d0dfe7]"
                                        }`}
                                        style={{ minWidth: 90 }}
                                    >
                                        <Text
                                            className={`text-[#0e171b] ${
                                                checked ? "font-bold" : ""
                                            }`}
                                        >
                                            {opt}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Upload Image Title */}
                        <Text className="text-[#0e171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-5">
                            Upload Image
                        </Text>

                        {/* Upload Area */}
                        <View className="flex flex-col p-4">
                            <View className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#d0dfe7] px-6 py-14">
                                <View className="flex max-w-[480px] flex-col items-center gap-2">
                                    <Text className="text-[#0e171b] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                                        Upload Image
                                    </Text>
                                    <Text className="text-[#0e171b] text-sm font-normal leading-normal max-w-[480px] text-center">
                                        Upload an image of your clothing item
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={() => {
                                        /* TODO: open image picker */
                                        console.log("Upload tapped");
                                    }}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-300"
                                >
                                    <Text className="text-[#0e171b] text-sm font-bold">
                                        Upload
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <Text className="text-[#0e171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-5">
                            Tags
                        </Text>

                        <View className="flex flex-row flex-wrap gap-3 p-3">
                            <Pressable className="flex justify-center items-center border border-[#d0dfe7] rounded-lg text-sm font-medium leading-normal px-4 h-10">
                                <Text>Tshirt</Text>
                            </Pressable>
                            <Pressable className="flex justify-center items-center border border-[#d0dfe7] rounded-lg text-sm font-medium leading-normal px-4 h-10">
                                <Text>Baggy</Text>
                            </Pressable>
                            <Pressable className="flex justify-center items-center border border-[#d0dfe7] rounded-lg text-sm font-medium leading-normal px-4 h-10">
                                <Text>
                                    <Plus size={18} />
                                </Text>
                            </Pressable>
                        </View>

                        {/* Description */}
                        <Text className="text-[#0e171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-5">
                            Description
                        </Text>

                        <View className="flex px-4 pb-4">
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Add a description (optional)"
                                placeholderTextColor="#4e7f97"
                                className="flex w-full resize-none rounded-lg text-[#0e171b] border border-[#d0dfe7] bg-white p-4 text-base font-normal"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                style={{ minHeight: 120 }}
                            />
                        </View>
                        {/* <View className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <View className="flex flex-col min-w-40 flex-1 w-full">
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Description (optional)"
                                    placeholderTextColor="#4e7f97"
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e171b] border border-[#d0dfe7] bg-slate-50 p-4 text-base font-normal"
                                    multiline
                                    numberOfLines={5}
                                />
                            </View>
                        </View> */}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom area */}
            {/* Floating Bottom Button - Above Tab Bar */}
            <View
                className="absolute bottom-0 left-0 right-0 px-4 py-2"
                // style={{
                //     // shadowColor: "#000",
                //     shadowOffset: { width: 0, height: -2 },
                //     // shadowOpacity: 0.1,
                //     shadowRadius: 8,
                //     elevation: 5,
                // }}
            >
                <Pressable
                    onPress={handleUploadPress}
                    disabled={isUploading}
                    className={`flex items-center justify-center rounded-lg h-12 px-5 ${
                        isUploading ? "bg-[#30abe8]/70" : "bg-[#30abe8]"
                    }`}
                >
                    <Text className="text-white text-base font-bold">
                        {isUploading ? "Uploading..." : "Upload"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
