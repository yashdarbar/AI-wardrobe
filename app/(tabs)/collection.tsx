import { useWardrobe, ClothingItem } from "@/hooks/useWardrobe";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Collection() {
    const router = useRouter();
    const [filterType, setFilterType] = useState<string | null>("All");

    const filters = ["All", "Bottom", "Top", "Footwear"];

    const {
        data: wardrobe,
        isLoading,
        error,
        refetch,
    } = useWardrobe(filterType);

    // console.log("DATA", wardrobe)

    const renderItem = ({ item }: { item: ClothingItem }) => {

        return (<Pressable
            key={item.id}
            className="flex-1 m-1.5 overflow-hidden rounded-lg bg-white shadow-sm"
            style={{ width: 150, height: 255, aspectRatio: 1 / 1.5 }}
        >
            <Image
                source={{ uri: item.image_url }}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                resizeMode="cover"
            />
        </Pressable>);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex flex-row justify-between bg-slate-50 p-4 pb-2 items-center">
                <View className="w-10" />
                <Text className="text-lg text-center font-bold leading-tight tracking-[-0.015em]">
                    Collection
                </Text>
                <Pressable
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.push("/upload")}
                >
                    <Plus size={24} />
                </Pressable>
            </View>

            {/* Filter */}
            <View className="flex-row flex-wrap gap-2 mb-3 mt-2 px-4">
                {filters.map((opt) => {
                    const checked = filterType === opt;
                    return (
                        <Pressable
                            key={opt}
                            onPress={() => setFilterType(opt)}
                            className={`flex-row items-center border rounded-lg px-4 py-1.5 ${
                                checked
                                    ? "bg-black border-black"
                                    : "border-gray-200 bg-gray-200"
                            }`}
                        >
                            <Text
                                className={`font-medium mr-1 ${
                                    checked ? "text-white" : "text-black"
                                }`}
                            >
                                {opt}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {isLoading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#000000"/>
                    <Text className="mt-4 text-slate-600">Loading your wardrobe...</Text>
                </View>
            )}

            {error && (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 font-bold">Error: {error.message}</Text>
                    <Text className="mt-2 text-slate-500">Could not fetch your item.</Text>
                </View>
            )}

            {!isLoading && !error && (
                <FlatList
                    data={wardrobe}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10, flexGrow: 1}}
                    columnWrapperStyle={{ justifyContent: 'space-between'}}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center pt-20">
                            <Text className="text-lg text-slate-500">Wardrobe is empty!</Text>
                            <Text className="text-slate-400 mt-2">Time to upload your first item. 👆</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
