import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        if (res.ok) {
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
      setIsLoggedIn(!!token);
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
