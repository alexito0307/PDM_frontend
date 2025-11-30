import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, TextInput, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function Feed() {
  const { avatarUrl, token } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const defaultAvatar = "https://preview.redd.it/high-resolution-remakes-of-the-old-default-youtube-avatar-v0-bgwxf7bec4ob1.png?width=640&crop=smart&auto=webp&s=99d5fec405e0c7fc05f94c1e1754f7dc29ccadbd";
  const [imageUri, setImageUri] = useState('');
  const posteable = title.trim().length > 0; 
  const [loading, setLoading] = useState(false);
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status != "granted") {
      alert("Se requiere acceso a galería para subir fotos");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const publish = async () => {
    if(title == ''){
      console.log("Faltan Datos");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://pdm-backend-1sg4.onrender.com/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, img_url: imageUri })
      });
      if (!res.ok) {
        console.log("Titulo, descripcion o image incorrectas");
        return;
      }

    } catch (err) {
      console.log("Error al publicar post: ", err);
    } finally {
      setDescription("");
      setTitle("");
      setImageUri("");
    }
  }

  return (
    <SafeAreaView className="flex px-5">
      {/* Header */}
      <View className="mt-4 flex-row justify-between items-center">
        <Text className="text-4xl font-bold mr-4">Nuevo Post</Text>

        <TouchableOpacity
          className= {`mr-3 p-2 rounded-md`}
          onPress={pickImage}
        >
          <MaterialIcons name="image" size={24} color="#1B5BA5" />
        </TouchableOpacity>

        <TouchableOpacity className={`p-2 px-8 flex-row justify-center items-center rounded-md ${posteable ? "bg-[#1B5BA5] " : "bg-gray-300"} ${loading ? "opacity-70" : ""} `} onPress={publish}>
          <Text className="text-white font-bold justify-end">Post </Text>
          {loading ? (
            <ActivityIndicator
              className="flex"
              size="small"
              color="#fff"
            />
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Avatar + contenido */}
      <View className="flex-row mt-4">

        {/* Avatar */}
        <Image
          source={{ uri: avatarUrl || defaultAvatar }}
          className="w-14 h-14 rounded-full mr-4 border"
        />

        {/* TextInput "Cuenta en que piensas..." */}
        <View className="flex-1">
          <TextInput
            className="text-3xl font-bold"
            placeholder="Titulo de tu publicación"
            multiline
            textAlignVertical="top"
            value={title}
            onChangeText={setTitle}
          />
          <View className="border-b border-gray-700 my-4"/>
          <TextInput
            className="text-xl"
            placeholder="Cuenta en que piensas..."
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          {/* Preview de la imagen */} 
          {imageUri !== "" && (
            <View className="mt-4 w-full rounded-2xl overflow-hidden items-center justify-center">
              <Image
                source={{ uri: imageUri }}
                className="w-full aspect-[3/4]"
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
