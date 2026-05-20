// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { STORAGE_KEYS } from "./constants";
import { secureStorage } from "./secureStorage";
import { wixClient } from "./wix-client.base";

const CALLBACK_URL = Linking.createURL("oauth/callback");

const WEB_CALLBACK_URL =
  "https://fullstack-ecommerce-eta.vercel.app/auth/callback";
// ↑ used as fallback if app not installed

export const generateAndStoreVisitorTokens = async () => {
  const tokens = await wixClient.auth.generateVisitorTokens();
  wixClient.auth.setTokens(tokens);
  await secureStorage.setItem(STORAGE_KEYS.WIX_TOKENS, JSON.stringify(tokens));
};

const isTokenExpired = (expiresAt: number) => {
  const now = Math.floor(Date.now() / 1000);
  return expiresAt < now;
};

export const initWixTokens = async () => {
  const stored = await secureStorage.getItem(STORAGE_KEYS.WIX_TOKENS);
  if (!stored) {
    generateAndStoreVisitorTokens();
    return;
  }
  const tokens = JSON.parse(stored);
  console.log("Token on reload:", tokens.accessToken.value.slice(0, 50));
  wixClient.auth.setTokens(tokens);

  if (isTokenExpired(tokens.accessToken.expiresAt)) {
    try {
      const refreshed = await wixClient.auth.renewToken(tokens.refreshToken);
      wixClient.auth.setTokens(refreshed);
      await secureStorage.setItem(
        STORAGE_KEYS.WIX_TOKENS,
        JSON.stringify(refreshed),
      );
    } catch (error) {
      await generateAndStoreVisitorTokens();
    }
  }
};

export const saveWixTokens = async () => {
  const tokens = wixClient.auth.getTokens();

  const serialized = JSON.stringify(tokens);

  if (serialized.length > 2024) {
    await secureStorage.setItem(
      STORAGE_KEYS.WIX_ACCESS_TOKEN,
      JSON.stringify(tokens.accessToken),
    );
    await secureStorage.setItem(
      STORAGE_KEYS.WIX_REFRESH_TOKEN,
      JSON.stringify(tokens.refreshToken),
    );
  } else {
    await secureStorage.setItem(STORAGE_KEYS.WIX_TOKENS, serialized);
  }
};

// ─── Check Login State ────────────────────────────────────────

export const isLoggedIn = () => {
  const loggedIn = wixClient.auth.loggedIn();
  console.log(loggedIn, " is the LoggedIn");
  return loggedIn;
};
