import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/feed/PostCard";
import FeedHeader from "../components/feed/FeedHeader";
import { Post } from "../types/post";
import { useAuthStore } from "../stores/authStore";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // username y token del store
  const { username, token } = useAuthStore();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch(`${API_URL}/posts`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      let bodyText = await res.text();
      console.log("GET /posts status:", res.status);
      console.log("GET /posts body:", bodyText);

      if (!res.ok) {
        setErrorMsg(`Status ${res.status}: ${bodyText.slice(0, 100)}`);
        return;
      }

      // si sí fue ok, parseamos el JSON
      const json = JSON.parse(bodyText);

      // por si el backend devuelve array directo o {posts: [...]}
      const postsArray = Array.isArray(json) ? json : json.posts;

      if (!postsArray) {
        setErrorMsg("La respuesta no trae 'posts'");
        return;
      }

      const mappedPosts = postsArray.map((post: any) => ({ ...post }));
      const revertedPosts = mappedPosts.reverse();

      setPosts(revertedPosts);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setErrorMsg(error?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  async function handleLike(post: Post) {
    try {
      if (!token || !username) {
        console.log("No hay token o username, no se puede likear");
        return;
      }

      const hasLiked = post.liked_by?.includes(username);
      const endpoint = hasLiked ? "unlike" : "like";

      const res = await fetch(`${API_URL}/posts/${post._id}/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Error en like/unlike", await res.text());
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p._id !== post._id) return p;

          const likedBy = p.liked_by ?? [];

          return {
            ...p,
            liked_by: hasLiked
              ? likedBy.filter((u) => u !== username)
              : [...likedBy, username],
          };
        })
      );
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FeedHeader />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : errorMsg ? (
        <Text className="text-red-500 text-center mt-10 px-4">
          Error loading posts: {errorMsg}
        </Text>
      ) : (
        <FlatList
          className="p-3"
          data={posts}
          onRefresh={loadPosts}
          refreshing={loading}
          renderItem={({ item: post }) => (
            <PostCard
              post={post}
              onLike={() => handleLike(post)}
              currentUsername={username || ""}
            />
          )}
          keyExtractor={(post) => post._id}
        />
      )}
    </SafeAreaView>
  );
}
