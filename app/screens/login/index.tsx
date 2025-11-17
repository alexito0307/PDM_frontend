import { router } from "expo-router";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4 w-full">
      <Image
        source={require("../../../assets/Cheicon_Logo-.png")}
        className="w-full h-36 self-center"
      />
      <View className="border border-gray-300 rounded-md p-4 w-full">
        <Text className="mb-1 font-bold">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 mb-4 text-gray-900"
          placeholder="correo@ejemplo.com"
        />
        <Text className="mb-1 font-bold">Contraseña</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 mb-4 text-gray-900"
          placeholder="Ingrese su contraseña"
          secureTextEntry
        />
        <TouchableOpacity className="p-2 w-100 justify-center items-center bg-[#1B5BA5] rounded-md">
          <Text className="text-white font-bold">Iniciar sesion</Text>
        </TouchableOpacity>
        <View className="mt-4 flex-row justify-center space-x-2">
          <Text className="font-normal">¿No tienes cuenta?</Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-semibold"> Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Navegación a Feed - para probar la navegación */}
      <View>
        <TouchableOpacity
          className="mt-6 p-8 bg-amber-200 rounded-md"
          onPress={() => router.replace("/(tabs)/feed")}
        >
          <Text>Go to Feed! 🤱🏻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
