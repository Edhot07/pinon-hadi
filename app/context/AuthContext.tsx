import { initWixTokens, isLoggedIn } from "@/lib/wixAuth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthContextType {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  isMember: boolean;
  setIsMember: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isReady: false,
  isLoading: false,
  isMember: false,
  error: null,
  setIsMember: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    // ← Only init tokens, no listener here
    const init = async () => {
      try {
        await initWixTokens();
        setIsMember(isLoggedIn());
      } catch (e) {
        setError("Failed to initialize session");
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoading,
        error,
        isMember,
        setIsMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
