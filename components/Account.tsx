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
    <View>
        <Text >{label}</Text>
        <TextInput
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
    // const [website, setWebsite] = useState("");
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
                .select(`username, avatar_url`)
                .eq("id", session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
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
        avatar_url,
    }: {
        username: string;
        avatar_url: string;
    }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            // console.log("Yashhh", session?.user.id);

            const updates = {
                id: session?.user.id,
                username,
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
        <View>

            {/* Username Input */}
            <LabeledInput
                label="Username"
                value={username || ""}
                onChangeText={setUsername}
            />
            <Text>User ka name: {username}</Text>

            {/* Update Button (Pressable) */}
            <Pressable
                style={({ pressed }) => [
                    { opacity: pressed || loading ? 0.6 : 1 },
                ]}
                className="m-5 bg-gray-500 text-white"
                onPress={() =>
                    updateProfile({ username, avatar_url: avatarUrl })
                }
                disabled={loading}
            >
                <Text>
                    {loading ? "Loading ..." : "Update"}
                </Text>
            </Pressable>

            {/* Sign Out Button (Pressable) */}
            <Pressable
                // style={({ pressed }) => [
                    // { opacity: pressed ? 0.8 : 1 },
                // ]}
                onPress={() => supabase.auth.signOut()}
            >
                <Text>Sign Out</Text>
            </Pressable>
        </View>
    );
}

