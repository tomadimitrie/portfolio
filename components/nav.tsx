import React from "react";

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

const Nav = () => {
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(2);
  return (
    <>
      <div id="nav">
        {tabs.map((tab: Tab, index: number) => (
          <div
            className={`tab ${index === currentTabIndex && "activeTab"}`}
            key={tab.name}
          >
            <i className={`fa fa-${tab.icon}`} /> {tab.name}
          </div>
        ))}
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
        .tab {
          color: gray;
          font-family: "Oxanium";
          font-weight: 700;
          font-size: 15px;
        }
        .activeTab {
          color: white;
        }
      `}</style>
    </>
  );
};

export default Nav;
