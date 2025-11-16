import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import "./globals.css";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Account from "@/components/Account";
import Auth from "@/components/Auth";

export default function Index() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold mb-4">
                👕 AI Wardrobe Assistant
            </Text>
            {/* <Text className="text-gray-500 mb-8">Organize. Style. Try-on.</Text>

          <Link href="/(tabs)" asChild>
              <TouchableOpacity className="bg-black px-6 py-3 rounded-2xl">
                  <Text className="text-white font-semibold">
                      Start Exploring
                  </Text>
              </TouchableOpacity>
          </Link> */}
            {session && session.user ? (
                <Account key={session.user.id} session={session} />
            ) : (
                <Auth />
            )}
        </View>
    );
}
