import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Linking,
  Pressable,
} from "react-native";
import { NextPage, GetServerSideProps } from "next";
import firebase from "../helpers/firebase";
import {
  useFonts,
  Oxanium_700Bold,
  Oxanium_400Regular,
} from "@expo-google-fonts/oxanium";

type Item = {
  title: string;
  technologies: string;
  link: string;
  repo: string;
  description: string;
};

const Projects: NextPage<{ items: Item[] }> = (props) => {
  const [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_400Regular,
  });

  const renderLink = (link) => {
    const isLink = link.startsWith("https://");
    const node = <Text style={isLink && styles.clickable}>{link}</Text>;
    if (isLink) {
      return (
        <Pressable onPress={() => Linking.openURL(link)}>{node}</Pressable>
      );
    } else {
      return node;
    }
  };
  return (
    <View style={styles.projects}>
      {fontsLoaded && (
        <FlatList
          data={props.items}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>Description: {item.description}</Text>
              <Text style={styles.text}>Technologies: {item.technologies}</Text>
              <Text style={styles.text}>Link: {renderLink(item.link)}</Text>
              <Text style={styles.text}>Repo: {renderLink(item.repo)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  projects: {
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
  item: {
    paddingVertical: 15,
  },
  clickable: {
    cursor: "pointer",
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = await firebase
    .firestore()
    .collection("projects")
    .orderBy("index")
    .get();
  const docs = query.docs;
  return {
    props: {
      items: docs
        .map((doc) => doc.data())
        .map(
          ({ title, link, technologies, repo, description }) =>
            ({
              title,
              link,
              technologies,
              repo,
              description,
            } as Item)
        ),
    },
  };
};
