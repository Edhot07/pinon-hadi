import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SectionWrapper(Component: React.ComponentType) {
  return function HOC() {
    const insets = useSafeAreaInsets();
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Component />
      </View>
    );
  };
}
