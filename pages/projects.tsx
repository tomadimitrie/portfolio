import React from "react";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Projects: NextPage = () => {
  return (
    <div id="projects">
      <style jsx>{`
        #projects {
          width: 100%;
          height: 100%;
          background-color: blue;
        }
      `}</style>
    </div>
  );
};

export default withPageTransition(Projects);
