import React from "react";
import { NextPage } from "next";

const withPageTransition = (Page: NextPage) => (props) => {
  return <Page {...props} />;
};

export default withPageTransition;
