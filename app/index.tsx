import { ActivityIndicator, View } from "react-native";
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

    if (!isLoaded)
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
            </View>
        );

    return (
        <View className="flex-1 items-center justify-center bg-white">
            {session && session.user ? (
                <Landing />
            ) : (
                // <Account key={session.user.id} session={session} />
                <Auth />
            )}
        </View>
    );
}

// import { View } from "react-native";
// import "./globals.css";
// import { useEffect } from "react";
// import { useRouter } from "expo-router";
// import Auth from "@/components/Auth";
// import { useAuthStore } from "@/stores/useAuthStore";

// export default function Index() {
//     const { session } = useAuthStore();
//     const router = useRouter();

//     useEffect(() => {
//         if (session) {
//             router.replace("/(tabs)/collection");
//         }
//     }, [session]);

//     return (
//         <View className="flex-1 items-center justify-center bg-white">
//             <Auth />
//         </View>
//     );
// }
