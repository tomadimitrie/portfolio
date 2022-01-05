import "tailwindcss/tailwind.css";
import "tuicss/dist/tuicss.min.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "/styles/globals.css";
import clsx from "clsx";
import { useRouter } from "next/router";
import useKeyListener from "../hooks/useKeyListener";
import { useState } from "react";

dynamic(() => import("tuicss/dist/tuicss.min.js"), { ssr: false });

const ITEMS: { name: string; href: string }[] = [
  {
    name: "Main",
    href: "/",
  },
  {
    name: "Skills",
    href: "/skills",
  },
  {
    name: "Experience",
    href: "/experience",
  },
  {
    name: "Projects",
    href: "/projects",
  },
];

let changeMenu: ((forward: boolean) => void) | null = null;
let showHelpModal: (() => void) | null = null;

const HELP_ITEMS: {
  name: string;
  key: string;
  value: string;
  handler: () => void;
}[] = [
  {
    name: "F1",
    key: "F1",
    value: "Help",
    handler: () => {
      showHelpModal();
    },
  },
  {
    name: "←",
    key: "ArrowLeft",
    value: "Previous Menu",
    handler: () => {
      changeMenu(false);
    },
  },
  {
    name: "→",
    key: "ArrowRight",
    value: "Next Menu",
    handler: () => {
      changeMenu(true);
    },
  },
  {
    name: "Esc",
    key: "Escape",
    value: "Exit",
    handler: () => {
      window.location.href = "/shutdown";
    },
  },
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isHelpModalShown, setIsHelpModalShown] = useState(false);

  useKeyListener((key) => {
    HELP_ITEMS.find((item) => item.key === key)?.handler();
  });

  changeMenu = (forward: boolean) => {
    const currentMenu = ITEMS.findIndex((item) => item.href === router.asPath);
    if (currentMenu === -1) {
      return;
    }
    let nextMenu: number;
    if (forward) {
      nextMenu = currentMenu + 1;
    } else {
      nextMenu = currentMenu - 1;
    }
    if (nextMenu === ITEMS.length) {
      nextMenu = 0;
    }
    if (nextMenu === -1) {
      nextMenu = ITEMS.length - 1;
    }
    return router.push(ITEMS[nextMenu].href);
  };

  showHelpModal = () => setIsHelpModalShown(true);

  if (router.asPath === "/shutdown") {
    return (
      <div className="tui-screen bordered white-168 w-full h-full flex flex-col items-center justify-center">
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <>
      {isHelpModalShown && (
        <div className="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center">
          <div className="tui-panel white-168 black-255-text">
            <div className="tui-panel-header">Hey</div>
            <div className="tui-panel-content">You found me!</div>
            <div className="center">
              <button
                className="tui-button white-255"
                onClick={() => setIsHelpModalShown(false)}
              >
                Bye
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="tui-screen bordered white-168 w-full h-full flex flex-col">
        <div className="tui-panel cyan-168 full-width black-255-text tui-no-shadow center">
          PORTFOLIO
        </div>
        <div className="tui-tabs">
          <ul>
            {ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  className={clsx([
                    "tui-tab",
                    item.href === router.asPath && "active",
                  ])}
                  href={item.href}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 overflow-y-scroll">
          <Component {...pageProps} />
        </div>
        <div className="tui-statusbar absolute cyan-168">
          <ul>
            {HELP_ITEMS.map((item) => (
              <li key={item.key}>
                <span className="white-255-text">{item.name}</span> {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
