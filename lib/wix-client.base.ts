import { categories } from "@wix/categories";
import { backInStockNotifications, cart, currentCart } from "@wix/ecom";
import { members } from "@wix/members";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products, productsV3 } from "@wix/stores";

const ClientID = process.env.EXPO_PUBLIC_WIX_CLIENT_ID!;
export const wixClient = createClient({
  modules: {
    products,
    productsV3,
    categories,
    currentCart,
    cart,
    backInStockNotifications,
    members,
    collections,
  },
  auth: OAuthStrategy({ clientId: ClientID }),
});
