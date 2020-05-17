import React from "react";
import { NextPage } from "next";
import withPageTransition from "../helpers/withPageTransition";

const Contact: NextPage = () => {
  return (
    <div id="contact">
      <style jsx>{`
        #contact {
          width: 100%;
          height: 100%;
          background-color: yellow;
        }
      `}</style>
    </div>
  );
};

export default withPageTransition(Contact);
