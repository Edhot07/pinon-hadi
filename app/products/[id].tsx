import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import HtmlStructure from "../components/HtmlStructure";
import { useFetchProductById } from "../hooks/FetchProducts";

const ProductDetails = () => {
  const { width } = useWindowDimensions();
  const { id, image } = useLocalSearchParams<{
    id: string;
    slug?: string;
    image?: string;
  }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    image || null,
  );

  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstVisible = viewableItems[0].item;
      setSelectedImage(firstVisible.image?.url || null);
    }
  });
  const { data: product, isLoading, error } = useFetchProductById(id);

  const handleonPress = (item: any) => {
    const index =
      product?.media?.items?.findIndex((i) => i._id === item._id) || 0;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setSelectedImage(item.image?.url || null);
  };
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.productDetaisContainer}
      >
        <View>
          {/* <Image
            source={{ uri: selectedImage || undefined }}
            resizeMode="cover"
            style={{
              height: 300,
              width: "100%",
            }}
          /> */}
          <FlatList
            ref={flatListRef}
            keyExtractor={(item) => item._id}
            data={product?.media?.items}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image?.url || undefined }}
                resizeMode="cover"
                style={{
                  height: 300,
                  width: width,
                }}
              />
            )}
            horizontal={true}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewabilityConfig}
            ListEmptyComponent={
              isLoading ? (
                <Image
                  source={{ uri: selectedImage || undefined }}
                  resizeMode="cover"
                  style={{
                    height: 300,
                    width: width,
                  }}
                />
              ) : null
            }
          />

          {/* <VariantImageCarousel
            mediaItems={product?.media?.items ?? []}
            width={width}
          /> */}
        </View>
        <Text style={styles.productName}>{product?.name}</Text>

        {/* Thumbnail strip */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            gap: 10,
            backgroundColor: "red",
          }}
        >
          {product?.media?.items?.map((item) => (
            <Pressable
              key={item._id}
              onPress={() => handleonPress(item)}
              style={{
                borderRadius: 8,
                borderWidth: selectedImage === item.image?.url ? 2 : 0,
                borderColor: "blue",
              }}
            >
              <Image
                source={{ uri: item.image?.url }}
                style={{ width: 60, height: 60, borderRadius: 8 }}
              />
            </Pressable>
          ))}
        </View>
        {/* Variant Images */}
        {/* <VariantImageCarousel
          mediaItems={product?.media?.items ?? []}
          width={width}
        /> */}
        <View style={styles.productInformation}>
          <HtmlStructure description={product?.description as unknown} />

          {/* <Text>{JSON.stringify(product, null, 2)}</Text> */}
        </View>
      </ScrollView>
    </>
  );
};

const VariantImageCarousel = ({
  mediaItems,
  width,
}: {
  mediaItems: Array<any>;
  width: number;
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const onImageScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const page = Math.round(x / width);
    // console.log(x, page);
    setSelectedImageIndex(page);
  };

  return (
    <View style={styles.variantCarouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onImageScroll}
        contentContainerStyle={styles.variantCarousel}
      >
        {mediaItems.map((item) => (
          <Image
            key={item._id}
            source={{ uri: item.image?.url }}
            resizeMode="cover"
            style={[styles.variantImage, { width }]}
          />
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {mediaItems.map((_, index) => (
          <View
            key={String(index)}
            style={[
              styles.dot,
              index === selectedImageIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  testing: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  activeTesting: {
    borderWidth: 2,
    borderColor: "red",
  },
  productDetaisContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 50,
  },
  productName: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
  },
  productInformation: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  variantCarouselContainer: {
    width: "100%",
    marginBottom: 20,
  },
  variantCarousel: {
    alignItems: "center",
  },
  variantImage: {
    height: 220,
    borderRadius: 12,
    marginRight: 10,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#111",
  },
  buyBottons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 60,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ProductDetails;
