import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity} from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Post, User } from "../types/post";

export default function Feed() {
  const { username, token, logout } = useAuth(); 

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "https://pdm-backend-1sg4.onrender.com";

  useEffect(() => {
      if (!username || !token) {
        setLoading(false);
        return;
      }
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_URL}/usuarios/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error al cargar el perfil (Status: ${response.status})`);
          }
  
          const data = await response.json();
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
    }, [username, token]);

    
  return (
    <View className="flex flex-1 items-center justify-center px-4">
      
      <Text className="text-4xl font-bold">Cuenta lo que quieras...</Text>

    </View>
  );
}
