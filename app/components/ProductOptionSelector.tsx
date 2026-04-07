import { products } from "@wix/stores";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface ProductOptions {
  productOptions: products.ProductOption[] | undefined;
}
const ProductOptionSelector = ({ productOptions }: ProductOptions) => {
  if (!productOptions) return null;

  return (
    <View style={{ gap: 10 }}>
      {productOptions.map((option) => (
        <View key={option.name} style={styles.productOptionContainer}>
          <Text>{option.name}</Text>
          <View style={styles.colorBox}>
            {option.choices?.map((choice, index) => (
              <Pressable
                onPress={() => console.log(choice.media?.mainMedia?._id)}
                disabled={!choice.inStock}
                style={[
                  styles.colorSelection,
                  choice.inStock === false && { backgroundColor: "#d3d3d0," },
                ]}
                key={index}
              >
                <View
                  style={[
                    option.optionType === "color" && {
                      height: 18,
                      width: 18,
                      borderRadius: "100%",
                      borderWidth: 0.5,
                      borderColor: "gray",
                      backgroundColor: choice.value,
                    },
                  ]}
                />
                <Text
                  style={[
                    choice.inStock === false && {
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {choice.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  productOptionContainer: {
    flexDirection: "column",
    gap: 4,
  },
  colorBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorSelection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderBlockColor: "#b1b1b1",
    borderWidth: 0.2,
    padding: 5,
    borderStyle: "solid",
  },
});

export default ProductOptionSelector;
