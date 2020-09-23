import React from "react";
import { View, StyleSheet } from "react-native";
import { AppProps } from "next/app";
import Nav from "../components/nav";
import AnimatedBackground from "../components/AnimatedBackground";
import { useDimensions } from "react-native-web-hooks";

const App = ({ Component, pageProps }: AppProps) => {
  const { window } = useDimensions();
  return (
    <>
      <Nav />
      <AnimatedBackground style={styles.cubes} />
      <View
        style={[
          styles.view,
          // { width: window.width, height: window.height - 50 },
        ]}
      >
        <Component {...pageProps} />
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  view: {
    marginTop: 50,
    height: "calc(100vh - 50px)",
  },
  cubes: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
