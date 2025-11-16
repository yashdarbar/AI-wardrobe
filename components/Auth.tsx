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
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
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
        <View style={styles.container}>
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

            {/* Sign In Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.primaryButton,
                    styles.mt20,
                    { opacity: pressed || loading ? 0.6 : 1 },
                ]}
                onPress={signInWithEmail}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Loading ..." : "Sign in"}
                </Text>
            </Pressable>

            {/* Sign Up Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.secondaryButton,
                    { opacity: pressed || loading ? 0.6 : 1 },
                ]}
                onPress={signUpWithEmail}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Loading ..." : "Sign up"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    // --- Input Styles ---
    inputContainer: {
        paddingVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    input: {
        height: 44,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    // --- Button Styles ---
    button: {
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        // color: "#fff",
        color: "#111",
    },
    primaryButton: {
        backgroundColor: "#007bff", // Blue for primary action (Sign In)
    },
    secondaryButton: {
        backgroundColor: "#6c757d", // Gray for secondary action (Sign Up)
    },
    // --- Spacing ---
    mt20: {
        marginTop: 20,
    },
});
