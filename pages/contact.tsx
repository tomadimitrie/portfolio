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
  value: string;
  href: string;
};

const Contact: NextPage<{ items: Item[] }> = (props) => {
  const [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_400Regular,
  });
  return (
    <View style={styles.contact}>
      {fontsLoaded && (
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
      )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = await firebase
    .firestore()
    .collection("contact")
    .orderBy("index")
    .get();
  const docs = query.docs;
  return {
    props: {
      items: docs
        .map((doc) => doc.data())
        .map(
          ({ title, value, href }) =>
            ({
              title,
              value,
              href,
            } as Item)
        ),
    },
  };
};
