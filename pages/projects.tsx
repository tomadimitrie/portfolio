import React from "react";
import { View, StyleSheet } from "react-native";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Projects: NextPage = () => {
  return <View style={styles.projects} />;
};

export default withPageTransition(Projects);

const styles = StyleSheet.create({
  projects: {
    width: "100%",
    height: "100%",
    backgroundColor: "green",
  },
});
