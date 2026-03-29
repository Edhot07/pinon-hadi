// import React from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";
// import { Product } from "../(tabs)";

// interface ProductProps {
//   products: Product[];
// }

// const FeatureProduct = ({ products }: ProductProps) => {
//   //   const WixClient = wixClient;
//   //   const collection = WixClient.products?.queryProducts().find();
//   //   console.log(collection);
//   console.log(JSON.stringify(products, null, 2));
//   return (
//     <>
//       <Text style={{ marginLeft: 5 }}>Featured Products</Text>
//       <View style={styles.productsContainer}>
//         <FlatList
//           data={products}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => <Text>{item.name}</Text>}
//           numColumns={3}
//           columnWrapperStyle={{
//             justifyContent: "flex-start",
//             gap: 20,
//             paddingRight: 5,
//             marginBottom: 10,
//             backgroundColor: "red",
//           }}
//           scrollEnabled={false}
//           horizontal={false}
//         />
//         {/* <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View>
//         <View style={styles.cardContainer}></View> */}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   productsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     flexWrap: "wrap",
//     width: "100%",
//     paddingBottom: 20,
//     gap: 5,
//   },
//   cardContainer: {
//     height: 200,
//     width: 150,
//     backgroundColor: "blue",
//     borderRadius: 20,
//   },
//   card: {
//     marginTop: 2,
//     paddingBottom: 32,
//   },
// });

// export default FeatureProduct;
import React from "react";
import { Text, View } from "react-native";

const FeatureProduct = () => {
  return (
    <View>
      <Text>FeatureProduct</Text>
    </View>
  );
};

export default FeatureProduct;
