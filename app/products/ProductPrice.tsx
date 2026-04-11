import { products } from "@wix/stores";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Product } from "../(tabs)";

interface ProductPriceProps {
  product: Product | undefined;
  selectedVariant: products.Variant | null;
}

const ProductPrice = ({ product, selectedVariant }: ProductPriceProps) => {
  const priceData = selectedVariant?.variant?.priceData ?? product?.priceData;
  if (!priceData) return null;

  const originalPrice = priceData.price ?? 0;
  const discountedPrice = priceData.discountedPrice ?? 0;
  const hasDiscount = discountedPrice < originalPrice;

  // Read directly from backend, no calculation
  const discount = product?.discount;
  const hasDiscountBadge =
    discount?.value != null && discount.type === products.DiscountType.PERCENT;

  const savingsAmount = hasDiscount
    ? Math.round(originalPrice - discountedPrice)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        {/* Main price */}
        <Text
          variant="headlineSmall"
          style={hasDiscount ? styles.discountedPrice : styles.normalPrice}
        >
          {hasDiscount
            ? priceData.formatted?.discountedPrice?.split(".")[0]
            : priceData.formatted?.price?.split(".")[0]}
        </Text>

        {/* Crossed out original */}
        {hasDiscount && (
          <Text variant="bodySmall" style={styles.originalPrice}>
            {priceData.formatted?.price?.split(".")[0]}
          </Text>
        )}

        {/* % off badge — only if backend sends it */}
        {hasDiscountBadge && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{discount.value}% off</Text>
          </View>
        )}
      </View>

      {/* You save line */}
      {hasDiscount && savingsAmount != null && (
        <Text variant="bodySmall" style={styles.savingsText}>
          You save {priceData.currency ?? ""} {savingsAmount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  normalPrice: {
    fontWeight: "500",
  },
  discountedPrice: {
    fontWeight: "500",
    color: "#3B6D11",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#A32D2D",
  },
  discountBadge: {
    backgroundColor: "#EAF3DE",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  discountBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#27500A",
  },
  savingsText: {
    color: "#3B6D11",
  },
});

export default ProductPrice;
