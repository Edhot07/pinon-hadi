import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErroState";
import CollectionsSkeleton from "../components/skeletons/CollectionsSkeleton";
import { useFetchCategories } from "../hooks/useCategories";

const Collections = () => {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFetchCategories();

  if (error) {
    return (
      <SafeAreaView>
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Collections
        </Text>
        <Text variant="bodySmall" style={styles.headerSub}>
          Browse by category
        </Text>
      </View>

      {isLoading ? (
        <CollectionsSkeleton />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id as string}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item, index }) => {
            // ← First item spans full width as featured
            const isWide = index === 0;
            return (
              <CategoryCard
                category={item}
                isWide={isWide}
                onPress={() =>
                  router.push({
                    pathname: "/collections/[id]",
                    params: {
                      id: item._id || "",
                      name: item.name,
                      slug: item.slug,
                    },
                  })
                }
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const CARD_GAP = 10;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontWeight: "600" },
  headerSub: { color: "#888", marginTop: 2 },
  grid: {
    padding: 12,
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
  },
});

export default Collections;
