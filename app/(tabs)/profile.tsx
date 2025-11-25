import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, Touchable } from "react-native";
import React, { useState, useEffect, use } from "react";
import { Link } from "expo-router";
import { User } from "../types/user";
import { Post } from "../types/post";
import FeedHeader from "../components/feed/FeedHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

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
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FeedHeader />
      <View className="flex-1 items-center justify-center bg-white px-4 w-full">
        <View>
          <Image
            source={{
              uri: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text className="text-2xl font-bold mt-4">{user?.username}</Text>
          <Text className="text-gray-600 mt-2 font-medium">{user?.nombre}</Text>
          <Text className="text-gray-600 mt-2">{user?.biografia}</Text>
          <TouchableOpacity className="mt-4 bg-gray-500 px-4 py-2 rounded w-40 items-center">
            <Text className="text-white font-semibold">Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
