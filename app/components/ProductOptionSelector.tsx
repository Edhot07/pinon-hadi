import { checkInStock } from "@/lib/utils";
import { products } from "@wix/stores";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, TouchableRipple } from "react-native-paper";
import { Product } from "../(tabs)";

interface ProductOptions {
  productOptions: products.ProductOption[] | undefined;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
  // checkStock: boolean;
  product: Product | undefined;
}

const ProductOptionSelector = ({
  productOptions,
  selectedOptions,
  setSelectedOptions,
  product,
}: ProductOptions) => {
  if (!productOptions) return null;

  return (
    <View style={{ gap: 10 }}>
      {productOptions.map((option) => (
        <View key={option.name} style={styles.productOptionContainer}>
          {/* Option Title e.g "Color", "Size" */}
          <Text variant="labelLarge">
            {"Selected "}
            {option.name}
            {":"}
          </Text>

          <View style={styles.choicesBox}>
            {option.choices?.map((choice) => {
              const isSelected =
                selectedOptions[option.name || ""] === choice.description;
              const isOutOfStock = !checkInStock(product, {
                ...selectedOptions,
                [option.name || ""]: choice.description || "",
              });

              return (
                <Surface
                  key={choice.description}
                  elevation={isSelected ? 3 : 1} // ← raised when selected
                  style={[
                    styles.choiceSurface,
                    isSelected && styles.selectedSurface,
                    isOutOfStock && styles.outOfStockSurface,
                  ]}
                >
                  <TouchableRipple
                    onPress={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        [option.name || ""]: choice.description || "",
                      })
                    }
                    // disabled={isOutOfStock}
                    rippleColor="rgba(233, 47, 47, 0.1)"
                    style={styles.ripple}
                  >
                    <View style={styles.choiceInner}>
                      {/* Color Circle - only shown for color type */}
                      {option.optionType === "color" && (
                        <View
                          style={[
                            styles.colorCircle,
                            { backgroundColor: choice.value },
                          ]}
                        />
                      )}

                      {/* Choice Label e.g "Red", "XL" */}
                      <Text
                        variant="bodySmall"
                        style={[
                          isSelected && styles.selectedText,
                          isOutOfStock && styles.outOfStockText,
                        ]}
                      >
                        {choice.description}
                      </Text>
                    </View>
                  </TouchableRipple>
                </Surface>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  productOptionContainer: {
    flexDirection: "column",
    gap: 6,
  },
  choicesBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Each choice chip surface
  choiceSurface: {
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#b1b1b1",
  },

  // Selected state
  selectedSurface: {
    borderWidth: 1.5,
    borderColor: "#000",
  },

  // Out of stock state
  outOfStockSurface: {
    opacity: 0.5,
  },

  // TouchableRipple needs its own padding
  ripple: {
    padding: 6,
  },

  choiceInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // Color dot
  colorCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: "gray",
  },

  selectedText: {
    fontWeight: "bold",
  },

  outOfStockText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default ProductOptionSelector;
