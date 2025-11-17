import React from "react";
import { View, Image } from "react-native";

export default function FeedHeader() {
  return (
    <View className="flex-row py-3 border-b border-gray-200">
      <Image
        source={require("../../../assets/Cheicon_Logo-.png")}
        className="w-32 h-12 mx-auto"
        resizeMode="contain"
      />
    </View>
  );
}
