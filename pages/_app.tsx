import React from "react";
import { View, StyleSheet } from "react-native";
import { AppProps } from "next/app";
import Nav from "../components/nav";
import AnimatedBackground from "../components/AnimatedBackground";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Nav />
      <View style={styles.content}>
        <AnimatedBackground style={styles.cubes} />
        <Component {...pageProps} />
      </View>
      <style jsx global>{`
        html,
        body,
        __next {
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
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
