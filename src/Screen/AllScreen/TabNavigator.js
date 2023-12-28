// TabNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./ProfileScreen";
import { Image, View } from "react-native";
import HomeScreen from "./HomeScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  const { isAdmin, username } = route.params;

  console.log(route);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({}) => {
            let iconName;

            if (route.name === "Home") {
              iconName = require("../../../assets/AllImages/home.png");
            } else if (route.name === "Profile") {
              iconName = require("../../../assets/AllImages/profile.png");
            }
            return (
              <Image source={iconName} style={{ width: 30, height: 30 }} />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ isAdmin, username }}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ isAdmin }}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
