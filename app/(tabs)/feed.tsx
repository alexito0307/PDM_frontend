import React, { useEffect, useState } from "react";
import { Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "../components/feed/PostCard";
import FeedHeader from "../components/feed/FeedHeader";
import { Post } from "../types/post";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

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

  const handleLike = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes: post.likes + 1 } : post)));
        console.log("Post liked successfully");
      } else {
        const unlikeResponse = await fetch(`${API_URL}/posts/${postId}/unlike`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (unlikeResponse.ok) {
          setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes: post.likes - 1 } : post)));
          console.log("Post unliked successfully");
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FeedHeader />

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
              currentUsername={username}
            />
          ))}
          {posts.length === 0 && (
            <Text className="text-center text-gray-500 mt-10">Todavía no hay posts en CHEICON 🥺</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
