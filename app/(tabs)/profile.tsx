import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, Touchable, ScrollView } from "react-native";
import React, { useState, useEffect, use } from "react";
import { Link, router } from "expo-router";
import { User } from "../types/user";
import { Post } from "../types/post";
import FeedHeader from "../components/feed/FeedHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/feed/PostCard";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState("");

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);

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

  const loadAllPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/posts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      const allPosts = json.posts;
      setAllPosts(allPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  const filterUserPosts = () => {
    if (user) {
      const filteredPosts = allPosts.filter((post) => post.username === user.username);
      setUserPosts(filteredPosts);

      const json = JSON.stringify(filteredPosts);

      const mappedPosts = JSON.parse(json).map((post: any) => {
        return {
          ...post,
        };
      });
      setUserPosts(mappedPosts);
    }
  };

  useEffect(() => {
    filterUserPosts();
  }, [user, allPosts]);

  async function handleLike(post: Post) {
    try {
      const token = await AsyncStorage.getItem("authToken");

      // Verificar si el usuario ya dio like
      const hasLiked = post.liked_by?.includes(username);

      if (hasLiked) {
        // Si ya dio like, hacer unlike
        const response = await fetch(`${API_URL}/posts/${post._id}/unlike`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Si no ha dado like, hacer like
        const response = await fetch(`${API_URL}/posts/${post._id}/like`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FeedHeader />
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center bg-white px-4 w-full pt-6">
          <View>
            <Image
              source={{
                uri: user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
              }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text className="text-2xl font-bold mt-4">{user?.username}</Text>
            <Text className="text-gray-600 mt-2 font-medium">{user?.nombre}</Text>
            <Text className="text-gray-600 mt-2">{user?.biografia}</Text>
            <View className="flex-row mt-4 gap-x-2">
              <TouchableOpacity
                className="bg-gray-500 px-4 py-2 rounded-2xl w-40 h-10 items-center justify-center"
                onPress={() => router.push("../profile/edit")}
              >
                <Text className="text-white font-bold">Editar Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-2xl w-40 h-10 items-center justify-center"
                onPress={async () => {
                  await AsyncStorage.removeItem("authToken");
                  await AsyncStorage.removeItem("userId");
                  await AsyncStorage.removeItem("username");
                  router.replace("../screens/login");
                }}
              >
                <Text className="text-white font-bold">Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Post del usuario */}
          <View className="w-full mt-6">
            <Text className="text-xl font-bold mb-4">Posts</Text>
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={() => {
                  handleLike(post);
                }}
                currentUsername={user?.username || ""}
              />
            ))}
            {userPosts.length === 0 && (
              <Text className="text-center text-gray-500 mt-10">¡Anímate a compartir algo en CHEICON! 🥺</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
