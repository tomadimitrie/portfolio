import React from "react";
import { View, StyleSheet } from "react-native";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const About: NextPage = () => {
  return <View style={styles.about} />;
};

export default withPageTransition(About);

const styles = StyleSheet.create({
  about: {
    width: "100%",
    height: "100%",
    backgroundColor: "green",
  },
});
