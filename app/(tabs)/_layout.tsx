import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCart } from "../hooks/FetchProducts";

export default function TabsLayout() {
  const { data, isLoading } = useCart();

  const numberOfItems = data?.lineItems?.length || 0;
  const totalQuantity =
    data?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarItemStyle: {
          height: 100,
          width: 100,
          justifyContent: "center",
          alignItems: "center",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={focused ? 30 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bag-handle" : "bag-handle-outline"}
              color={color}
              size={focused ? 30 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={focused ? 30 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={focused ? 30 : 24}
            />
          ),
          // tabBarBadge: totalQuantity > 9 ? "9+" : totalQuantity || undefined,
          tabBarBadge: numberOfItems > 9 ? "9+" : numberOfItems || undefined,
          // tabBarBadge: totalQuantity,
        }}
      />
    </Tabs>
  );
}
