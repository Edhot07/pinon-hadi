import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

const ClientID = process.env.EXPO_PUBLIC_WIX_CLIENT_ID!;
export const wixClient = createClient({
  modules: {
    products,
  },
  auth: OAuthStrategy({ clientId: ClientID }),
});
export type WixClientProps = (typeof wixClient.products)[];
// console.log(JSON.stringify(wixClient, null, 2));
