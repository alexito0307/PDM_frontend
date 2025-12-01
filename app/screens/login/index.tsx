import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [missingData, setMissingData] = useState(false);

  const login = async () => {
    if (!email || !password) {
      console.log("Faltan Datos");
      setMissingData(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://pdm-backend-1sg4.onrender.com/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.log("Credenciales Incorrectas");
        setMissingData(true);
        return;
      }

      const data = await res.json();

      const token = data.access_token;
      const usuario = data.usuario;
      const nombre = data.nombre;
      const biografia = data.biografia;

      if (!token || !usuario) {
        console.log("El backend no devolvió token o usuario");
        return;
      }
      await AsyncStorage.setItem("authToken", token)
      await setAuth({
        username: usuario.username,
        avatarUrl: usuario.avatar_url ?? null,
        token,
        nombre,
        biografia,
      });

      router.replace("/(tabs)/feed/");
    } catch (err) {
      console.log("Error al iniciar sesión: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4 w-full">
      {/* Círculo que va arriba */}
      <View
        className="absolute w-72 h-72 bg-[#1B5BA5] rounded-full opacity-2"
        style={{ top: -80, right: -80 }}
      />

      {/* Círculo que va abajo */}
      <View
        className="absolute w-60 h-60 bg-[#1B5BA5] rounded-full opacity-2"
        style={{ bottom: -60, left: -60 }}
      />
      {/* Logo */}
      <Image
        source={require("../../../assets/Cheicon_Logo-.png")}
        className="w-full h-36 self-center"
      />
      {/* Box de Login */}
      <View className="border border-gray-300 rounded-md p-4 w-full">
        <Text className="mb-1 font-bold">Email</Text>
        <TextInput
          className={`border rounded-md p-2 mb-4 text-gray-900 ${missingData ? "mb-2 border border-red-500" : "mb-4 border border-gray-300"}`}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
        />
        <Text className="mb-1 font-bold">Contraseña</Text>
        <TextInput
          className={`rounded-md p-2 text-gray-900 ${missingData ? "mb-2 border border-red-500" : "mb-4 border border-gray-300"}`}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {missingData ? <Text className="mb-2 text-red-500 text-xs">Email o contraseña no validos</Text> : null}
        <TouchableOpacity
          className={`p-2 w-full flex-row justify-center items-center bg-[#1B5BA5] rounded-md ${loading ? "opacity-70" : ""}`}
          onPress={login}
          disabled={loading}
        >
          <Text className="text-white font-bold">Iniciar sesion </Text>
          {loading ? (
            <ActivityIndicator
              className="flex"
              size="small"
              color="#fff"
            />
          ) : null}
        </TouchableOpacity>
        <View className="mt-4 flex-row justify-center space-x-2">
          <Text className="font-normal">¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => router.push("/screens/signin/")}>
            <Text className="text-blue-600 font-semibold"> Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
