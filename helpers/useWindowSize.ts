import React from "react";

const useWindowSize = () => {
  const isClient = typeof window === "object";

  const getWindowSize = () => ({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  });

  const [windowSize, setWindowSize] = React.useState(getWindowSize);

  React.useEffect(() => {
    if (isClient) {
      const handleResize = () => setWindowSize(getWindowSize());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return windowSize;
};

export default useWindowSize;
