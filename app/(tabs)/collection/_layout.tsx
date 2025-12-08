import { Stack } from "expo-router";

export default function CollectionStack() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false, title: "Collection" }}
            />
            <Stack.Screen name="[id]" options={{ title: "Item Details" }} />
        </Stack>
    );
}
