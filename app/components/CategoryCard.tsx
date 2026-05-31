import { categories } from "@wix/categories";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import WixImage from "./WixImage";

interface CategoryCardProps {
  category: categories.Category;
  isWide: boolean;
  onPress: () => void;
}

export default function CategoryCard({
  category,
  isWide,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrap}>
        {category.image ? (
          <WixImage
            mediaIdentifier={category.image as string}
            scaleToFill={false}
            style={styles.imageFull}
            contentFit="cover"
          />
        ) : (
          <CategoryPlaceholder name={category.name} size={36} />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text variant="labelLarge" style={styles.cardName} numberOfLines={1}>
          {category.name}
        </Text>
        {category.itemCounter !== undefined && (
          <Text variant="bodySmall" style={styles.cardCount}>
            {category.itemCounter} products
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function CategoryPlaceholder({
  name,
  size,
}: {
  name: string | null | undefined;
  size: number;
}) {
  const colors = [
    { bg: "#E6F1FB", text: "#185FA5" },
    { bg: "#EAF3DE", text: "#3B6D11" },
    { bg: "#FAEEDA", text: "#854F0B" },
    { bg: "#FCEBEB", text: "#A32D2D" },
    { bg: "#F1EFE8", text: "#5F5E5A" },
  ];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <View style={[styles.placeholder, { backgroundColor: color.bg }]}>
      <Text
        style={{ fontSize: size * 0.7, color: color.text, fontWeight: "500" }}
      >
        {name?.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ← Regular card
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  imageWrap: {
    height: 110, // ← fixed height ✅
    backgroundColor: "#f5f5f5",
  },

  // ← Wide card — row layout with fixed height
  cardWide: {
    flex: 1,
    flexDirection: "column", // ← side by side
    width: "100%",
    backgroundColor: "green",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  imageWrapWide: {
    width: "100%", // ← fixed width ✅
    height: 120, // ← fixed height, NOT "auto" ✅
    backgroundColor: "#f5f5f5",
  },

  imageFull: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 10,
    gap: 2,
  },
  cardBodyWide: {
    flex: 1, // ← takes remaining space ✅
    padding: 14,
    justifyContent: "center",
    gap: 4,
  },
  cardName: { fontWeight: "500" },
  cardCount: { color: "#888" },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EAF3DE",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 1,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#27500A",
  },
  browseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  browseText: { fontSize: 13, color: "#185FA5", fontWeight: "500" },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
