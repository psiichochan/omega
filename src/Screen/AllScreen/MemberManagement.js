/* eslint-disable prettier/prettier */
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import MemberRequest from './MemberRequest';
import MemberDetails from '../ProfileScreens/MemberDetails';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Tab = createMaterialTopTabNavigator();

const MemberManagement = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'gray',
          style: {backgroundColor: '#00569C'},
          labelStyle: {fontSize: hp(1.4), fontWeight: 'bold'},
          indicatorStyle: {backgroundColor: 'white'},
        }}>
        <Tab.Screen name="Member Request" component={MemberRequest} />
        <Tab.Screen name="Member Details" component={MemberDetails} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MemberManagement;
