import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="(tabs)" options={{ title: "Wardrobe", headerShown: false }} />
            <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
            {/* <Stack.Screen name="pairChat" options={{ title: "Pair Chat", headerShown: false }} /> */}
            {/* <Stack.Screen name="pairCollection" options={{ title: "Pair Collection", headerShown: false }} /> */}
        </Stack>
    );
}
