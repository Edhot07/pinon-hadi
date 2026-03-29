import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFetchProductById } from "../hooks/FetchProducts";

const ProductDetails = () => {
  const { id, image } = useLocalSearchParams<{
    id: string;
    slug?: string;
    image?: string;
  }>();

  const { data: product, isLoading, error } = useFetchProductById(id);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.productDetaisContainer}
      >
        <View>
          <Image
            source={{ uri: image }}
            resizeMode="cover"
            style={{
              height: 300,
              width: "100%",
            }}
          />
          <Text>{product?.name}</Text>
          {product?.description && <Text>{product.description}</Text>}

          <Text>{JSON.stringify(product, null, 2)}</Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  productDetaisContainer: {
    flex: 1,
  },
  buyBottons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 60,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ProductDetails;
