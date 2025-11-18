import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "../global";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
