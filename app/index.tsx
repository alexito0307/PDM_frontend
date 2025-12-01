import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../app/stores/authStore";

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth); 

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setIsLoggedIn(false);
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("https://pdm-backend-1sg4.onrender.com/usuarios/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await res.json();
        const usuario = data.usuario;
        
        const username = usuario.username;
        const avatarUrl = usuario.avatar_url;
        const nombre = usuario.nombre;
        const biografia = usuario.biografia;
        console.log(username);
        console.log(avatarUrl);
  
        if (res.ok) {
          await setAuth({
            username: username,
            avatarUrl: avatarUrl ?? null,
            token,
            nombre, 
            biografia
          });
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.removeItem("authToken");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Hubo un error en el inicio de sesion: ", error);
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
      setChecking(false);
    };
    checkToken();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? "/(tabs)/feed" : "/screens/login/"} />;
}
