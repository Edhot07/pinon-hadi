import { STORAGE_KEYS } from "@/lib/constants";
import { secureStorage } from "@/lib/secureStorage";
import toastMessage from "@/lib/toastMessages";
import { generateAndStoreVisitorTokens, isLoggedIn } from "@/lib/wixAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { getLogoutUrl } from "../wix-api/auth";

export default function useLogout() {
  const { setIsMember } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await getLogoutUrl();
        await secureStorage.removeItem(STORAGE_KEYS.WIX_TOKENS);
        await generateAndStoreVisitorTokens();
        queryClient.invalidateQueries();
      } catch (error) {
        console.log("Wix logout error (non-critical):", error);
      }
    },
    onSuccess: () => {
      setIsMember(isLoggedIn());
      toastMessage("You have been logged out successfully", "success");
    },
    onError: (error) => {
      console.log("Logout failed:", error);
      toastMessage("Logout failed", "error");
    },
  });
}
