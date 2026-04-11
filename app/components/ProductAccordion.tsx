import { checkInStock } from "@/lib/utils";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Product } from "../(tabs)";
import ProductSection, { SectionRow, StockBadge } from "./ProductSection";
interface ProductAccordionProps {
  product: Product | undefined;
  selectedOptions: Record<string, string>;
}
const ProductAccordion = ({
  product,
  selectedOptions,
}: ProductAccordionProps) => {
  return (
    <View style={{ gap: 10 }}>
      <ProductSection
        title="Product Highlights"
        icon="cube-outline"
        iconColor="blue"
        defaultOpen
      >
        <SectionRow label="SKU" value={product?.sku ?? "—"} />
        <SectionRow
          label="Weight"
          value={product?.weight ? `${product.weight} kg` : "—"}
        />
        <SectionRow label="Brand" value={product?.brand ?? "—"} />
        <SectionRow label="Product type" value={product?.productType ?? "—"} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 6,
          }}
        >
          <Text variant="bodySmall" style={{ color: "#888" }}>
            Stock
          </Text>
          <StockBadge inStock={checkInStock(product, selectedOptions)} />
        </View>
      </ProductSection>

      {/* <ProductSection
        title="Shipping & returns"
        icon="car-outline"
        iconColor="green"
      >
        <SectionRow label="Standard delivery" value="3 - 5 days" />
        <SectionRow label="Express delivery" value="1 - 2 days" />
        <SectionRow label="Free returns" value="30 days" />
      </ProductSection> */}

      <ProductSection
        title="Additional info"
        icon="information-circle-outline"
        iconColor="amber"
      >
        <SectionRow label="Category" value={product?.productType ?? "—"} />
        <SectionRow label="Ribbon" value={product?.ribbon ?? "—"} />
      </ProductSection>
    </View>
  );
};

export default ProductAccordion;
