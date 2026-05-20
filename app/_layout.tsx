import "@/lib/polyfills";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

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
    <SafeAreaProvider>
      <AuthProvider>
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
            <Stack.Screen
              name="profile/edit"
              options={{ title: "Edit Profile" }}
            />
          </Stack>
        </ReactQueryProvider>
      </AuthProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
