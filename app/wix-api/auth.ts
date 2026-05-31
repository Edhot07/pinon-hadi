import { WEB_BASE_URL } from "@/lib/constants";
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
    `${WEB_BASE_URL}/logout-callback`,
  );
  return logoutUrl;
}
