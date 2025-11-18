import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Post, User } from "../types/post";

const API_URL = "https://pdm-backend-1sg4.onrender.com";

export default function Profile() {
  // 1. Obtenemos 'username' y 'token' del contexto
  const { username, token } = useAuth(); 

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no tenemos el username (aún cargando o no logueado), no hacer nada
    if (!username || !token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 2. Hacemos UNA SOLA LLAMADA al endpoint que nos da todo
        const response = await fetch(`${API_URL}/usuarios/${username}`, {
          headers: {
            // Aunque la ruta es pública, es bueno enviar el token
            // por si en el futuro la proteges
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar el perfil (Status: ${response.status})`);
        }

        const data = await response.json();

        // 3. El endpoint devuelve {'usuario': ..., 'posts': ...}
        if (!data.usuario || !data.posts) {
            throw new Error("La respuesta del backend no tiene el formato esperado.");
        }

        setUser(data.usuario);
        setPosts(data.posts);

      } catch (err) {
        console.error("Error en fetchData de Perfil:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, token]); // Se ejecuta si el 'username' o 'token' cambian

  // ... (El resto de tu JSX (return, ProfileHeader, RenderPostItem)
  // ...  es el mismo de antes y debería funcionar perfecto)
  
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
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  // ... (Pega tu 'ProfileHeader' y 'RenderPostItem' aquí)
  // ... (Asegúrate de usar 'user.biografia' y 'user.avatar_url')
  const ProfileHeader = () => (
    <View className="p-4 items-center">
      <Image
        source={{ uri: user.avatar_url || "url_imagen_por_defecto" }}
        className="w-24 h-24 rounded-full bg-gray-300"
      />
      <Text className="text-2xl font-bold mt-4">{user.username}</Text>
      <Text className="text-gray-600 text-center mt-2">{user.biografia}</Text>
      <Link href="/profile/edit" asChild>
        <TouchableOpacity className="mt-4 py-2 px-6 border border-gray-300 rounded-full">
          <Text className="font-semibold">Editar Perfil</Text>
        </TouchableOpacity>
      </Link>
      <Text className="text-xl font-bold mt-8 self-start">Mis Posts</Text>
    </View>
  );

  const RenderPostItem = ({ item }: { item: Post }) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-semibold">{item.title}</Text>
      <Text className="text-gray-700 mt-1">{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={RenderPostItem}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={ProfileHeader} 
      ListEmptyComponent={() => (
        <View className="items-center mt-4">
          <Text className="text-gray-500">Aún no tienes posts.</Text>
        </View>
      )}
      className="flex-1 bg-white"
    />
  );
}