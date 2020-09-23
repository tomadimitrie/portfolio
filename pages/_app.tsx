import React from "react";
import { StyleSheet } from "react-native";
import { AppProps } from "next/app";
import Nav from "../components/nav";
import AnimatedBackground from "../components/AnimatedBackground";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Nav />
      <AnimatedBackground style={styles.cubes} />
      <Component {...pageProps} />
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
  cubes: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
