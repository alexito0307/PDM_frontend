import {View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity} from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import { useAuth } from "../../../context/AuthContext"; // <-- Importa tu hook de auth real
import { Post, User } from "../../types/post";


const API_URL = "https://tu-backend-url.com"; // <-- CAMBIA ESTO

// Tipos (ayuda tenerlos, puedes ponerlos en un archivo types.ts)


export default function ProfileScreen() {
  const { userId, token } = useAuth(); // Obtenemos el ID del usuario logueado

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Hacemos las dos peticiones al mismo tiempo
        const [userResponse, postsResponse] = await Promise.all([
          // 1. Obtener datos del usuario
          fetch(`${API_URL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // 2. Obtener posts del usuario
          fetch(`${API_URL}/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error("Error al cargar los datos del perfil");
        }

        const userData = await userResponse.json();
        const postsData = await postsResponse.json();

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]); // Se ejecuta si el userId cambia

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No se encontró el usuario.</Text>
      </View>
    );
  }

  // Componente del Header (Datos del Perfil)
  const ProfileHeader = () => (
    <View className="p-4 items-center">
      {/* Foto de Perfil */}
      <Image
        source={{ uri: user.profilePicture || "url_imagen_por_defecto" }}
        className="w-24 h-24 rounded-full bg-gray-300"
      />
      {/* Nombre de Usuario */}
      <Text className="text-2xl font-bold mt-4">{user.username}</Text>
      {/* Bio */}
      <Text className="text-gray-600 text-center mt-2">{user.bio}</Text>

      {/* Botón de Editar Perfil */}
      <Link href="/profile/edit" asChild>
        <TouchableOpacity className="mt-4 py-2 px-6 border border-gray-300 rounded-full">
          <Text className="font-semibold">Editar Perfil</Text>
        </TouchableOpacity>
      </Link>

      <Text className="text-xl font-bold mt-8 self-start">Mis Posts</Text>
    </View>
  );

  // Componente para cada Post en la lista
  const RenderPostItem = ({ item }: { item: Post }) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-semibold">{item.title}</Text>
      <Text className="text-gray-700 mt-1">{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={RenderPostItem}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={ProfileHeader} // La info del perfil va en el Header de la lista
      ListEmptyComponent={() => (
        <View className="items-center mt-4">
          <Text className="text-gray-500">Aún no tienes posts.</Text>
        </View>
      )}
      className="flex-1 bg-white"
    />
  );
}
