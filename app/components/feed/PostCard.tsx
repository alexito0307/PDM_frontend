import React, { use, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostCardProps } from "../../types/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const dimensiones = Dimensions.get("window");
const SCREEN_WIDTH = dimensiones.width;
const SCREEN_HEIGHT = dimensiones.height;

export default function PostCard({ post, onLike, currentUsername }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by?.includes(currentUsername));
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | string>(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );
  const retrieveProfilePicture = async (username: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`https://pdm-backend-1sg4.onrender.com/usuarios/${post.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Profile picture data:", data.usuario.avatar_url);
        setAvatarUrl(data.usuario.avatar_url);
      } else {
        setAvatarUrl("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  };
  useEffect(() => {
    if (post.username) {
      retrieveProfilePicture(post.username);
    }
  }, [post.username]);

  return (
    <View className="bg-white rounded-2xl border border-gray-200 mb-4 px-4 py-3">
      {/* Header del post */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-blue-200 mr-3 items-center justify-center">
          <Image
            source={{
              uri: avatarUrl,
            }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
        <View>
          <Text className="font-semibold text-base">{post.username || "OP"}</Text>
          {post.created_at && (
            <Text className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</Text>
          )}
        </View>
      </View>

      {/* Contenido del post */}
      <Text className="font-bold text-lg mb-1">{post.title}</Text>
      {post.description ? <Text className="text-gray-800 mb-3">{post.description}</Text> : null}

      {post.img_url ? (
        <TouchableOpacity
          onPress={() => setImageModalVisible(true)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: post.img_url }}
            className="w-full h-64 rounded-lg mb-3"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : null}

      {/* Modal para imagen en pantalla completa */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90">
          {/* Botón de cerrar */}
          <Pressable
            onPress={() => setImageModalVisible(false)}
            className="absolute top-12 right-4 z-10 bg-black/50 rounded-full p-2"
          >
            <Ionicons
              name="close"
              size={34}
              color="white"
            />
          </Pressable>

          {/* Imagen en pantalla completa */}
          <Pressable
            onPress={() => setImageModalVisible(false)}
            className="flex-1 items-center justify-center"
          >
            <Image
              source={{ uri: post.img_url }}
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
              }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </Modal>

      {/* Barra de opciones */}
      <View className="flex-row items-center ">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
            setLiked(!liked);
            onLike();
          }}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? "red" : "gray"}
          />
          <Text className={`ml-1 text-base ${liked ? "text-red-500" : "text-gray-600"}`}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center "
          onPress={() => router.push("../fullpost/" + post._id)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color="gray"
            className="ml-6"
          />
          <Text className="ml-1 text-base text-gray-600">{post.comments ? post.comments.length : 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
