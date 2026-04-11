import { Product } from "@/app/(tabs)";
import { products } from "@wix/stores";

export function findVariant(
  product: Product | undefined,
  selectedOptions: Record<string, string>,
) {
  if (!product?.manageVariants) return null;

  return (
    product.variants?.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => variant.choices?.[key] === value,
      );
    }) || null
  );
}

export function checkInStock(
  product: Product | undefined,
  selectedOptions: Record<string, string>,
) {
  const variant = findVariant(product, selectedOptions);
  return variant
    ? variant.stock?.quantity !== 0 && variant.stock?.inStock === true
    : product?.stock?.inventoryStatus === products.InventoryStatus.IN_STOCK ||
        product?.stock?.inventoryStatus ===
          products.InventoryStatus.PARTIALLY_OUT_OF_STOCK;
}
