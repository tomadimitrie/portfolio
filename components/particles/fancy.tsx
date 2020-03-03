import React from "react";
import WebGLView from "./WebGLView";

const Fancy = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const webgl = React.useRef<WebGLView>();

  const animate = () => {
    webgl.current.update();
    webgl.current.draw();
    requestAnimationFrame(animate);
  };

  const resize = () => {
    webgl.current.resize();
  };

  React.useEffect(() => {
    webgl.current = new WebGLView(ref);
    ref.current.appendChild(webgl.current.renderer.domElement);
    animate();
    resize();
    window.addEventListener("resize", resize);
  }, []);

  return (
    <>
      <div ref={ref} id="particles" />
      <style jsx>{`
        #particles {
          width: 100vw;
          height: calc(100vh - 50px);
        }
      `}</style>
    </>
  );
};

export default Fancy;
