import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    View,
    AppState,
    Text,
    TextInput,
    Pressable,
} from "react-native";
import { supabase } from "../lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground.
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

// Helper component for styled text input
const LabeledInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
}) => (
    <View className="mb-4 w-4/5">
        <Text className="text-base font-semibold text-gray-700 mb-1">{label}</Text>
        <TextInput
            className="border border-gray-300 rounded-lg p-3 h-12 w-full text-base bg-white px-4"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            autoCapitalize={"none"}
            // You can add leftIcon functionality here by wrapping TextInput in a View and using an Icon component
        />
    </View>
);

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session)
            Alert.alert("Please check your inbox for email verification!");
        setLoading(false);
    }

    return (
        <View className="flex-1 flex-col  items-center justify-center bground p-4 w-full">
            <View className="flex-col justify-center items-center mb-10">
                <Text className="text-3xl font-bold">
                    {isSignUp ? "Create Account" : "Welcome"}
                </Text>
                <Text className="text-md text-gray-500 p-1">
                    {isSignUp
                        ? "Sign up to continue"
                        : "Log in to your AI Wardrobe"}
                </Text>
            </View>
            {/* Email Input */}
            <LabeledInput
                label="Email"
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
            />

            {/* Password Input */}
            <LabeledInput
                label="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
            />

            <View className="flex-col w-4/5 py-1 justify-center items-center">
                <Pressable
                    style={({ pressed }) => [
                        { opacity: pressed || loading ? 0.6 : 1 },
                    ]}
                    className="p-2 w-full justify-center items-center bg-primary border border-primary rounded-lg"
                    onPress={isSignUp ? signInWithEmail : signUpWithEmail}
                    disabled={loading}
                >
                    <Text className="text-white">
                        {loading ? "Loading ..." : isSignUp ? "Sign Up" : "Sign In"}
                    </Text>
                </Pressable>

                {/* Sign Up Button */}
                {/* <Pressable
                    style={({ pressed }) => [
                        { opacity: pressed || loading ? 0.6 : 1 },
                    ]}
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    <Text>{loading ? "Loading ..." : "Sign up"}</Text>
                </Pressable> */}
            </View>
            <Text className="text-md text-gray-500 py-2 mt-3">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Text className="text-primary font-semibold underline"
                onPress={() => setIsSignUp((prev)=> !prev)}
                >{isSignUp ? "Sign In" : "Sign Up"}</Text>
            </Text>
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         marginTop: 40,
//         paddingHorizontal: 20,
//     },
//     // --- Input Styles ---
//     inputContainer: {
//         paddingVertical: 8,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: "bold",
//         marginBottom: 4,
//         color: "#333",
//     },
//     input: {
//         height: 44,
//         borderColor: "#ccc",
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         fontSize: 16,
//         backgroundColor: "#fff",
//     },
//     // --- Button Styles ---
//     button: {
//         height: 48,
//         borderRadius: 8,
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 15,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: "600",
//         // color: "#fff",
//         color: "#111",
//     },
//     primaryButton: {
//         backgroundColor: "#007bff", // Blue for primary action (Sign In)
//     },
//     secondaryButton: {
//         backgroundColor: "#6c757d", // Gray for secondary action (Sign Up)
//     },
//     // --- Spacing ---
//     mt20: {
//         marginTop: 20,
//     },
// });
