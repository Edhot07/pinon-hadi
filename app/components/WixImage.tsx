import { media as wixMedia } from "@wix/sdk";
import { Image } from "expo-image";
import { ImageStyle, StyleProp } from "react-native";

type WixImageProps = {
  mediaIdentifier: string | undefined | null;
  placeholder?: string;
  alt?: string | null;
  style: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: "low" | "normal" | "high";
  transition?: number;
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
} & (
  | {
      scaleToFill?: true;
      width: number;
      height: number;
    }
  | {
      scaleToFill: false;
      width?: never;
      height?: never;
    }
);

export default function WixImage({
  mediaIdentifier,
  placeholder = "https://static.wixstatic.com/media/placeholder.png",
  alt,
  style,
  contentFit = "cover",
  priority = "normal",
  transition = 200,
  cachePolicy = "memory-disk",
  ...props
}: WixImageProps) {
  const imageUrl = mediaIdentifier
    ? props.scaleToFill || props.scaleToFill === undefined
      ? wixMedia.getScaledToFillImageUrl(
          mediaIdentifier,
          // ← TypeScript needs this cast since scaleToFill props are conditional
          (props as { width: number; height: number }).width,
          (props as { width: number; height: number }).height,
          {},
        )
      : wixMedia.getImageUrl(mediaIdentifier).url
    : placeholder;

  return (
    <Image
      source={imageUrl}
      alt={alt ?? ""}
      style={style}
      contentFit={contentFit}
      priority={priority}
      transition={transition}
      cachePolicy={cachePolicy}
    />
  );
}
