import React from "react";
import { NextPage } from "next";
import { motion } from "framer-motion";

const kAnimationDuration = 1000;
const kColorAnimationDuration = 250;
const text = "Hello,\nI am a software developer\nand graphic designer";

const Index: NextPage = () => {
  const [letterState, setLetterState] = React.useState<{
    [index: number]: {
      isBouncing: boolean;
      isColored: boolean;
    };
  }>({});
  const getIndex = (lineIndex, letterIndex) =>
    text
      .split("\n")
      .slice(0, lineIndex)
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.split("").length,
        letterIndex
      );
  return (
    <>
      <div id="home">
        <div id="letters">
          {text.split("\n").map((line, lineIndex) => (
            <div key={`line-${lineIndex}`}>
              {line.split("").map((letter, letterIndex) =>
                letter === " " ? (
                  <span
                    className="space"
                    key={`space-${getIndex(lineIndex, letterIndex)}`}
                  />
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: getIndex(lineIndex, letterIndex) / 20,
                    }}
                    key={`letter-${getIndex(lineIndex, letterIndex)}`}
                    className={`letter 
                ${
                  letterState[getIndex(lineIndex, letterIndex)]?.isBouncing
                    ? "bounce"
                    : ""
                }
                ${
                  letterState[getIndex(lineIndex, letterIndex)]?.isColored
                    ? "colored"
                    : ""
                }`}
                    onMouseEnter={() => {
                      setLetterState(letterState => ({
                        ...letterState,
                        [getIndex(lineIndex, letterIndex)]: {
                          ...letterState[getIndex(lineIndex, letterIndex)],
                          isBouncing: true,
                          isColored: true,
                        },
                      }));
                      setTimeout(() => {
                        setLetterState(letterState => ({
                          ...letterState,
                          [getIndex(lineIndex, letterIndex)]: {
                            ...letterState[getIndex(lineIndex, letterIndex)],
                            isBouncing: false,
                          },
                        }));
                      }, kAnimationDuration);
                    }}
                    onMouseLeave={() => {
                      setLetterState(letterState => ({
                        ...letterState,
                        [getIndex(lineIndex, letterIndex)]: {
                          ...letterState[getIndex(lineIndex, letterIndex)],
                          isColored: false,
                        },
                      }));
                    }}
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
          transition: color;
          transition-duration: ${kColorAnimationDuration}ms;

          @at-root :global(.letter.bounce) {
            animation-name: bounce;
            animation-duration: ${kAnimationDuration}ms;
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          }

          @at-root :global(.letter.colored) {
            color: green;
          }
        }
        @keyframes bounce {
          from {
            transform: scale3d(1, 1, 1);
          }
          30% {
            transform: scale3d(1.25, 0.75, 1);
          }
          40% {
            transform: scale3d(0.75, 1.25, 1);
          }
          50% {
            transform: scale3d(1.15, 0.85, 1);
          }
          65% {
            transform: scale3d(0.95, 1.05, 1);
          }
          75% {
            transform: scale3d(1.05, 0.95, 1);
          }
          to {
            transform: scale3d(1, 1, 1);
          }
        }
      `}</style>
    </>
  );
};

export default Index;
