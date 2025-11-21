import { View } from "react-native";
import "./globals.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Account from "@/components/Account";
import Auth from "@/components/Auth";
import Landing from "@/components/Landing";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Index() {
    const { session, setSession, isLoaded, setIsLoaded } = useAuthStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoaded(true);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-white">
            {/*
          <Link href="/(tabs)" asChild>
              <TouchableOpacity className="bg-black px-6 py-3 rounded-2xl">
                  <Text className="text-white font-semibold">
                      Start Exploring
                  </Text>
              </TouchableOpacity>
          </Link> */}
            {session && session.user ? (
                <Landing />
            ) : (
                // <Account key={session.user.id} session={session} />
                <Auth />
            )}
        </View>
    );
}
