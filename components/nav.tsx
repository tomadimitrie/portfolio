import React from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import Router, { useRouter } from "next/router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDimensions } from "react-native-web-hooks";

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

const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5);

const Nav = () => {
  // prettier-ignore
  const { window } = useDimensions();
  const router = useRouter();

  const colorAnims = Array.from(
    { length: tabs.length },
    () => React.useState(new Animated.Value(0))[0]
  );

  const colors = colorAnims.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["gray", "white"],
    })
  );

  const widthAnims = Array.from(
    { length: tabs.length },
    () => React.useState(new Animated.Value(0))[0]
  );

  const widths = widthAnims.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    })
  );

  const animate = (index, value) => {
    Animated.parallel([
      Animated.timing(colorAnims[index], {
        toValue: value,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(widthAnims[index], {
        toValue: value,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    const onRouteChange = (url: string) => {
      const name = url.substr(1);
      const index = tabs.findIndex(
        (tab: Tab) => tab.name === name || tab.href === name
      );
      if (index !== -1) {
        Array.from({ length: tabs.length }, (x, i) => i).forEach((i) =>
          animate(i, index === i)
        );
      }
    };
    Router.events.on("routeChangeStart", onRouteChange);
    onRouteChange(router.pathname);
    return () => {
      Router.events.off("routeChangeStart", onRouteChange);
    };
  }, []);

  const onTabClick = (tab: Tab) => {
    Router.push(`/${tab.href ?? tab.name}`);
  };

  const renderTab = (tab: Tab, index: number) => {
    return (
      <Pressable
        key={tab.name}
        style={styles.tab}
        onPress={() => onTabClick(tab)}
      >
        <AnimatedFontAwesome5 name={tab.icon} size={24} color={colors[index]} />
        {window.width > 800 && (
          <Animated.Text style={[styles.tabText, { maxWidth: widths[index] }]}>
            {tab.name}
          </Animated.Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.nav}>
      {tabs.map((tab: Tab, index: number) => renderTab(tab, index))}
    </View>
  );
};

export default Nav;

const styles = StyleSheet.create({
  nav: {
    backgroundColor: "black",
    height: 50,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "gray",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  tab: {
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabIcon: {
    marginHorizontal: 10,
    width: 20,
  },
  tabText: {
    color: "white",
    fontFamily: "Oxanium_700Bold",
    fontSize: 20,
    paddingLeft: 10,
    textOverflow: "clip",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
});
