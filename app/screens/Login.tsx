import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Image } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-4 w-full">
      <Image
        source={require("../../assets/Cheicon Logo.png")}
        className="w-full h-36 mb-8 self-center"
      />
      <Text className="text-2xl font-bold mb-6 text-white">Login</Text>
    </View>
  );
}
