import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },

  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
