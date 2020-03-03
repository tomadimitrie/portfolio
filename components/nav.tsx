import React from "react";
import Constants from "../constants";

type Tab = {
  name: string;
  icon: string;
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

const kAnimationDuration = 1000;

const Nav = () => {
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(2);
  // prettier-ignore
  const [previousTabIndex, setPreviousTabIndex] = React.useState<number | null>(null);

  const renderTab = (tab: Tab, index: number) => {
    return (
      <React.Fragment key={tab.name}>
        <div
          className="tab"
          onClick={() => {
            setPreviousTabIndex(currentTabIndex);
            setTimeout(() => {
              setCurrentTabIndex(index);
            }, kAnimationDuration);
          }}
        >
          <i className={`fa fa-${tab.icon} tab-icon`} />
          {index === currentTabIndex && (
            <div
              className={`tab-text ${index === previousTabIndex &&
                "tab-text-exit"}`}
            >
              {tab.name}
            </div>
          )}
        </div>
        <style jsx>{`
          .tab {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            color: ${index === currentTabIndex ? "white" : "gray"};
            font-size: 20px;
            width: 20vw;

            &:hover {
              color: white;
              transition: color ${kAnimationDuration}ms;
            }
          }
          .tab-icon {
            margin: 0 10px;
            width: 20px;
          }
          .tab-text {
            font-family: "Oxanium", sans-serif;
            font-weight: 700;
            animation: reveal forwards;
            /* styled-jsx bug? interpolation for duration inside animation shorthand compiles into jsx tag string instead of the number itself */
            animation-duration: ${kAnimationDuration}ms;
            text-overflow: clip;
            white-space: nowrap;
            overflow: hidden;
          }
          .tab-text-exit {
            animation-name: exit;
          }
          @keyframes reveal {
            from {
              max-width: 0;
            }
            to {
              max-width: 100%;
            }
          }
          @keyframes exit {
            from {
              max-width: 100%;
            }
            to {
              max-width: 0;
            }
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
          height: ${Constants.navHeight}px;
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
