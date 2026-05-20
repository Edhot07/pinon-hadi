import { products } from "@wix/stores";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Product } from "../(tabs)";
interface MainImageProps {
  product?: Product;
  handleonPress: (item: any) => void;
  selectedId?: string | null;
  mediaItems: products.MediaItem[] | undefined;
}
const ProductInformation = ({
  product,
  handleonPress,
  selectedId,
  mediaItems,
}: MainImageProps) => {
  // console.log(product?.media?.items?.[0].image?.url);
  return (
    <View>
      <Text style={styles.productName}>{product?.name}</Text>

      {/* Thumbnail Strip */}
      <View
        style={{
          borderColor: "#838383",
          borderWidth: 0.2,
          borderRadius: 10,
          backgroundColor: "#e4e3e3",
        }}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailStripContainer}
          data={mediaItems}
          keyExtractor={(item) => item._id as string}
          renderItem={({ item }) => (
            <ThumbNail
              item={item}
              handleonPress={handleonPress}
              selectedId={selectedId}
            />
          )}
        />
      </View>
    </View>
  );
};

interface ThumbNailProps {
  item: products.MediaItem;
  handleonPress: (item: any) => void;
  selectedId?: string | null;
}

function ThumbNail({ item, handleonPress, selectedId }: ThumbNailProps) {
  const imageUrl = item.image?.url;
  const stillFramedMediaId = item.video?.stillFrameMediaId;
  const thumbnailUrl = item.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFramedMediaId && thumbnailUrl
      ? thumbnailUrl?.split(stillFramedMediaId)[0] + stillFramedMediaId
      : undefined;

  // console.log(
  //   `image url: ${imageUrl}, \nStillFramedId: ${stillFramedMediaId}, \nThumbnailUrl: ${thumbnailUrl}, \nResolvedThumbnail Url: ${resolvedThumbnailUrl}`,
  // );
  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <Pressable
      key={item._id}
      onPress={() => handleonPress(item)}
      style={[styles.thumbnailContainer]}
    >
      {item.mediaType === "image" ? (
        <Image
          source={imageUrl || ""}
          contentFit="cover"
          cachePolicy="memory-disk" // ← second time you see same image = instant
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          style={[
            styles.thumbnail,
            {
              borderWidth: selectedId === item._id ? 2 : 0.5,
              borderColor: "black",
            },
          ]}
          transition={200}
        />
      ) : item.mediaType === "video" ? (
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
          {/* Relative play icon in the video thumbnail */}
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
      ) : null}
    </Pressable>
  );
}

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
    paddingVertical: 5,
    paddingHorizontal: 5,
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
