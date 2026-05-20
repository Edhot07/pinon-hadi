import { checkInStock } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Product } from "../(tabs)";
import BackInStockModal from "../components/BackInStockModal";
import { useAddItemToCart } from "../hooks/FetchProducts";
interface AddToCartButtonsProps {
  product: Product | undefined;
  selectedOptions: Record<string, string>;
}

const AddToCartButtons = ({
  product,
  selectedOptions,
}: AddToCartButtonsProps) => {
  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const mutation = useAddItemToCart();

  const quantity = 1;
  const handleBuyNow = () => console.log("Buy now");
  const inStock = checkInStock(product, selectedOptions);

  return (
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: insets.bottom + 12 }, // ← adapts to each device
      ]}
    >
      {inStock ? (
        <>
          <TouchableOpacity
            style={[styles.cartButton, mutation.isPending && { opacity: 0.7 }]}
            onPress={() =>
              mutation.mutate({ product, selectedOptions, quantity })
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.cartButtonText}>Adding...</Text>
              </>
            ) : (
              <>
                <Ionicons name="cart-outline" size={18} color="#000" />
                <Text style={styles.cartButtonText}>Add to cart</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyButtonText}>Buy now</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setNotifyModalVisible(!notifyModalVisible)}
        >
          <Text style={styles.buyButtonText}>Notify me</Text>
        </TouchableOpacity>
      )}
      <BackInStockModal
        visible={notifyModalVisible}
        onDismiss={() => setNotifyModalVisible(!notifyModalVisible)}
        product={product}
        selectedOptions={selectedOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  cartButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  buyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});

export default AddToCartButtons;
