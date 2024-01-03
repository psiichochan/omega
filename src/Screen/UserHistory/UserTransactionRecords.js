/* eslint-disable prettier/prettier */
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DonationHistoryScreen from './DonationHistoryScreen'; // Create this component
import BorrowHistoryScreen from './BorrowHistoryScreen'; // Create this component

const Tab = createMaterialTopTabNavigator();

function UserTransactionRecords({route}) {
  const userId = route.params.id;
  const userName = route.params.username;
  console.log('userId: ', userId, userName);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Donation History" options={{title: 'Donation History'}}>
        {() => <DonationHistoryScreen userId={userId} userName={userName} />}
      </Tab.Screen>
      <Tab.Screen name="Borrow History" options={{title: 'Borrow History'}}>
        {() => <BorrowHistoryScreen userId={userId} userName={userName} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default UserTransactionRecords;
