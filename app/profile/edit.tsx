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

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function editProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [newFullName, setNewFullName] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      const userData = json.usuario;

      setUser(userData);
      console.log("User data loaded:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const changeProfileAvatar = async (newAvatarUrl: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/usuarios/me/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar_url: newAvatarUrl }),
      });
      if (response.ok) {
        console.log("Profile avatar updated successfully");
        setNewAvatarUrl("");
        loadUserData();
      }
    } catch (error) {
      console.error("Error updating profile avatar:", error);
    }
  };
  const changeUserInfo = async (newFullName: string, newBio: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/usuarios/me/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: newFullName, biografia: newBio }),
      });
      if (response.ok) {
        console.log("User Data updated successfully");

        loadUserData();
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);
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
            <View className="mb-4">
              <Text className="mb-2 font-semibold text-2xl">Foto de Perfil</Text>
              <Image
                source={{
                  uri: user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                }}
                style={{ width: 200, height: 200, borderRadius: 100 }}
              />
              <TextInput
                className="border border-gray-300 rounded-md p-2 w-64 mt-4"
                placeholder={user?.avatar_url || "URL de la Foto de Perfil"}
                value={newAvatarUrl}
                onChangeText={setNewAvatarUrl}
              />
              <TouchableOpacity
                onPress={() => changeProfileAvatar(newAvatarUrl)}
                className="mt-4 bg-slate-500 px-4 py-2 rounded w-40 h-10 items-center justify-center"
              >
                <Text className="text-white font-bold">Actualizar Foto</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Nombre Completo</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2 w-64 mb-4"
                placeholder="Tu Nombre Completo"
                defaultValue={user?.nombre || ""}
                onChangeText={setNewFullName}
              />
            </View>
            <View>
              <Text>Biografía</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2 w-64 mb-4"
                placeholder="Tu Biografía"
                defaultValue={user?.biografia || ""}
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={setNewBio}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                changeUserInfo(newFullName, newBio);
                console.log("Updating user info");
              }}
              className="mt-4 bg-gray-500 justify-center rounded w-64 h-16 items-center"
            >
              <Text className="text-white font-bold">Actualizar Información</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
