import { Stack } from "expo-router";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack initialRouteName="index">
                <Stack.Screen
                    name="(tabs)"
                    options={{ title: "Wardrobe", headerShown: false }}
                />
                <Stack.Screen
                    name="index"
                    options={{ title: "Home", headerShown: false }}
                />
                <Stack.Screen
                    name="update-profile"
                    options={{
                        presentation: 'modal',
                        headerShown: false,
                    }}
                />
                {/* <Stack.Screen name="pairChat" options={{ title: "Pair Chat", headerShown: false }} /> */}
                {/* <Stack.Screen name="pairCollection" options={{ title: "Pair Collection", headerShown: false }} /> */}
            </Stack>
        </QueryClientProvider>
    );
}

// import { Stack } from "expo-router";
// import "./globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { ActivityIndicator, View } from "react-native";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//     const { setSession, isLoaded, setIsLoaded } = useAuthStore();

//     useEffect(() => {
//         supabase.auth.getSession().then(({ data: { session } }) => {
//             setSession(session);
//             setIsLoaded(true);
//         });

//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//         });

//         return () => subscription.unsubscribe();
//     }, []);

//     if (!isLoaded) {
//         return (
//             <View className="flex-1 justify-center items-center">
//                 <ActivityIndicator size="large" color="#33A6E3" />
//             </View>
//         );
//     }

//     return (
//         <QueryClientProvider client={queryClient}>
//             <Stack screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="index" />
//                 <Stack.Screen name="(tabs)" />
//             </Stack>
//         </QueryClientProvider>
//     );
// }

// import { Stack, useRouter, useSegments } from "expo-router";
// import "./globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { ActivityIndicator, View } from "react-native";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//     const { session, setSession, isLoaded, setIsLoaded } = useAuthStore();
//     const segments = useSegments() as string[];
//     const router = useRouter();
//     const [isNavReady, setIsNavReady] = useState(false);

//     useEffect(() => {
//         supabase.auth.getSession().then(({ data: { session } }) => {
//             setSession(session);
//             setIsLoaded(true);
//         });

//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//         });

//         return () => subscription.unsubscribe();
//     }, []);

//     useEffect(() => {
//         setIsNavReady(true);
//     }, []);

//     useEffect(() => {
//         if (!isLoaded || !isNavReady) return;

//         const inTabsGroup = segments[0] === "(tabs)";
//         const isIndex = segments.length === 0 || segments[0] === "index";

//         if (session) {
//             if (isIndex) {
//                 router.replace("/(tabs)/collection");
//             }
//         } else if (!session) {
//             if (inTabsGroup) {
//                 router.replace("/");
//             }
//         }
//     }, [session, segments, isLoaded, isNavReady]);

//     if (!isLoaded || !isNavReady) {
//         return (
//             <View
//                 style={{
//                     flex: 1,
//                     justifyContent: "center",
//                     alignItems: "center",
//                 }}
//             >
//                 <ActivityIndicator size="large" color="#33A6E3" />
//             </View>
//         );
//     }

//     return (
//         <QueryClientProvider client={queryClient}>
//             <Stack screenOptions={{headerShown: false}}>
//                 <Stack.Screen name="index"/>
//                 <Stack.Screen name="(tabs)"/>
//             </Stack>
//         </QueryClientProvider>
//     )
// }
