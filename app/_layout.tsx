import { Stack } from "expo-router";
import "../global";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ocultamos header por defecto
      }}
    />
  );
}
