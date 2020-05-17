import React from "react";
import { NextPage, GetServerSideProps } from "next";
import { motion } from "framer-motion";
import firebase from "../helpers/firebase";

const Index: NextPage<{ text: string }> = props => {
  const getIndex = (lineIndex: number, letterIndex: number) =>
    props.text
      .split("\\n")
      .slice(0, lineIndex)
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.split("").length,
        letterIndex
      );

  const variants = {
    hidden: {
      opacity: 0,
    },
    show: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: 1 + custom / 20,
      },
    }),
    hovered: {
      color: "rgba(0, 128, 0, 1)",
      transform: [
        "scale3d(1, 1, 1)",
        "scale3d(1.25, 0.75, 1)",
        "scale3d(0.75, 1.25, 1)",
        "scale3d(1.15, 0.85, 1)",
        "scale3d(0.95, 1.05, 1)",
        "scale3d(1.05, 0.95, 1)",
        "scale3d(1, 1, 1)",
      ],
      transition: {
        times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
      },
    },
  };

  return (
    <>
      <div id="home">
        <div id="letters">
          {props.text.split("\\n").map((line, lineIndex) => (
            <div key={`line-${lineIndex}`}>
              {line.split("").map((letter, letterIndex) =>
                letter === " " ? (
                  <span
                    className="space"
                    key={`space-${getIndex(lineIndex, letterIndex)}`}
                  />
                ) : (
                  <motion.span
                    whileHover="hovered"
                    initial="hidden"
                    animate="show"
                    variants={variants}
                    custom={getIndex(lineIndex, letterIndex)}
                    key={`letter-${getIndex(lineIndex, letterIndex)}`}
                    className="letter"
                  >
                    {letter}
                  </motion.span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        #home {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        #letters {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
        .space {
          width: 20px;
          display: inline-block;
        }
        :global(.letter) {
          font-size: 70px;
          color: white;
          font-family: "Oxanium", sans-serif;
          font-weight: 700;
          display: inline-block;
          cursor: default;
        }
      `}</style>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async context => {
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
