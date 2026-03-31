import { products } from "@wix/stores";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerImages from "../components/BannerImages";
import ProductCard from "../components/ProductCard";
import Searchbar from "../components/Searchbar";
import LoadingSkeleton from "../components/skeletons/LoadingSkeleton";
import useFetchProducts from "../hooks/FetchProducts";

export type Product = products.Product;
// in Index.tsx or a separate types.ts file
// export type Product = {
//   _id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   sku?: string;
//   price?: {
//     currency: string;
//     price: number;
//     discountedPrice: number;
//     formatted: {
//       price: string;
//       discountedPrice: string;
//     };
//   };
//   convertedPriceData?: {
//     currency: string;
//     price: number;
//     discountedPrice: number;
//     formatted: {
//       price: string;
//       discountedPrice: string;
//     };
//   };
//   stock?: {
//     trackInventory: boolean;
//     inStock: boolean;
//     inventoryStatus?: string;
//   };
//   media?: {
//     mainMedia?: {
//       thumbnail?: {
//         url: string;
//         width: number;
//         height: number;
//       };
//       image?: {
//         url: string;
//         width: number;
//         height: number;
//       };
//     };
//   };
//   ribbon?: string;
//   [key: string]: any; // allow any extra fields
// };

export default function Index() {
  const { data: Data, isLoading, error } = useFetchProducts();
  // console.log(JSON.stringify(Data, null, 2));

  if (error) return <Text>{String(error)}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Data ?? []}
        renderItem={({ item }) => (
          <ProductCard
            _id={item._id}
            name={item.name}
            slug={item.slug}
            description={item.description}
            price={item.price}
            stock={item.stock}
            media={item.media}
            ribbon={item.ribbon}
          />
        )}
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
