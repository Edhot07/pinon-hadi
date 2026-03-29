import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const Searchbar = () => {
  const router = useRouter();
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color="gray"
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search products...."
        style={styles.textInput}
        placeholderTextColor="gray"
        onPress={() => {
          router.push("/");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: 50,
    alignSelf: "center", // centers horizontally
    backgroundColor: "#f0f0f0", // light gray
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 10,
    paddingHorizontal: 10, // padding inside container
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1, // takes remaining space
    fontSize: 16,
    color: "#000",
  },
});

export default Searchbar;
