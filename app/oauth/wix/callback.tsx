import { useAuthContext } from "@/app/context/AuthContext";
import { STORAGE_KEYS } from "@/lib/constants";
import { secureStorage } from "@/lib/secureStorage";
import { wixClient } from "@/lib/wix-client.base";
import { isLoggedIn } from "@/lib/wixAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Callback() {
  const router = useRouter();
  const { code, state } = useLocalSearchParams();
  const { setIsMember } = useAuthContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (code && state) {
      exchangeCodeForTokens(code as string, state as string);
    }
  }, [code, state]);

  const exchangeCodeForTokens = async (code: string, state: string) => {
    try {
      const oAuthDataStr = await secureStorage.getItem(STORAGE_KEYS.OAUTH_DATA);
      const oAuthData = oAuthDataStr ? JSON.parse(oAuthDataStr) : null;

      if (!oAuthData) throw new Error("No OAuth data found");

      const memberTokens = await wixClient.auth.getMemberTokens(
        code,
        state,
        oAuthData,
      );

      wixClient.auth.setTokens(memberTokens);
      await secureStorage.setItem(
        STORAGE_KEYS.WIX_TOKENS,
        JSON.stringify(memberTokens),
      );
      await secureStorage.removeItem(STORAGE_KEYS.OAUTH_DATA);

      setIsMember(isLoggedIn());
      console.log("Member logged in ✅");

      await queryClient.invalidateQueries();
      console.log("Member logged in, cache cleared ✅");

      router.replace(oAuthData.originalUri || "/");
    } catch (error) {
      console.error("Token exchange failed:", error);
      router.replace("/profile");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
