import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[slug]"
        options={{
          title: "Product Details",
        }}
      />
    </Stack>
  );
}
