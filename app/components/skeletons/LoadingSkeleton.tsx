import { StyleSheet, View } from "react-native";

const LoadingSkeleton = () => {
  return (
    <View style={styles.loadingContainer}>
      {[...Array(9)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonMedia} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        </View>
      ))}
    </View>
  );
};

export default LoadingSkeleton;

const styles = StyleSheet.create({
  loadingContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  skeletonCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    marginBottom: 10,
  },
  skeletonMedia: {
    height: 120,
    backgroundColor: "#e1e5ee",
    borderRadius: 12,
    marginBottom: 8,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#e1e5ee",
    borderRadius: 6,
    marginBottom: 6,
  },
  skeletonLineShort: {
    width: "60%",
  },
});
