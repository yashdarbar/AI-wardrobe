import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="upload" options={{ title: "Upload", headerShown: false }} />
            <Tabs.Screen name="collection" options={{ title: "Collection", headerShown: false }} />
            <Tabs.Screen name="pairChat" options={{ title: "Pair Chat", headerShown: false }} />
            <Tabs.Screen name="pairCollection" options={{ title: "Pair Collection", headerShown: false }} />
        </Tabs>
    );
}