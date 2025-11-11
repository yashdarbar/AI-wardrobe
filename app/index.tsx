import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import "./globals.css";

export default function Index() {
  return (
      <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-2xl font-bold mb-4">
              👕 AI Wardrobe Assistant
          </Text>
          <Text className="text-gray-500 mb-8">Organize. Style. Try-on.</Text>

          <Link href="/(tabs)" asChild>
              <TouchableOpacity className="bg-black px-6 py-3 rounded-2xl">
                  <Text className="text-white font-semibold">
                      Start Exploring
                  </Text>
              </TouchableOpacity>
          </Link>
      </View>
  );
}
