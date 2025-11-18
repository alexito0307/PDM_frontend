import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, // Usaremos Alert para errores
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext"; 

export default function Signin() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");

  const [missingData, setMissingData] = useState(false);
  const [loading, setLoading] = useState(false);

  const SIGNUP_URL = "https://pdm-backend-1sg4.onrender.com/usuarios/createAccount";

  const signin = async () => {
    if (!email || !password || !nombre || !username) {
      console.log("Faltan Datos");
      setMissingData(true);
      return;
    }

    setLoading(true);
    setMissingData(false);

    try {
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nombre, username }),
      });

      const data = await res.json(); // 1. Capturamos la respuesta SIEMPRE

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la cuenta");
      }

      console.log("Respuesta del servidor:", data);

      
      const tokenRecibido = data.token; 
      const userIdRecibido = data.user ? data.user._id : data.userId;
      const usernameRecibido = data.user ? data.user.username : username;

      if (tokenRecibido && userIdRecibido) {
         await authLogin(tokenRecibido, userIdRecibido, usernameRecibido);
      } else {
         Alert.alert("Éxito", "Cuenta creada. Por favor inicia sesión.");
         router.replace("/screens/login");
      }

    } catch (err) {
      console.log("Error en el registro: ", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "No se pudo registrar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4 w-full">
      <Image
        source={require("../../../assets/Cheicon_Logo-.png")}
        className="w-full h-36 self-center"
      />

      <Text className="font-bold text-2xl mb-2 font-poppins">
        Crea tu cuenta
      </Text>
      <View className="border border-gray-300 rounded-md p-4 w-full ">
        <Text className="mb-1 font-bold">Nombre Completo</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${
            missingData ? "border-red-500" : ""
          }`}
          placeholder="Tu nombre completo" 
          value={nombre}
          onChangeText={setNombre}
        />
        <Text className="mb-1 font-bold">Nombre de Usuario</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${
            missingData ? "border-red-500" : ""
          }`}
          placeholder="Tu nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Text className="mb-1 font-bold">Email</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${
            missingData ? "border-red-500" : ""
          }`}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text className="mb-1 font-bold">Contraseña</Text>
        <TextInput
          className={`rounded-md p-2 text-gray-900 ${
            missingData
              ? "mb-2 border border-red-500"
              : "mb-4 border border-gray-300"
          }`}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {missingData ? (
          <Text className="mb-2 text-red-500 text-xs">
            Todos los campos son obligatorios
          </Text>
        ) : null}
        <TouchableOpacity
          className={`p-2 w-full flex-row justify-center items-center bg-[#1B5BA5] rounded-md ${
            loading ? "opacity-70" : ""
          }`}
          disabled={loading}
          onPress={signin}
        >
          <Text className="text-white font-bold">Registrarse </Text>
          {loading && (
            <ActivityIndicator className="flex" size="small" color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
