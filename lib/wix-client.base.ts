import { categories } from "@wix/categories";
import { backInStockNotifications, cart, currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";

const ClientID = process.env.EXPO_PUBLIC_WIX_CLIENT_ID!;
export const wixClient = createClient({
  modules: {
    products,
    categories,
    currentCart,
    cart,
    backInStockNotifications,
    collections,
    members,
  },
  auth: OAuthStrategy({ clientId: ClientID }),
});
