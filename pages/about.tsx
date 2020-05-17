import React from "react";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const About: NextPage = () => {
  return (
    <div id="about">
      <style jsx>{`
        #about {
          width: 100%;
          height: 100%;
          background-color: green;
        }
      `}</style>
    </div>
  );
};

export default withPageTransition(About);
