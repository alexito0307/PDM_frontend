import { View, Text, TextInput, Pressable, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useRouter, Redirect } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-black px-4 w-full">
      <Text className="text-white text-lg mb-2">Tester Build</Text>
      <Image
        source={require("../../../assets/cheicon-logo.png")}
        className="w-full h-36 mb-8 self-center"
      />
      <Text className="text-2xl font-bold mb-6 text-white">Login</Text>
      <TouchableOpacity
        className="bg-white rounded-full py-2 px-4"
        onPress={() => router.push("/screens/feed")}
      >
        <Text className="text-black">Go to Feed</Text>
      </TouchableOpacity>
    </View>
  );
}
