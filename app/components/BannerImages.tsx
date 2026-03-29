import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BannerImages = () => {
  const bannerHeight = SCREEN_HEIGHT * 0.25; // 25% of screen height
  const borderRadius = SCREEN_WIDTH * 0.05; // 5% of screen width

  return (
    <View style={styles.bannerContainer}>
      <View
        style={[styles.imageWrapper, { height: bannerHeight, borderRadius }]}
      >
        <Image
          style={[styles.bannerImage, { borderRadius }]}
          source={{
            uri: "https://cdn.searchenginejournal.com/wp-content/uploads/2022/08/google-shopping-ads-6304dccb7a49e-sej.png",
          }}
        />
        <View style={[styles.overlay, { borderRadius }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.bannerTitle, { fontSize: SCREEN_WIDTH * 0.06 }]}>
            Big Sale
          </Text>
          <Text
            style={[styles.bannerSubtitle, { fontSize: SCREEN_WIDTH * 0.035 }]}
          >
            Shop Now
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: "auto",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    marginVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    alignSelf: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.3,
  },
  textContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
  },
  bannerTitle: {
    color: "white",
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "white",
    marginTop: 5,
  },
});

export default BannerImages;
