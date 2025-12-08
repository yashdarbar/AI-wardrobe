import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function ItemDetails() {
    // 1. Get the ID passed in the URL (e.g., /collection/123)
    const { id } = useLocalSearchParams();

    // 2. Fetch specific item details from Supabase
    const {
        data: item,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["clothing_item", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("clothing_items")
                .select("*")
                .eq("id", id)
                .single(); // We expect only one item

            if (error) throw error;
            return data;
        },
        enabled: !!id, // Only fetch if ID exists
    });

    if (isLoading)
        return (
            <View className="flex-1 justify-center">
                <ActivityIndicator />
            </View>
        );
    if (error || !item)
        return (
            <View className="flex-1 justify-center">
                <Text>Error loading item</Text>
            </View>
        );

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            edges={["bottom", "left", "right"]}
        >
            {/* Set Header Title Dynamically */}
            <Stack.Screen
                options={{
                    title: "AI Analysis",
                    // title: item.type ? item.type.toUpperCase() : "Details",
                    headerTitleAlign: "center",
                    // headerShadowVisible: false,
                }}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 40,
                    // backgroundColor: "red",
                }}
            >
                <View className="p-4">
                    <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-96 rounded-xl"
                        resizeMode="cover"
                    />

                    <Text className="text-2xl font-bold mt-4 text-slate-900 capitalize">
                        {item.type}
                    </Text>

                    {/* Tags */}
                    <View className="flex-row flex-wrap gap-2 mt-2">
                        {item.tags?.map((tag: string, index: number) => (
                            <View
                                key={index}
                                className="bg-gray-100 px-3 py-1 rounded-full"
                            >
                                <Text className="text-slate-600 text-sm">
                                    #{tag}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text className="text-base text-slate-600 mt-4 leading-6">
                        {item.description || "No description provided."}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
