import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { NextPage, GetServerSideProps } from "next";
import firebase from "../helpers/firebase";
import {
  useFonts,
  Oxanium_700Bold,
  Oxanium_400Regular,
} from "@expo-google-fonts/oxanium";

type Item = {
  title: string;
  data: string[];
  subtitle: string;
};

const About: NextPage<{ items: Item[] }> = (props) => {
  const [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_400Regular,
  });
  return (
    <View style={styles.about}>
      {fontsLoaded && (
        <SectionList
          keyExtractor={(item, index) => item + index}
          sections={props.items}
          renderSectionHeader={({ section: { title, _data, subtitle } }) => (
            <Text style={styles.title}>
              {title}: <Text style={styles.text}>{subtitle}</Text>
            </Text>
          )}
          renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
        />
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  about: {
    flex: 1,
    paddingLeft: 25,
  },
  title: {
    color: "white",
    fontFamily: "Oxanium_700Bold",
    fontSize: 25,
    marginTop: 20,
  },
  text: {
    color: "white",
    fontFamily: "Oxanium_400Regular",
    fontSize: 20,
  },
});

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const query = await firebase
    .firestore()
    .collection("about")
    .orderBy("index")
    .get();
  const docs = query.docs;
  return {
    props: {
      items: docs
        .map((doc) => doc.data())
        .map(
          ({ title, value }) =>
            ({
              title,
              data: Array.isArray(value) ? value : [],
              subtitle: !Array.isArray(value) ? value : "",
            } as Item)
        ),
    },
  };
};
