import { checkInStock, findVariant } from "@/lib/utils";
import { products } from "@wix/stores";
import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import ProductAccordion from "../components/ProductAccordion";
import ProductInformation from "../components/ProductInformation";
import ProductOptionSelector from "../components/ProductOptionSelector";
import { useFetchProductBySlug } from "../hooks/FetchProducts";
import AddToCartButtons from "./AddToCartButtons";
import ProductPrice from "./ProductPrice";
const ProductDetails = () => {
  const { width } = useWindowDimensions();
  const { id, image, slug } = useLocalSearchParams<{
    id: string;
    slug: string;
    image?: string;
  }>();

  // const { data: product, isLoading, error } = useFetchProductById(id);
  const { data: product, isLoading } = useFetchProductBySlug(slug);

  const [selectedId, setSelectedId] = useState<string | null>(
    product?.media?.items?.[2]?._id || id || null,
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product?.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0].description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  // Variables
  const selectedVariant = findVariant(product, selectedOptions);
  const checkStock = checkInStock(product, selectedOptions);

  // console.log(JSON.stringify(product?.variants?.[0], null, 2));
  const [imageIndex, setImageIndex] = useState(0);

  const isManualScroll = useRef(false);

  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (isManualScroll.current) return;

    if (viewableItems.length > 0) {
      const firstVisible = viewableItems[0].item;
      setSelectedId(firstVisible._id || null);
      setImageIndex(
        product?.media?.items?.findIndex((i) => i._id === firstVisible._id) ??
          0,
      );
    }
  });

  const handleonPress = (item: products.MediaItem) => {
    const index = product?.media?.items?.findIndex(
      (i) => i._id === item._id,
    ) as number;

    isManualScroll.current = true;

    flatListRef.current?.scrollToIndex({ index, animated: true });
    setImageIndex(index);
    setSelectedId(item._id || null); //

    setTimeout(() => {
      isManualScroll.current = false;
    }, 500);
  };
  const onImageScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setImageIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.productDetailsContainer}
      >
        {/* Main Image */}
        <FlatList
          ref={flatListRef}
          keyExtractor={(item) => item._id}
          data={product?.media?.items}
          renderItem={({ item }) => <MediaPreview item={item} />}
          onMomentumScrollEnd={onImageScroll}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={
            isLoading ? (
              <Image
                source={{ uri: image || undefined }}
                resizeMode="cover"
                style={{
                  height: 300,
                  width: width,
                }}
              />
            ) : null
          }
        />

        {/* The selected media bars */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {width / (product?.media?.items?.length || 1) > 0 &&
            product?.media?.items?.map((_, index) => (
              <View
                key={index}
                style={[
                  index === imageIndex
                    ? {
                        width: width / (product?.media?.items?.length || 1),
                        height: 4,
                        backgroundColor: "black",
                      }
                    : {
                        width: width / (product?.media?.items?.length || 1),
                        backgroundColor: "#ccc",
                      },
                ]}
              ></View>
            ))}
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            width: "100%",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Product Name */}
          <ProductInformation
            product={product}
            handleonPress={handleonPress}
            selectedId={selectedId}
          />
          {/* Product Selector */}
          <ProductOptionSelector
            productOptions={product?.productOptions}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            // product={product}
            product={product}
          />

          <ProductPrice product={product} selectedVariant={selectedVariant} />
          {/* <ProductSection title="whatthe" icon="timer" /> */}
          <ProductAccordion
            product={product}
            selectedOptions={selectedOptions}
          />
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
      <AddToCartButtons product={product} selectedOptions={selectedOptions} />
    </View>
  );
};

interface MediaPreviewProps {
  item: products.MediaItem;
}

function MediaPreview({ item }: MediaPreviewProps) {
  const { width } = useWindowDimensions();
  const videoRef = useRef(null);
  if (item.mediaType === "image") {
    return (
      <>
        <Image
          source={{ uri: item.image?.url || undefined }}
          resizeMode="cover"
          style={{
            height: 300,
            width: width,
          }}
        />
      </>
    );
  } else if (item.mediaType === "video") {
    const videoUrl = item.video?.files?.[0].url || "";
    return (
      <>
        <Video
          ref={videoRef}
          shouldPlay
          isLooping
          source={{ uri: videoUrl }}
          style={{ width: width, height: 300 }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productDetailsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  productName: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 10,
  },
});

export default ProductDetails;
