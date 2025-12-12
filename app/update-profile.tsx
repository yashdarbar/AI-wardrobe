import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Using Feather for generic icons
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTS ---
import { GENDER_OPTIONS, BODY_TYPE_OPTIONS, FIT_PREFERENCE, STYLE_OPTIONS, COLOR_OPTIONS} from "@/constants/constants"

export default function UpdateProfileModal() {
    const router = useRouter();

    // --- STATE ---
    const [username, setUsername] = useState("Jane Doe");
    const [website, setWebsite] = useState("");
    const [gender, setGender] = useState(null);
    const [bodyType, setBodyType] = useState(null);
    const [fitPreference, setFitPreference] = useState(null);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [prefColors, setPrefColors] = useState([]);

    // --- HANDLERS ---
    const toggleStyle = (style) => {
        if (selectedStyles.includes(style)) {
            setSelectedStyles(selectedStyles.filter((s) => s !== style));
        } else {
            setSelectedStyles([...selectedStyles, style]);
        }
    };

    const toggleColor = (colorName) => {
        if (prefColors.includes(colorName)) {
            setPrefColors(prefColors.filter((c) => c !== colorName));
        } else {
            setPrefColors([...prefColors, colorName]);
        }
    };

    const handleSave = () => {
        console.log({
            gender,
            bodyType,
            fitPreference,
            selectedStyles,
            prefColors,
        });
        router.back();
    };

    // --- REUSABLE OPTION COMPONENT (Based on your snippet) ---
    const OptionButton = ({ label, isSelected, onPress, isMulti = false }) => (
        <Pressable
            onPress={onPress}
            className={`justify-center items-center rounded-xl border mb-2 ${
                isMulti ? "px-4 py-2 mr-2" : "flex-1 h-12 mr-2"
            } ${
                isSelected
                    ? "bg-black border-black"
                    : "bg-white border-slate-200"
            }`}
        >
            <Text
                className={`font-semibold ${
                    isSelected ? "text-white" : "text-slate-600"
                }`}
            >
                {label}
            </Text>
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* HEADER */}
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-100">
                <Pressable onPress={() => router.back()}>
                    <Text className="text-slate-500 text-base">Cancel</Text>
                </Pressable>
                <Text className="text-slate-900 text-lg font-bold">
                    Edit Profile
                </Text>
                <Pressable onPress={handleSave}>
                    <Text className="text-blue-600 text-base font-bold">
                        Save
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                className="px-4 py-6"
                showsVerticalScrollIndicator={false}
            >
                {/* --- SECTION 1: BASIC INFO --- */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Personal Details
                </Text>

                {/* Username Input */}
                <View className="bg-white rounded-xl border border-slate-200 p-2 mb-4 justify-center">
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                        className="text-base text-slate-800 px-2"
                    />
                </View>

                {/* Website Input */}
                <View className="bg-white rounded-xl border border-slate-200 p-2 mb-8 justify-center">
                    <TextInput
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="Website"
                        className="text-base text-slate-800 px-2"
                    />
                </View>

                {/* --- SECTION 2: STYLE DNA --- */}

                {/* Gender */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Gender
                </Text>
                <View className="flex-row flex-wrap mb-6">
                    {GENDER_OPTIONS.map((opt) => (
                        <OptionButton
                            key={opt}
                            label={opt}
                            isSelected={gender === opt}
                            onPress={() => setGender(opt)}
                            isMulti={true} // Using multi-style for layout, but logic is single
                        />
                    ))}
                </View>

                {/* Body Type */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Body Type
                </Text>
                <View className="flex-row mb-6">
                    {BODY_TYPE_OPTIONS.map((opt) => (
                        <OptionButton
                            key={opt}
                            label={opt}
                            isSelected={bodyType === opt}
                            onPress={() => setBodyType(opt)}
                        />
                    ))}
                </View>

                {/* Fit Preference */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Fit Preference
                </Text>
                <View className="flex-row mb-6">
                    {FIT_PREFERENCE.map((opt) => (
                        <OptionButton
                            key={opt}
                            label={opt}
                            isSelected={fitPreference === opt}
                            onPress={() => setFitPreference(opt)}
                        />
                    ))}
                </View>

                {/* Style Vibe (Multi Select) */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Style Vibe
                </Text>
                <View className="flex-row flex-wrap mb-6">
                    {STYLE_OPTIONS.map((opt) => (
                        <OptionButton
                            key={opt}
                            label={opt}
                            isSelected={selectedStyles.includes(opt)}
                            onPress={() => toggleStyle(opt)}
                            isMulti={true}
                        />
                    ))}
                </View>

                {/* Preferred Colors (Circular Swatches) */}
                <Text className="text-slate-900 text-lg font-bold mb-3">
                    Preferred Colors
                </Text>
                <View className="flex-row flex-wrap gap-3 mb-10">
                    {COLOR_OPTIONS.map((c) => {
                        const isSelected = prefColors.includes(c.name);
                        return (
                            <Pressable
                                key={c.name}
                                onPress={() => toggleColor(c.name)}
                                className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                                    isSelected
                                        ? "border-slate-900"
                                        : "border-slate-100"
                                }`}
                                style={{ backgroundColor: c.hex }}
                            >
                                {isSelected && (
                                    <Feather
                                        name="check"
                                        size={20}
                                        color={
                                            c.name === "White" ||
                                            c.name === "Beige"
                                                ? "black"
                                                : "white"
                                        }
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Bottom Spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
