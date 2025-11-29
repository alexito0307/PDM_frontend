import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useState } from "react";

export default function Feed() {
  const { avatarUrl } = useAuthStore();
  const [post, setPost] = useState('');
  const defaultAvatar = "https://preview.redd.it/high-resolution-remakes-of-the-old-default-youtube-avatar-v0-bgwxf7bec4ob1.png?width=640&crop=smart&auto=webp&s=99d5fec405e0c7fc05f94c1e1754f7dc29ccadbd"
  return (
    <SafeAreaView
      className="flex px-5"
    >
      <View className="mt-4 flex-row justify-between">
        <Text className="text-4xl font-bold mr-4">Nuevo Post</Text>
        <TouchableOpacity
          className={`p-2 px-8 flex-row justify-center items-center bg-[#1B5BA5] rounded-md`}
        >
          <Text className="text-white font-bold justify-end">Post</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mt-4">
        <Image
          source={{ uri: avatarUrl || defaultAvatar }}
          className="w-14 h-14 rounded-full mr-4 border"
        />
        <TextInput
          className="flex-1 text-xl"
          placeholder="Cuenta en que piensas..."
          multiline
          textAlignVertical="top"
          value={post}
          onChangeText={setPost}
        >
        </TextInput>
      </View>
    </SafeAreaView>
  );
}
