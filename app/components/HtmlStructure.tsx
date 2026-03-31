import React from "react";
import { useWindowDimensions } from "react-native";
import { RenderHTML } from "react-native-render-html";

const HtmlStructure = ({ description }: { description: unknown }) => {
  const { width } = useWindowDimensions();
  const htmlDescription =
    typeof description === "string"
      ? description
      : typeof (description as { html?: unknown })?.html === "string"
        ? (description as { html: string }).html
        : "";

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: htmlDescription }}
      enableCSSInlineProcessing={true}
      tagsStyles={{
        u: { textDecorationLine: "underline" },
        strong: { fontWeight: "700" },
        b: { fontWeight: "700" },
        em: { fontStyle: "italic" },
        i: { fontStyle: "italic" },
        mark: { backgroundColor: "yellow" },
      }}
    />
  );
};

export default HtmlStructure;
