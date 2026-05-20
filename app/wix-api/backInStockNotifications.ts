import { WIX_STORES_APP_ID_BACK_IN_STOCK_NOTIFICATIONS } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { wixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export interface CreateBackInStockNotificationRequestValues {
  email: string;
  itemUrl: string;
  product: products.Product | undefined;
  selectedOptions: Record<string, string>;
}
export async function createBackInStockNotificationRequest({
  email,
  itemUrl,
  product,
  selectedOptions,
}: CreateBackInStockNotificationRequestValues) {
  const selectedVariant = findVariant(product, selectedOptions);

  await wixClient.backInStockNotifications.createBackInStockNotificationRequest(
    {
      email,
      itemUrl,
      catalogReference: {
        appId: WIX_STORES_APP_ID_BACK_IN_STOCK_NOTIFICATIONS,
        catalogItemId: product?._id,
        options: selectedVariant
          ? {
              variantId: selectedVariant._id,
            }
          : {
              options: selectedOptions,
            },
      },
    },
    {
      image: product?.media?.mainMedia?.image?.url,
      name: product?.name || undefined,
      price: product?.priceData?.discountedPrice?.toFixed(2),
    },
  );
}
