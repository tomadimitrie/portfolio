import React from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { NextPage, GetServerSideProps } from "next";
import firebase from "../helpers/firebase";
import withPageTransition from "../helpers/withPageTransition";
import AnimatedBackground from "../components/AnimatedBackground";
import { useHover, Hoverable } from "react-native-web-hooks";

const Index: NextPage<{ text: string }> = (props) => {
  const getIndex = (lineIndex: number, letterIndex: number) =>
    props.text
      .split("\\n")
      .slice(0, lineIndex)
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.split("").length,
        letterIndex
      );

  const letterCount = props.text
    .split("\\n")
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.split("").length,
      0
    );

  const scaleAnims = Array.from(
    { length: letterCount },
    () => React.useState(new Animated.ValueXY({ x: 1, y: 1 }))[0]
  );

  const colorAnims = Array.from(
    { length: letterCount },
    () => React.useState(new Animated.Value(0))[0]
  );

  const colors = colorAnims.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "green"],
    })
  );

  const zip = (a1, a2) =>
    a1.map((value, index) => ({
      x: value,
      y: a2[index],
    }));

  const animate = (index, reverse) => {
    Animated.parallel([
      Animated.sequence([
        ...zip(
          [1.25, 0.75, 1.15, 0.95, 1.05, 1],
          [0.75, 1.25, 0.85, 1.05, 0.95, 1]
        ).map((value) =>
          Animated.timing(scaleAnims[index], {
            toValue: value,
            duration: 100,
          })
        ),
      ]),
      Animated.timing(colorAnims[index], {
        toValue: reverse ? 0 : 1,
        duration: 1000,
      }),
    ]).start();
  };

  return (
    <View style={styles.home}>
      {/*<AnimatedBackground />*/}
      <View style={styles.letters}>
        {props.text.split("\\n").map((line, lineIndex) => (
          <Text key={`line-${lineIndex}`} style={styles.line}>
            {line.split("").map((letter, letterIndex) => {
              const index = getIndex(lineIndex, letterIndex);
              return (
                <Hoverable
                  key={`hoverable-${index}`}
                  onHoverIn={() => animate(index, false)}
                  onHoverOut={() => animate(index, true)}
                >
                  {(_isHovered) => (
                    <Animated.Text
                      style={[
                        letter === " " ? styles.space : styles.letter,
                        {
                          transform: [
                            {
                              scaleX: scaleAnims[index].x,
                            },
                            {
                              scaleY: scaleAnims[index].y,
                            },
                          ],
                          color: colors[index],
                        },
                      ]}
                    >
                      {letter}
                    </Animated.Text>
                  )}
                </Hoverable>
              );
            })}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default withPageTransition(Index);

const styles = StyleSheet.create({
  home: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  letters: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "absolute",
    marginTop: "50px",
  },
  space: {
    width: "2.5vw",
    display: "inline-block",
  },
  line: {
    display: "flex",
  },
  letter: {
    fontSize: "6vw",
    color: "white",
    fontFamily: "Oxanium_700Bold",
    display: "inline-block",
    cursor: "default",
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const doc = await firebase
    .firestore()
    .collection("texts")
    .doc("landing")
    .get();
  return {
    props: {
      text: doc.data().text,
    },
  };
};
