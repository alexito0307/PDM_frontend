import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, // Usaremos Alert para errores
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext"; 

export default function Signin() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");

  const [missingData, setMissingData] = useState(false);
  const [loading, setLoading] = useState(false);
  // 'success' ya no es necesario, el contexto se encargará de la navegación

  const signin = async () => {
    if (!email || !password || !nombre || !username) {
      // <-- Agregado 'username'
      console.log("Faltan Datos");
      setMissingData(true);
      return;
    }

    setLoading(true);
    setMissingData(false); // Resetea el error

    try {
      const res = await fetch(
        "https://pdm-backend-1sg4.onrender.com/usuarios/createAccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, nombre, username }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la cuenta");
      }

      const data = await res.json();
      await login(data.token, data.userId, data.username);

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
