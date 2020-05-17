import React from "react";
import { NextPage } from "next";
import { motion } from "framer-motion";

const withPageTransition = (Page: NextPage) => props => {
  const variants = {
    initial: {
      opacity: 0,
    },
    shown: {
      opacity: 1,
    },
    exiting: {
      opacity: 0,
    },
  };
  return (
    <>
      <motion.div
        initial={variants.initial}
        animate={variants.shown}
        exit={variants.exiting}
        className="page-transition-wrapper"
      >
        <Page {...props} />
      </motion.div>
      <style jsx>{`
        :global(.page-transition-wrapper) {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default withPageTransition;
