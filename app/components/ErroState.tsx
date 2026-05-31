import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export default function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: "#FCEBEB" }]}>
        <Ionicons name="alert-circle-outline" size={32} color="#A32D2D" />
      </View>
      <Text variant="titleSmall" style={styles.emptyTitle}>
        Something went wrong
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryBtnText}>Try again</Text>
      </TouchableOpacity>
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
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryBtnText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
