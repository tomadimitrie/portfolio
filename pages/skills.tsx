import React from "react";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Skills: NextPage = () => {
  return (
    <div id="skills">
      <style jsx>{`
        #skills {
          width: 100%;
          height: 100%;
          background-color: purple;
        }
      `}</style>
    </div>
  );
};

export default withPageTransition(Skills);
