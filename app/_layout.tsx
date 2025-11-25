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
                {/* <Stack.Screen name="pairChat" options={{ title: "Pair Chat", headerShown: false }} /> */}
                {/* <Stack.Screen name="pairCollection" options={{ title: "Pair Collection", headerShown: false }} /> */}
            </Stack>
        </QueryClientProvider>
    );
}
