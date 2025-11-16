// app/_layout.tsx (o .js, como lo tengas)
import { Stack } from "expo-router";
import "../global";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
