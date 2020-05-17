import React from "react";
import useWindowSize from "../helpers/useWindowSize";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Router, { useRouter } from "next/router";

type Tab = {
  name: string;
  icon: string;
  href?: string;
};

const tabs: Tab[] = [
  {
    name: "about",
    icon: "user",
  },
  {
    name: "projects",
    icon: "list",
  },
  {
    name: "home",
    icon: "home",
    href: "",
  },
  {
    name: "skills",
    icon: "cogs",
  },
  {
    name: "contact",
    icon: "id-card",
  },
];

const Nav = () => {
  // prettier-ignore
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number | null>(null);
  const windowSize = useWindowSize();
  const router = useRouter();

  React.useEffect(() => {
    const onRouteChange = (url: string) => {
      const name = url.substr(1);
      const index = tabs.findIndex(
        (tab: Tab) => tab.name === name || tab.href === name
      );
      if (index !== -1) {
        setCurrentTabIndex(index);
      }
    };
    Router.events.on("routeChangeStart", onRouteChange);
    onRouteChange(router.pathname);
    return () => {
      Router.events.off("routeChangeStart", onRouteChange);
    };
  }, []);

  const variants = {
    icon: {
      idle: {
        color: "rgba(255, 255, 255, 0.5)",
      },
      active: {
        color: "rgba(255, 255, 255, 1)",
        transition: {
          duration: 0,
        },
      },
    },
    text: {
      hidden: {
        maxWidth: 0,
      },
      shown: {
        maxWidth: "100%",
        transition: {
          duration: 1,
        },
      },
      exiting: {
        maxWidth: 0,
      },
    },
  };

  const onTabClick = (tab: Tab) => {
    Router.push(`/${tab.href ?? tab.name}`);
  };

  const renderTab = (tab: Tab, index: number) => {
    return (
      <React.Fragment key={tab.name}>
        <div className="tab" onClick={() => onTabClick(tab)}>
          <motion.i
            className={`fa fa-${tab.icon} tab-icon`}
            variants={variants.icon}
            animate={index === currentTabIndex ? "active" : "idle"}
            whileHover={{
              color: "rgba(255, 255, 255, 1)",
            }}
          />
          <AnimatePresence>
            {windowSize.width > 600 && index === currentTabIndex && (
              <motion.div
                variants={variants.text}
                initial="hidden"
                animate="shown"
                exit="exiting"
                className="tab-text"
              >
                {tab.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <style jsx>{`
          .tab {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            font-size: 20px;
            width: 20vw;
          }
          :global(.tab-icon) {
            margin: 0 10px;
            width: 20px;
          }
          :global(.tab-text) {
            color: white;
            font-family: "Oxanium", sans-serif;
            font-weight: 700;
            text-overflow: clip;
            white-space: nowrap;
            overflow: hidden;
          }
        `}</style>
      </React.Fragment>
    );
  };

  return (
    <>
      <div id="nav">
        {tabs.map((tab: Tab, index: number) => renderTab(tab, index))}
      </div>
      <style jsx>{`
        #nav {
          width: calc(100% - 40px);
          height: 50px;
          border-bottom: 1px solid gray;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          padding: 0 20px;
        }
      `}</style>
    </>
  );
};

export default Nav;
