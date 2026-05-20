// lib/polyfills.ts
import { getRandomValues } from "expo-crypto";
import "react-native-get-random-values";

// ← Polyfill crypto for Wix SDK
if (typeof global.crypto === "undefined") {
  global.crypto = {
    getRandomValues,
  } as unknown as Crypto;
}
