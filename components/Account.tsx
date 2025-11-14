import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
    StyleSheet,
    View,
    Alert,
    Text,
    TextInput,
    Pressable,
    Platform,
} from "react-native";
import { Session } from "@supabase/supabase-js";

// Helper component for styled text input
const LabeledInput = ({ label, value, onChangeText, disabled = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
            placeholder={disabled ? "" : `Enter ${label.toLowerCase()}`}
            autoCapitalize="none"
        />
    </View>
);

export default function Account({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    // useEffect and getProfile remain identical
    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, website, avatar_url`)
                .eq("id", session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // updateProfile remains identical
    async function updateProfile({
        username,
        website,
        avatar_url,
    }: {
        username: string;
        website: string;
        avatar_url: string;
    }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const updates = {
                id: session?.user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
            Alert.alert(
                "Profile Updated!",
                "Your profile information has been saved."
            );
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* Email (Disabled Input) */}
            <LabeledInput label="Email" value={session?.user?.email} disabled />

            {/* Username Input */}
            <LabeledInput
                label="Username"
                value={username || ""}
                onChangeText={setUsername}
            />

            {/* Website Input */}
            <LabeledInput
                label="Website"
                value={website || ""}
                onChangeText={setWebsite}
            />

            {/* Update Button (Pressable) */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.updateButton,
                    { opacity: pressed || loading ? 0.6 : 1 },
                ]}
                onPress={() =>
                    updateProfile({ username, website, avatar_url: avatarUrl })
                }
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Loading ..." : "Update"}
                </Text>
            </Pressable>

            {/* Sign Out Button (Pressable) */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.signOutButton,
                    { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => supabase.auth.signOut()}
            >
                <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 20, // Adjusted padding for better fit
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
        color: "#fff",
    },
    updateButton: {
        backgroundColor: "#007bff", // Standard blue color
        marginBottom: 8,
    },
    signOutButton: {
        backgroundColor: "#f8f8f8", // Light gray background
        borderColor: "#ccc",
        borderWidth: 1,
    },
    signOutText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#dc3545", // Red text color
    },
});
