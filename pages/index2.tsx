import React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
const Projection = dynamic(
  () => import("../components/projection/projection"),
  {
    ssr: false,
  }
);

const Index2: NextPage = () => {
  return <Projection />;
};

export default Index2;
