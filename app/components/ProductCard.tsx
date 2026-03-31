import type { products } from "@wix/stores";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  _id?: string;
  name?: string | null;
  slug?: string;
  description?: string | null;
  price?: products.PriceData;
  stock?: products.Stock;
  media?: products.Media;
  ribbon?: string | null;
}

const ProductCard = ({
  _id,
  name,
  slug,
  description,
  price,
  stock,
  media,
  ribbon,
}: ProductCardProps) => {
  return (
    <Link
      href={{
        pathname: "/products/[id]",
        params: {
          id: _id ?? "",
          image: media?.mainMedia?.image?.url,
          slug: slug ?? "",
        },
      }}
      asChild
      style={styles.cardContainer}
    >
      <TouchableOpacity style={styles.touchAbleCard}>
        <Image
          source={{ uri: media?.mainMedia?.image?.url }}
          resizeMode="cover"
          style={{ height: 150, width: "100%", borderRadius: 10 }}
        />
        <Text
          numberOfLines={1}
          style={{
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <View style={styles.priceData}>
          <Text style={{ color: "green" }}>
            {price?.formatted?.discountedPrice?.split(".")[0] ||
              price?.formatted?.price?.split(".")[0]}
          </Text>
          {price?.price != null &&
            price?.discountedPrice != null &&
            price.price < price.discountedPrice && (
              <Text
                style={{
                  textDecorationLine: "line-through",
                  fontSize: 11,
                  color: "gray",
                }}
              >
                {price?.formatted?.discountedPrice?.split(".")[0] ||
                  price?.formatted?.price?.split(".")[0]}
              </Text>
            )}
        </View>
        <View style={styles.overLay}>
          {ribbon?.length ? (
            <Text style={styles.ribbonText}>{ribbon}</Text>
          ) : (
            ""
          )}
        </View>
        {stock?.inventoryStatus === "OUT_OF_STOCK" && (
          <View style={styles.outOfStockContainer}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 5,
    borderColor: "gray",
    borderWidth: 0.07,
    backgroundColor: "#f2f3f5",
  },
  touchAbleCard: {
    width: "30%",
    position: "relative",
    backgroundColor: "#eceff1",
  },
  overLay: {
    position: "absolute",
    top: -5,
    left: "-2%",
    backgroundColor: "red",
    borderRadius: 2,
  },
  ribbonText: {
    fontSize: 10,
    color: "white",
    paddingHorizontal: 2,
  },
  priceData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outOfStockContainer: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  outOfStockText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    zIndex: 1,
    inset: 1,
    backgroundColor: "red",
  },
});

export default ProductCard;
