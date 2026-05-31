// ─── Skeleton ─────────────────────────────────────────────────

import { StyleSheet, View } from "react-native";

export default function CollectionsSkeleton() {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <View style={[styles.skeletonWide]} />
      </View>
      <View style={styles.row}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
      <View style={styles.row}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    </View>
  );
}

const CARD_GAP = 10;
const styles = StyleSheet.create({
  grid: {
    padding: 12,
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
  },
  // Skeleton
  skeletonWide: {
    flex: 1,
    height: 120,
    backgroundColor: "#ebebeb",
    borderRadius: 12,
  },
  skeletonCard: {
    flex: 1,
    height: 160,
    backgroundColor: "#ebebeb",
    borderRadius: 12,
  },
});
