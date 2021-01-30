import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { NextPage, GetServerSideProps } from "next";
import { A } from "@expo/html-elements";
import axios from "axios";

const URL = "https://tomadimitrie-portfolio-backend.herokuapp.com/projects";

type Item = {
  title: string;
  technologies: string;
  link: string;
  repo: string;
  description: string;
};

const Projects: NextPage<{ items: Item[] }> = (props) => {
  const renderLink = (link) =>
    link.startsWith("https://") ? (
      /* @ts-ignore ??? weird missing deprecated a11y props error */
      <A href={link} target="_blank" accessibilityComponentType>
        {link}
      </A>
    ) : (
      <>{link}</>
    );

  return (
    <View style={styles.projects}>
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
});

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const items = (
    await axios.get(URL, {
      responseType: "json",
    })
  ).data.sort((a, b) => a.priority - b.priority);
  return {
    props: {
      items,
    },
  };
};
