import { products } from "@wix/stores";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerImages from "../components/BannerImages";
import ProductCard from "../components/ProductCard";
import Searchbar from "../components/Searchbar";
import LoadingSkeleton from "../components/skeletons/LoadingSkeleton";
import useFetchProducts from "../hooks/FetchProducts";

export type Product = products.Product;
export default function Index() {
  const { data: products, isLoading, error } = useFetchProducts();

  if (error) return <Text>{String(error)}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products ?? []}
        renderItem={({ item }) => <ProductCard {...item} />}
        keyExtractor={(item) => item._id as string}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginTop: 10,
          paddingHorizontal: 5,
        }}
        ListHeaderComponent={
          <>
            <Searchbar />
            <View style={{ paddingHorizontal: 5 }}>
              <BannerImages />
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSkeleton />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No products available.
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 5,
    paddingBottom: 5,
  },
});
