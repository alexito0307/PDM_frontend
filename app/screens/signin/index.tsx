import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");

  const [missingData, setMissingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signin = async () => {
    if (!email || !password || !nombre) {
      console.log("Faltan Datos");
      setMissingData(true);
      return;
    }
    try {
      setLoading(true);
      setSuccess(false);
      const res = await fetch("https://pdm-backend-1sg4.onrender.com/usuarios/createAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nombre, username }),
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/screens/login/");
      }, 700);
    } catch (err) {
      console.log("Error al iniciar sesión: ", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 items-center justify-center bg-white px-4 w-full">
      {/* Fondos decorativos */}
      <View className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-[#1B5BA5]/10" />
      <View className="absolute -bottom-32 -left-16 w-40 h-40 rounded-full bg-[#1B5BA5]/5" />
      {/* Logo */}
      <Image
        source={require("../../../assets/Cheicon_Logo-.png")}
        className="w-full h-36 self-center"
      />

      <Text className="font-bold text-2xl mb-2 font-poppins">Crea tu cuenta</Text>
      {/* Box de Signin */}
      <View className="border border-gray-300 rounded-md p-4 w-full ">
        <Text className="mb-1 font-bold">Nombre Completo</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${missingData ? "border-red-500" : ""}`}
          placeholder="Ingrese su nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
        <Text className="mb-1 font-bold">Nombre de Usuario</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${missingData ? "border-red-500" : ""}`}
          placeholder="Ingrese su nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
        <Text className="mb-1 font-bold">Email</Text>
        <TextInput
          className={`border border-gray-300 rounded-md p-2 mb-4 text-gray-900 ${missingData ? "border-red-500" : ""}`}
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
        {missingData ? <Text className="mb-2 text-red-500 text-xs">Email o contraseña no proporcionados</Text> : null}
        <TouchableOpacity
          className={`p-2 w-full flex-row justify-center items-center bg-[#1B5BA5] rounded-md ${loading ? "opacity-70" : ""}`}
          disabled={loading}
          onPress={signin}
        >
          <Text className="text-white font-bold">Registrarse </Text>
          {loading ? (
            <ActivityIndicator
              className="flex"
              size="small"
              color="#fff"
            />
          ) : success ? (
            <Text className="text-white text-xl">✓</Text>
          ) : null}
        </TouchableOpacity>
      </View>
      <Text className="text-gray-500 text-xs text-center mt-4">
        Al continuar, aceptas nuestros Términos de servicio y Aviso de privacidad
      </Text>
    </View>
  );
}
