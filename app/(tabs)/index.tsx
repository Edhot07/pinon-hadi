import { products } from "@wix/stores";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerImages from "../components/BannerImages";
import ProductCard from "../components/ProductCard";
import Searchbar from "../components/Searchbar";
import LoadingSkeleton from "../components/skeletons/LoadingSkeleton";
import useFetchProducts from "../hooks/FetchProducts";

export type Product = products.Product;
export default function Index() {
  const { data: products, isLoading, error } = useFetchProducts();
  const insets = useSafeAreaInsets();
  console.log(process.env.EXPO_PUBLIC_BASE_URL);

  if (error) return <Text>{String(error)}</Text>;

  return (
    <View style={{ paddingTop: insets.top + 10, flex: 1, paddingBottom: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products ?? []}
        renderItem={({ item }) => <ProductCard {...item} />}
        keyExtractor={(item) => item._id as string}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          marginTop: 10,
          paddingHorizontal: 5,
          gap: 10,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 1,
    paddingBottom: 2,
  },
});
