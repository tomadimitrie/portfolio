import { useEffect } from "react";

export default function useKeyListener(handler: (key: string) => void) {
  useEffect(() => {
    if (!document) {
      return;
    }
    const listener = (event) => {
      handler(event.code);
    };
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
  }, [handler]);
}
