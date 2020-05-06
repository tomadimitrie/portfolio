import React from "react";
import { NextPage } from "next";

const kAnimationDuration = 1000;
const kColorAnimationDuration = 250;

const Index: NextPage = () => {
  const [letterState, setLetterState] = React.useState<{
    [index: number]: {
      isBouncing: boolean;
      isColored: boolean;
    };
  }>({});
  return (
    <>
      <div id="home">
        <div id="letters">
          {"HELLO".split("").map((letter, index) => (
            <span
              key={`letter-${letter}-${index}`}
              className={`letter ${
                letterState[index]?.isBouncing ? "bounce" : ""
              } ${letterState[index]?.isColored ? "colored" : ""}`}
              onMouseEnter={() => {
                setLetterState(letterState => ({
                  ...letterState,
                  [index]: {
                    ...letterState[index],
                    isBouncing: true,
                    isColored: true,
                  },
                }));
                setTimeout(() => {
                  setLetterState(letterState => ({
                    ...letterState,
                    [index]: {
                      ...letterState[index],
                      isBouncing: false,
                    },
                  }));
                }, kAnimationDuration);
              }}
              onMouseLeave={() => {
                setLetterState(letterState => ({
                  ...letterState,
                  [index]: {
                    ...letterState[index],
                    isColored: false,
                  },
                }));
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        #home {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #letters {
          display: inline-block;
        }
        .letter {
          font-size: 70px;
          color: white;
          font-family: "Oxanium", sans-serif;
          font-weight: 700;
          display: inline-block;
          cursor: default;
          transition: color;
          transition-duration: ${kColorAnimationDuration}ms;
        }
        .letter.bounce {
          animation-name: bounce;
          animation-duration: ${kAnimationDuration}ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .letter.colored {
          color: green;
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
