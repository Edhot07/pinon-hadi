import { STORAGE_KEYS } from "@/lib/constants";
import { secureStorage } from "@/lib/secureStorage";
import toastMessage from "@/lib/toastMessages";
import { useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { usePathname } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuthContext } from "../context/AuthContext";
import { generateOAuthData, getLoginUrl } from "../wix-api/auth";

export default function useAuth() {
  const { setIsMember } = useAuthContext();
  const pathname = usePathname();
  const baseUrl = Linking.createURL("/");
  const queryClient = useQueryClient();
  async function login() {
    try {
      const oAuthData = await generateOAuthData(baseUrl + pathname);

      await secureStorage.setItem(
        STORAGE_KEYS.OAUTH_DATA,
        JSON.stringify(oAuthData),
      );

      const redirecUrl = await getLoginUrl(oAuthData);
      const { type } = await WebBrowser.openAuthSessionAsync(
        redirecUrl,
        Linking.createURL("/oauth/wix/callback"),
      );
      if (type === "success") {
        toastMessage("Logged in successfully", "success");
      }
      if (type === "dismiss") {
        return;
      }
    } catch (error) {
      console.log(error, " is the error");
    }
  }

  return { login };
}
