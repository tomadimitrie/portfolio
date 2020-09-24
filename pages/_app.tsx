import React from "react";
import { View, StyleSheet } from "react-native";
import { AppProps } from "next/app";
import Nav from "../components/nav";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  useFonts,
  Oxanium_700Bold,
  Oxanium_400Regular,
} from "@expo-google-fonts/oxanium";

const App = ({ Component, pageProps }: AppProps) => {
  const [fontsLoaded] = useFonts({
    Oxanium_700Bold,
    Oxanium_400Regular,
  });

  return (
    fontsLoaded && (
      <>
        <Nav />
        <View style={styles.content}>
          <AnimatedBackground style={styles.cubes} />
          <Component {...pageProps} />
        </View>
        <style jsx global>{`
          html,
          body,
          #__next {
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </>
    )
  );
};

export default App;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  cubes: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});
