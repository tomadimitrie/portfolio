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
import axios from "axios";

const URL = "https://tomadimitrie-portfolio-backend.herokuapp.com/contact";

type Item = {
  title: string;
  value: string;
  href: string;
};

const Contact: NextPage<{ items: Item[] }> = (props) => {
  return (
    <View style={styles.contact}>
      <FlatList
        data={props.items}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Text style={styles.title}>
            {`${item.title}: `}
            <Pressable onPress={() => Linking.openURL(item.href)}>
              <Text style={styles.text}>{item.value}</Text>
            </Pressable>
          </Text>
        )}
      />
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  contact: {
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
    cursor: "pointer",
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
