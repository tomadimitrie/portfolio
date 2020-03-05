import React from "react";
import WebGLApp from "./WebGLApp";

const Projection = () => {
  const ref = React.useRef<HTMLCanvasElement>();

  React.useEffect(() => {
    new WebGLApp(ref.current);
  }, []);

  return <canvas ref={ref} />;
};

export default Projection;
