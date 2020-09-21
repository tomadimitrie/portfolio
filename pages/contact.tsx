import React from "react";
import { View, StyleSheet } from "react-native";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Contact: NextPage = () => {
  return <View style={styles.contact} />;
};

export default withPageTransition(Contact);

const styles = StyleSheet.create({
  contact: {
    width: "100%",
    height: "100%",
    backgroundColor: "green",
  },
});
