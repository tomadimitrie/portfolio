import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { NextPage, GetServerSideProps } from "next";
import axios from "axios";

const URL = "https://tomadimitrie-portfolio-backend.herokuapp.com/about";

type Item = {
  title: string;
  value: string;
  data: string[];
};

const About: NextPage<{ items: Item[] }> = (props) => {
  return (
    <View style={styles.about}>
      <SectionList
        keyExtractor={(item, index) => item + index}
        sections={props.items}
        renderSectionHeader={({ section: { title, value } }) => (
          <Text style={styles.title}>
            {title}: <Text style={styles.text}>{value}</Text>
          </Text>
        )}
        renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
      />
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
  const items = (
    await axios.get(URL, {
      responseType: "json",
    })
  ).data
    .sort((a, b) =>
      a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0
    )
    .map((item) => ({
      ...item,
      data: item.details || [],
    }));
  return {
    props: {
      items,
    },
  };
};
