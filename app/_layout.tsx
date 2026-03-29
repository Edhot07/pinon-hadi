import { Stack } from "expo-router";
import ReactQueryProvider from "./ReactQueryProvider";

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "cornflowerblue" },
          headerTintColor: "white",
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ReactQueryProvider>
  );
}
