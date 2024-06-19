/* eslint-disable react-native/no-inline-styles */ /* eslint-disable react/no-unstable-nested-components */ /* eslint-disable prettier/prettier */
// TabNavigator.js

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, View} from 'react-native';
import HomeScreen from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyProfileScreen from './MyProfile';

const Tab = createBottomTabNavigator();

const TabNavigator = ({route}) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [username, setUserName] = useState(';');

  const getUserDetails = async () => {
    const allDetails = await AsyncStorage.getItem('UserDetails');
    const email = JSON.parse(allDetails);
    const hello = email.email === 'rpdhole25@gmail.com' ? true : false;
    setIsAdmin(hello);
    const hello2 = email.username;
    setUserName(hello2);
  };

  useEffect(() => {
    getUserDetails();
  });

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({routes}) => ({
          tabBarIcon: ({}) => {
            let iconName;

            if (routes.name === 'Home') {
              iconName = require('../../../assets/AllImages/home.png');
            } else if (routes.name === 'Profile') {
              iconName = require('../../../assets/AllImages/profile.png');
            }
            return <Image source={iconName} style={{width: 30, height: 30}} />;
          },
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{isAdmin, username}}
          options={{headerShown: false}}
        />

        <Tab.Screen
          name="Profile"
          component={MyProfileScreen}
          initialParams={{isAdmin}}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
