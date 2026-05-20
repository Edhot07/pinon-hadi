import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { wixClient } from "@/lib/wix-client.base";
import { Product } from "../(tabs)";

export default async function getCart() {
  const WixClient = wixClient;
  try {
    return await WixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}

export interface AddToCartValues {
  product: Product | undefined;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export async function addToCart({
  product,
  selectedOptions,
  quantity,
}: AddToCartValues) {
  const WixClient = wixClient;
  const selectedVariant = findVariant(product, selectedOptions);

  return WixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product?._id,
          options: selectedVariant
            ? {
                variantId: selectedVariant._id,
              }
            : {
                options: selectedOptions,
              },
        },
        quantity,
      },
    ],
  });
}

export interface UpdateCartItemQuantityValues {
  productId: string;
  newQuantity: number;
}
export async function updateCartItemQuantity({
  productId,
  newQuantity,
}: UpdateCartItemQuantityValues) {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    {
      _id: productId,
      quantity: newQuantity,
    },
  ]);
}

export async function removeCartItem(productId: string) {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
}
