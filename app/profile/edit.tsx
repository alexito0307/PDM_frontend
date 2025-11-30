import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { use, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/authStore";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function editProfile() {
  
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [newFullName, setNewFullName] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const { avatarUrl, nombre, biografia, setUserInfo } = useAuthStore();
  const [imageUri, setImageUri] = useState(avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");

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

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const finalNombre = newFullName.trim() === "" ? nombre : newFullName;
      const finalBio = newBio.trim() === "" ? biografia : newBio;
      const finalAvatar = imageUri || avatarUrl;

      const payload: any = {};

      if (finalNombre && finalNombre !== nombre) {
        payload.nombre = finalNombre;
      }
      if (finalBio && finalBio !== biografia) {
        payload.biografia = finalBio;
      }
      if (finalAvatar && finalAvatar !== avatarUrl) {
        payload.avatar_url = finalAvatar;
      }

      if (Object.keys(payload).length === 0) {
        console.log("No hay cambios que guardar");
        return;
      }

      const response = await fetch(`${API_URL}/usuarios/me/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("User data updated successfully");

        setUserInfo({
          nombre: finalNombre ?? nombre ?? "",
          biografia: finalBio ?? biografia ?? "",
          avatarUrl: finalAvatar ?? avatarUrl ?? "",
        });

      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView>
          <View className="flex-1 items-center font-bold py-4 border-b border-gray-300 mb-4">
            <Text className="text-3xl font-bold">Editar perfil</Text>
            <TouchableOpacity
              className="absolute left-4 top-4"
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-center justify-start">
            <View className="mb-4 justify-center items-center">
              <Image
                source={{
                  uri: imageUri || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                }}
                style={{ width: 200, height: 200, borderRadius: 100 }}
              />
              <TouchableOpacity
                className= {`mt-4 w-64 py-3 rounded-xl border border-slate-400 bg-[#1B5BA5] items-center shadow-sm`}
                onPress={pickImage}
              >
                <Text className="text-white font-bold">Seleccionar nueva foto de perfil</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Nombre Completo</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2 w-64 mb-4"
                placeholder="Tu Nombre Completo"
                value={newFullName}
                onChangeText={setNewFullName}
              />
            </View>
            <View>
              <Text>Biografía</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2 w-64 mb-4"
                placeholder="Tu Biografía"
                value={newBio}
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={setNewBio}
              />
            </View>
            <TouchableOpacity
              onPress={handleSaveProfile}
              className={`flex-row mt-4 w-64 py-3 rounded-xl border border-slate-400 bg-[#1B5BA5] items-center justify-center shadow-sm ${loading ? "opacity-70" : ""}`}
            >
              <Text className="text-white font-bold">Actualizar Información </Text>
              {loading ? (
                <ActivityIndicator
                  className="flex"
                  size="small"
                  color="#fff"
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
