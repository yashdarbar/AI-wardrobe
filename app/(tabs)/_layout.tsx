import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import { List, Plus, Shirt, Upload, WandSparkles } from "lucide-react-native";

const ACTIVE_COLOR = "#010001";
const INACTIVE_COLOR = "#99a1af";

const TabIcon = ({ focused, name, IconComponenet }: any) => {
    const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

    return (
        <View className="flex flex-col items-center justify-center w-20 pt-2 min-h-16">
            <View className="mt-2">
                <IconComponenet size={20} color={color} />
            </View>
            <Text
                className={`text-sm mt-0.5 font-semibold text-center ${
                    focused ? "text-black" : "text-gray-400"
                }`}
            >
                {name}
            </Text>
        </View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "white",
                    marginBottom: 0,
                },
            }}
        >
            <Tabs.Screen
                name="upload"
                options={{
                    title: "Upload",
                    headerShown: false,
                    tabBarStyle: {
                        // marginBottom: 10
                        // height: 80
                        // width: 20
                    },
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            name="Upload"
                            IconComponenet={Plus}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="collection"
                options={{
                    title: "Collection",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            name="Collection"
                            IconComponenet={List}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="pairChat"
                options={{
                    title: "Pair Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            name="PairChat"
                            IconComponenet={WandSparkles}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="pairCollection"
                options={{
                    title: "Pair Collection",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            name="Paris"
                            IconComponenet={Shirt}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
