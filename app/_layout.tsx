import { Stack } from "expo-router";
import ReactQueryProvider from "./ReactQueryProvider";
export default function RootLayout() {
  if (__DEV__) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("reanimated inline style")
      ) {
        return; // ← swallow it
      }
      originalWarn(...args);
    };
  }
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
