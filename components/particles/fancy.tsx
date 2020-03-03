import React from "react";
import WebGLView from "./WebGLView";

const Fancy = () => {
  const ref = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    new WebGLView(ref);
  }, []);

  return <div ref={ref} />;
};

export default Fancy;
