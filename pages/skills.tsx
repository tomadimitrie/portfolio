import React from "react";
import { View, StyleSheet } from "react-native";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Skills: NextPage = () => {
  return <View style={styles.skills} />;
};

export default withPageTransition(Skills);

const styles = StyleSheet.create({
  skills: {
    width: "100%",
    height: "100%",
    backgroundColor: "green",
  },
});
