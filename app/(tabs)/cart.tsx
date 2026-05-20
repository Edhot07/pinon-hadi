import { currentCart } from "@wix/ecom";
import { media } from "@wix/sdk";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "../hooks/FetchProducts";

const Cart = () => {
  const { data, isLoading, isFetching } = useCart();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const totalQuantity =
    data?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          My cart
        </Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {data?.lineItems?.length ?? 0} items
          </Text>
        </View>
      </View>

      {totalQuantity === 0 && (
        <View style={styles.emptyCartContainer}>
          <Text variant="bodyMedium" style={{ color: "#888" }}>
            {" "}
            Your cart is empty
          </Text>
          <Link
            style={{
              color: "#715bf1",
              textDecorationLine: "underline",
              fontSize: 16,
              marginTop: 8,
            }}
            href="/"
          >
            Go to the shop
          </Link>
        </View>
      )}

      {/* List */}
      <FlatList
        keyExtractor={(item) => item._id as string}
        showsVerticalScrollIndicator={false}
        data={data?.lineItems}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <CartItem item={item} />}
      />

      {/* Checkout Bar */}
      {totalQuantity > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
              Total amount
            </Text>
            <Text variant="headlineSmall" style={styles.totalAmount}>
              {/* @ts-expect-error */}
              {data?.subtotal?.formattedConvertedAmount?.split(".")[0]}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.outline, fontStyle: "italic" }}
            >
              Taxes & shipping added at checkout
            </Text>
          </View>

          <Button
            mode="contained"
            buttonColor="#000"
            onPress={() => console.log("Checkout")}
            labelStyle={{ fontSize: 15, fontWeight: "700", color: "#fff" }}
            icon="arrow-right"
            contentStyle={{ flexDirection: "row-reverse", height: 48 }}
            style={styles.checkoutButton}
            disabled={!totalQuantity || isFetching}
          >
            Checkout
          </Button>
        </View>
      )}
    </View>
  );
};

function CartItem({ item }: { item: currentCart.LineItem }) {
  const slug = item.url?.split("/").pop();

  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const productId = item._id;

  if (!productId) return null;

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  const hasDiscount =
    item.fullPrice && item.fullPrice.amount !== item.price?.amount;

  const imageUrl = item.image
    ? media.getImageUrl(item.image).url
    : "https://via.placeholder.com/200";

  return (
    <View style={styles.card}>
      {/* Card Body */}
      <View style={styles.cardBody}>
        {/* Image */}
        <View>
          <Link href={`/products/${slug}`}>
            <Image
              source={imageUrl}
              contentFit="cover"
              priority="high"
              cachePolicy="memory-disk"
              style={styles.cartImage}
              transition={200}
            />
          </Link>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>SALE</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          {/* Name */}
          <Text
            variant="titleSmall"
            numberOfLines={2}
            style={styles.productName}
          >
            {item.productName?.translated || "Product"}
          </Text>

          {/* Variant */}
          {!!item.descriptionLines?.length && (
            <Text
              variant="bodySmall"
              style={styles.variantText}
              numberOfLines={1}
            >
              {item.descriptionLines
                .map(
                  (line) =>
                    line.colorInfo?.translated || line.plainText?.translated,
                )
                .join(" · ")}
            </Text>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text variant="titleMedium" style={styles.priceMain}>
              {item.price?.formattedConvertedAmount?.split(".")[0]}
            </Text>
            {hasDiscount && (
              <Text style={styles.priceOld}>
                {item.fullPrice?.formattedConvertedAmount?.split(".")[0]}
              </Text>
            )}
          </View>

          {/* Quantity Controls */}
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              // onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              onPress={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 0 : item.quantity - 1,
                })
              }
              activeOpacity={0.7}
              disabled={item.quantity === 1}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <View style={styles.qtyVal}>
              <Text style={styles.qtyValText}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 1 : item.quantity + 1,
                })
              }
              activeOpacity={0.7}
              disabled={quantityLimitReached}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          {quantityLimitReached && (
            <Text variant="labelSmall" style={{ color: "#910303aa" }}>
              Maximum available quantity reached
            </Text>
          )}
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <Pressable
          style={({ pressed }) => [
            styles.footerBtn,
            pressed && styles.footerBtnPressed,
          ]}
          onPress={() => removeItemMutation.mutate(productId)}
        >
          <Text style={styles.footerBtnDanger}>Remove</Text>
        </Pressable>

        <View style={styles.footerDivider} />

        <Pressable
          style={({ pressed }) => [
            styles.footerBtn,
            pressed && styles.footerBtnPressed,
          ]}
          onPress={() => console.log("Wishlist")}
        >
          <Text style={styles.footerBtnText}>Wishlist</Text>
        </Pressable>

        <View style={styles.footerDivider} />

        <Pressable
          style={({ pressed }) => [
            styles.footerBtn,
            pressed && styles.footerBtnPressed,
          ]}
          onPress={() => console.log("Buy now")}
        >
          <Text style={styles.footerBtnText}>Buy now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "700",
  },
  headerBadge: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // List
  listContent: {
    padding: 10,
    gap: 10,
  },

  //Empty Cart Container
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  cardBody: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },

  // Image
  cartImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#E24B4A",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },

  // Text
  productName: {
    fontWeight: "600",
    lineHeight: 18,
  },
  variantText: {
    color: "#888",
  },

  // Price
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  priceMain: {
    fontWeight: "700",
  },
  priceOld: {
    fontSize: 11,
    color: "#A32D2D",
    textDecorationLine: "line-through",
  },

  // Quantity
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: "#d0d0d0",
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 38, // ← large enough to tap comfortably
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: "300",
    color: "#000",
    lineHeight: 22,
  },
  qtyVal: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: "#d0d0d0",
  },
  qtyValText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBtnPressed: {
    backgroundColor: "#f5f5f5",
  },
  footerDivider: {
    width: 0.5,
    backgroundColor: "#e0e0e0",
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
  },
  footerBtnDanger: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A32D2D",
  },

  // Checkout Bar
  checkoutBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    gap: 16,
  },
  totalAmount: {
    fontWeight: "700",
    color: "#000",
  },
  checkoutButton: {
    borderRadius: 12,
    flex: 1,
  },
});

export default Cart;
