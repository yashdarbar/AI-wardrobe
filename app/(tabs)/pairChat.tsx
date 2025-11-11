import { View, Text } from "react-native";
import { Camera, Heart, Clock } from "lucide-react-native";

export default function PairChat() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}
        >
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
                Lucide Icons Example
            </Text>

            {/* Camera icon */}
            <Camera size={48} color="#000" strokeWidth={2} />
            <Clock size={48} color="blue" strokeWidth={2} />

            {/* Heart icon */}
            <Heart
                size={48}
                color="red"
                strokeWidth={2}
                style={{ marginTop: 20 }}
            />
        </View>
    );
}