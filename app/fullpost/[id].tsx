import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Post } from "../types/post";
import CommentCard from "../components/feed/CommentCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function FullPost() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [sendingComment, setSendingComment] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const loadPost = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "GET",
      });
      const json = await response.json();

      if (response.ok) {
        console.log("Loaded post data:", json._id);
        setPost(json);
        setLikesCount(json.likes || 0);
        const username = await AsyncStorage.getItem("username");
        if (username) {
          setCurrentUsername(username);
          setLiked(json.liked_by?.includes(username) || false);
        }
      } else {
        console.error("Failed to load post");
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const retrieveProfilePicture = async (username: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`https://pdm-backend-1sg4.onrender.com/usuarios/${post?.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      console.log("Profile picture response:", json.usuario.avatar_url);
      if (response.ok) {
        setAvatarUrl(json.usuario.avatar_url);
      } else {
        setAvatarUrl("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const token = await AsyncStorage.getItem("authToken");

      const wasLiked = liked;
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);

      if (wasLiked) {
        const response = await fetch(`${API_URL}/posts/${post._id}/unlike`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setLiked(wasLiked);
          setLikesCount(liked ? likesCount + 1 : likesCount - 1);
        }
      } else {
        const response = await fetch(`${API_URL}/posts/${post._id}/like`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setLiked(wasLiked);
          setLikesCount(liked ? likesCount + 1 : likesCount - 1);
        }
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      setSendingComment(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/comments/${post._id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });
      const json = await response.json();
      console.log("Response from sending comment:", json);

      if (response.ok) {
        setNewComment("");
        await loadPost(post._id);
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "No se pudo agregar el comentario");
      }
    } catch (error) {
      console.log("Se intento mandar un comentario:", newComment.trim());
      console.error("Error sending comment:", error);
      Alert.alert("Error", "Ocurrió un error al enviar el comentario");
    } finally {
      setSendingComment(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  useEffect(() => {
    if (post?.username) {
      retrieveProfilePicture(post.username);
    }
  }, [post]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Cargando post...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">No se encontró el post</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header con botón de regresar */}
        <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text className="font-bold text-lg">Post</Text>
        </View>

        <ScrollView className="flex-1">
          {/* Post completo */}
          <View className="bg-white border-b border-gray-200 px-4 py-4 mb-2">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full bg-blue-200 mr-3 items-center justify-center overflow-hidden">
                <Image
                  source={{
                    uri: avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                  }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              </View>
              <View>
                <Text className="font-bold text-base">{post.username || "Usuario"}</Text>
                {post.created_at && (
                  <Text className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </View>

            <Text className="font-bold text-xl mb-2">{post.title}</Text>
            {post.description && <Text className="text-gray-800 text-base leading-6 mb-3">{post.description}</Text>}

            {post.img_url && (
              <Image
                source={{ uri: post.img_url }}
                className="w-full h-80 rounded-lg mb-3"
                resizeMode="cover"
              />
            )}

            <View className="flex-row items-center pt-3 border-t border-gray-100">
              <TouchableOpacity
                className="flex-row items-center mr-6"
                onPress={handleLike}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={22}
                  color={liked ? "red" : "gray"}
                />
                <Text className={`ml-2 text-base ${liked ? "text-red-500" : "text-gray-600"}`}>{likesCount}</Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color="gray"
                />
                <Text className="ml-2 text-base text-gray-600">{post.comments?.length || 0} comentarios</Text>
              </View>
            </View>
          </View>

          {/* Sección de comentarios */}
          <View className="bg-white">
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="font-bold text-base text-gray-700">Comentarios ({post.comments?.length || 0})</Text>
            </View>

            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                />
              ))
            ) : (
              <View className="py-8 items-center">
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color="#D1D5DB"
                />
                <Text className="text-gray-400 mt-2">Aún no hay comentarios</Text>
                <Text className="text-gray-400 text-sm">Sé el primero en comentar</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Input para nuevo comentario */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center">
            <View className="flex-1 bg-gray-100 rounded-full px-4 pb-3 mr-2">
              <TextInput
                placeholder="Escribe un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                className="text-base"
                multiline
                maxLength={500}
                editable={!sendingComment}
              />
            </View>
            <TouchableOpacity
              className="bg-blue-500 rounded-full p-3"
              disabled={!newComment.trim() || sendingComment}
              style={{ opacity: newComment.trim() && !sendingComment ? 1 : 0.5 }}
              onPress={handleSendComment}
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
