import { ResizeMode, Video } from "expo-av";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Product } from "../(tabs)";
interface MainImageProps {
  product?: Product;
  handleonPress: (item: any) => void;
  selectedId?: string | null;
}
const ProductInformation = ({
  product,
  handleonPress,
  selectedId,
}: MainImageProps) => {
  return (
    <>
      <Text style={styles.productName}>{product?.name}</Text>

      {/* Thumbnail Strip */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailStripContainer}
        data={product?.media?.items}
        keyExtractor={(item) => item._id as string}
        renderItem={({ item }) => (
          <Pressable
            key={item._id}
            onPress={() => handleonPress(item)}
            style={[styles.thumbnailContainer]}
          >
            {item.mediaType === "image" ? (
              <Image
                source={{
                  uri: item.image?.url,
                }}
                style={[
                  styles.thumbnail,
                  {
                    borderWidth: selectedId === item._id ? 2 : 0,
                    borderColor: "#bababa",
                  },
                ]}
              />
            ) : (
              <View style={{ position: "relative" }}>
                <Video
                  source={{ uri: item.video?.files?.[0].url as string }}
                  style={[
                    styles.thumbnail,
                    {
                      borderWidth: selectedId === item._id ? 2 : 0,
                      borderColor: "#bababa",
                    },
                  ]}
                  shouldPlay={false}
                  useNativeControls={false}
                  resizeMode={ResizeMode.CONTAIN}
                />
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/256/0/375.png",
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    position: "absolute",
                    alignSelf: "center",
                    top: "25%",
                    backgroundColor: "white",
                    opacity: 0.5,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "black",
                    height: "100%",
                    width: "100%",
                    opacity: 0.3,
                  }}
                />
              </View>
            )}
          </Pressable>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  productDetailsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  productName: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 10,
  },
  productInformation: {},

  // Thumbnail Strip Styling
  thumbnailStripContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
  },
  thumbnailContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default ProductInformation;
