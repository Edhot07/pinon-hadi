import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../components/ProductCard";
import { useCategoryProducts } from "../hooks/useCategories";

const CategoryScreen = () => {
  const { id, name, slug } = useLocalSearchParams<{
    id: string;
    name: string;
    slug: string;
  }>();

  const { data: products, isLoading } = useCategoryProducts(id);
  //   const products = getCategoryProducts(id);
  //   const products = getCategoryBySlug(slug);

  // const data = getProductsByCategoryId(id);
  // console.log("Products in category:", JSON.stringify(data, null, 2));
  // console.log("Products in category:", JSON.stringify(products, null, 2));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#185FA5" />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.headerTitle}>
          {name}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => item._id ?? String(index)}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="bodyMedium" style={{ color: "#888" }}>
                No products in this collection
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              _id={item._id || ""}
              name={item.name}
              slug={item.slug}
              price={item.price}
              media={item.media}
              ribbon={item.ribbon}
              stock={item.stock}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontWeight: "500" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  grid: { padding: 10, gap: 10 },
  row: { gap: 10 },
  empty: { flex: 1, alignItems: "center", marginTop: 60 },
});

export default CategoryScreen;
