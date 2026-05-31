import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default // ─── Empty State ──────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="grid-outline" size={32} color="#888" />
      </View>
      <Text variant="titleSmall" style={styles.emptyTitle}>
        No collections yet
      </Text>
      <Text variant="bodySmall" style={styles.emptySub}>
        Collections will appear here once added to your store
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Empty/Error
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
    marginTop: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontWeight: "600" },
  emptySub: { color: "#888", textAlign: "center", lineHeight: 18 },
});
