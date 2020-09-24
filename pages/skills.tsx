import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { NextPage, GetServerSideProps } from "next";
import firebase from "../helpers/firebase";

type Skill = {
  title: string;
  data: string[];
};

const Skills: NextPage<{ skills: Skill[] }> = (props) => {
  return (
    <View style={styles.skills}>
      <SectionList
        keyExtractor={(item, index) => item + index}
        sections={props.skills}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.title}>{title}</Text>
        )}
        renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
      />
    </View>
  );
};

export default Skills;

const styles = StyleSheet.create({
  skills: {
    flex: 1,
    paddingLeft: 25,
    overflow: "scroll",
  },
  category: {
    marginVertical: 25,
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
    .collection("skills")
    .orderBy("index")
    .get();
  const docs = query.docs;
  return {
    props: {
      skills: docs
        .map((doc) => doc.data())
        .map(
          ({ title, value }) =>
            ({
              title,
              data: value,
            } as Skill)
        ),
    },
  };
};
