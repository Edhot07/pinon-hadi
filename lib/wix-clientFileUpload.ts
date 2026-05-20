import { files } from "@wix/media";
import { ApiKeyStrategy, createClient } from "@wix/sdk";

const ClientID = process.env.EXPO_PUBLIC_WIX_CLIENT_ID!;
export const getWixAdminClient = () => {
  const wixClientfileUpload = createClient({
    modules: {
      files,
    },
    auth: ApiKeyStrategy({
      apiKey: process.env.EXPO_PUBLIC_WIX_API_KEY!,
      siteId: process.env.EXPO_PUBLIC_WIX_SITE_ID!,
    }),
  });
  return wixClientfileUpload;
};
