import React, { use, useId, useReducer, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // Using Feather for generic icons
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTS ---
import { GENDER_OPTIONS, BODY_TYPE_OPTIONS, FIT_PREFERENCE, STYLE_OPTIONS, COLOR_OPTIONS} from "@/constants/constants"
import { initialState, profileReducer } from "@/reducers/profileReducer";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function UpdateProfileModal() {
    const router = useRouter();
    const { session } = useAuthStore();

    const [state, dispatch] = useReducer(profileReducer, initialState);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const userId = session?.user.id;
            if (!userId) throw new Error("No user found");

            const updates = {
                username: state.username,
                avatar_url: state.website,
                gender: state.gender,
                body_type: state.bodyType,
                style_preferences: state.selectedStyles,
                fit_preference: state.fitPreference,
                preferred_colors: state.prefColors,
                updated_at: new Date(),
            };

            const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

            if (error) throw error;

            router.back()

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- REUSABLE OPTION COMPONENT (Based on your snippet) ---
    const OptionButton = ({ label, isSelected, onPress, isMulti = false } : any ) => (
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
                        value={state.username}
                        onChangeText={(text) => dispatch({ type: "SET_TEXT", field: "username", value: text})}
                        placeholder="Username"
                        className="text-base text-slate-800 px-2"
                    />
                </View>

                {/* Website Input */}
                <View className="bg-white rounded-xl border border-slate-200 p-2 mb-8 justify-center">
                    <TextInput
                        value={state.website}
                        onChangeText={(text) => dispatch({type: "SET_TEXT", field: "website", value: text})}
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
                            isSelected={state.gender === opt}
                            onPress={() => dispatch({ type: "SET_SINGLE", field: "gender", value: opt })}
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
                            isSelected={state.bodyType === opt}
                            onPress={() => dispatch({ type: "SET_SINGLE", field: "bodyType", value: opt})}
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
                            isSelected={state.fitPreference === opt}
                            onPress={() => dispatch({ type: "SET_SINGLE", field: "fitPreference", value: opt})}
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
                            isSelected={state.selectedStyles.includes(opt)}
                            onPress={() => dispatch({ type: "TOGGLE_STYLE", value: opt})}
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
                        const isSelected = state.prefColors.includes(c.name);
                        return (
                            <Pressable
                                key={c.name}
                                onPress={() => dispatch({ type: "TOGGLE_COLOR", value: c.name})}
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
