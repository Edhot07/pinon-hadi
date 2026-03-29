import React from "react";
import { StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const About = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView edges={["top", "bottom"]}>
        <Text style={{ color: "red" }}>About</Text>
      </SafeAreaView>
    </>
  );
};

export default About;
