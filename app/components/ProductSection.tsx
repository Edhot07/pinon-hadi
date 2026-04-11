import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Surface, Text } from "react-native-paper";

type IconName = keyof typeof Ionicons.glyphMap;
type IconColor = "blue" | "green" | "amber" | "coral" | "red";

interface ProductSectionProps {
  title: string;
  icon: IconName;
  iconColor?: IconColor;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

// ← Icon color tokens
const iconColorMap: Record<IconColor, { bg: string; icon: string }> = {
  blue: { bg: "#E6F1FB", icon: "#185FA5" },
  green: { bg: "#EAF3DE", icon: "#3B6D11" },
  amber: { bg: "#FAEEDA", icon: "#854F0B" },
  coral: { bg: "#FAECE7", icon: "#993C1D" },
  red: { bg: "#FCEBEB", icon: "#A32D2D" },
};

const ProductSection = ({
  title,
  icon,
  iconColor = "blue",
  defaultOpen = false,
  children,
}: ProductSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = iconColorMap[iconColor];

  return (
    <Surface style={styles.surface} elevation={1}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {/* Icon Box */}
          <View style={[styles.iconBox, { backgroundColor: colors.bg }]}>
            <Ionicons name={icon} size={16} color={colors.icon} />
          </View>
          <Text variant="titleSmall">{title}</Text>
        </View>

        {/* Chevron */}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#888"
        />
      </TouchableOpacity>

      {/* Collapsible Body */}
      {isOpen && <View style={styles.body}>{children}</View>}
    </Surface>
  );
};
export default ProductSection;

// ← Reusable row inside a section
interface SectionRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const SectionRow = ({ label, value, valueColor }: SectionRowProps) => (
  <View style={styles.row}>
    <Text variant="bodySmall" style={styles.rowLabel}>
      {label}
    </Text>
    <Text
      variant="bodySmall"
      style={[styles.rowValue, valueColor ? { color: valueColor } : null]}
    >
      {value}
    </Text>
  </View>
);

// ← Reusable stock badge
interface StockBadgeProps {
  inStock: boolean;
}

export const StockBadge = ({ inStock }: StockBadgeProps) => (
  <View style={[styles.badge, inStock ? styles.badgeGreen : styles.badgeRed]}>
    <Text
      style={[styles.badgeText, { color: inStock ? "#3B6D11" : "#A32D2D" }]}
    >
      {inStock ? "In stock" : "Out of stock"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    padding: 14,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  rowLabel: {
    color: "#888",
  },
  rowValue: {
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeGreen: { backgroundColor: "#EAF3DE" },
  badgeRed: { backgroundColor: "#FCEBEB" },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
