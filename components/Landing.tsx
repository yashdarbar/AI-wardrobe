import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Shirt } from "lucide-react-native";
import { Link, useRouter } from "expo-router";

export default function Landing() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center w-full p-4">
            <View className="w-full max-w-md mb-20 p-2 items-center">
                <Shirt size={80} />
                <Text className="text-2xl font-bold my-2">AI wardrobe</Text>
                <Text className="text-md text-gray-500 text-center">
                    Digitize your entire wardrobe effortlessly by uploading
                    photos of your clothes
                </Text>
            </View>

            <View className="flex-col justify-center items-center w-4/5 gap-3">
                <Link href='/(tabs)/upload' asChild>
                    <TouchableOpacity
                        className="w-full justify-center items-center bg-primary border border-primary rounded-lg p-2"
                        // onPress={() => alert("clicked")}
                    >
                        <Text className="text-white">Get started</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity
                    className="w-full justify-center items-center bg-gray-300 border border-gray-300 rounded-lg p-2"
                    onPress={() => router.push('/update-profile')}
                >
                    <Text className="text-black">Update your profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
