// app/(tabs)/feed.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

type Post = {
  _id: string;
  title: string;
  description?: string;
  img_url?: string;
  username: string;
  likes: number;
  created_at?: string;
};

type PostCardProps = {
  post: Post;
  onLike: () => void;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(false);

        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }

        const response = await fetch(`${API_URL}/posts`);
        const json = await response.json();

        setPosts(json.posts);
      } catch (error) {
        setError(true);
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Sumar +1 en el cliente
        const updatedPosts = posts.map((post) => (post._id === postId ? { ...post, likes: post.likes + 1 } : post));
        setPosts(updatedPosts);
        console.log("Post liked!");
      } else {
        const unlikeResponse = await fetch(`${API_URL}/posts/${postId}/unlike`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (unlikeResponse.ok) {
          // Restar -1 en el cliente
          const updatedPosts = posts.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post));
          setPosts(updatedPosts);
          console.log("Post unliked!");
        } else {
          console.log("Failed to unlike post.", unlikeResponse.status);
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row py-3 border-b border-gray-200">
        {/* Logo más chiquito */}
        <Image
          source={require("../../assets/Cheicon_Logo-.png")}
          className="w-32 h-12 mx-auto"
          resizeMode="contain"
        />
      </View>

      {/* FEED */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10"
        />
      ) : Error ? (
        <Text className="text-red-500 text-center mt-10">Error loading posts.</Text>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={() => handleLike(post._id)}
            />
          ))}
          {posts.length === 0 && (
            <Text className="text-center text-gray-500 mt-10"> Todavía no hay posts en CHEICON 🥺</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PostCard({ post, onLike }: PostCardProps) {
  return (
    <>
      <View className="bg-white rounded 2xl border border-gray-200 mb-4 px-4 py-3">
        {/* Header del post */}
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-blue-200 mr-3 items-center justify-center">
            {/* Si no tiene foto que le ponga la inicial */}
            <Text className="font-bold text-blue-700">{post.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text className="font-semibold text-base">{post.username || "OP"}</Text>
            {post.created_at && (
              <Text className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</Text>
            )}
          </View>

          <View className="ml-auto">
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
            />
          </View>
        </View>
        {/* Contenido del post */}
        <Text className="font-bold text-lg mb-1">{post.title}</Text>
        {post.description ? <Text className="text-gray-800 mb-3">{post.description}</Text> : null}
        {post.img_url ? (
          <Image
            source={{ uri: post.img_url }}
            className="w-full h-48 rounded-md mb-3"
            resizeMode="cover"
          />
        ) : null}
        {/* Barra de opciones */}
        <View className="flex-row items-center">
          <View className="flex-row items-center">
            <TouchableOpacity>
              <Ionicons
                onPress={() => {
                  onLike();
                }}
                name="heart-outline"
                size={20}
              />
            </TouchableOpacity>
          </View>
          <Text className="ml-1 text-sm text-gray-600">{post.likes ?? 0}</Text>
        </View>
      </View>
    </>
  );
}
