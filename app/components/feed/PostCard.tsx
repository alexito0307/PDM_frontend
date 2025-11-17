import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostCardProps } from "../../types/post";

export default function PostCard({ post, onLike, currentUsername }: PostCardProps) {
  const isLiked = post.likedBy?.includes(currentUsername);

  return (
    <View className="bg-white rounded-2xl border border-gray-200 mb-4 px-4 py-3">
      {/* Header del post */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-blue-200 mr-3 items-center justify-center">
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
        <TouchableOpacity onPress={onLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "red" : "gray"}
          />
        </TouchableOpacity>
        <Text className={`ml-1 text-sm ${isLiked ? "text-red-500" : "text-gray-600"}`}>{post.likes ?? 0}</Text>
      </View>
    </View>
  );
}
