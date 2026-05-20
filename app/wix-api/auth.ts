import { wixClient } from "@/lib/wix-client.base";
import { OauthData } from "@wix/sdk";
import * as Linking from "expo-linking";

export async function generateOAuthData(originPath?: string) {
  try {
    const p = wixClient.auth.generateOAuthData(
      Linking.createURL("/oauth/wix/callback"),
      originPath,
    );
    return p;
  } catch (error) {
    console.log(error, " is the p");
  }
}

export async function getLoginUrl(oAuthData: OauthData | undefined) {
  const { authUrl } = await wixClient.auth.getAuthUrl(oAuthData!, {
    responseMode: "query",
  });
  return authUrl;
}

export async function getLogoutUrl() {
  const { logoutUrl } = await wixClient.auth.logout(
    "https://app-bridge-rolk2eowz-edhot07s-projects.vercel.app/logout-callback",
  );
  return logoutUrl;
}
