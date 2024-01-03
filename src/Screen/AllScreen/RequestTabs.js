/* eslint-disable prettier/prettier */
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import DonationRequestScreen from './DonationRequest';
import BorrowRequestScreen from './BorrowRequest';

const Tab = createMaterialTopTabNavigator();

const RequestTabs = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'gray',
          style: {backgroundColor: '#00569C'},
          labelStyle: {fontSize: 15, fontWeight: 'bold'},
          indicatorStyle: {backgroundColor: 'white'},
        }}>
        <Tab.Screen name="Donation" component={DonationRequestScreen} />
        <Tab.Screen name="Borrow" component={BorrowRequestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RequestTabs;
