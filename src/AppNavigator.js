/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './Screen/Navigation/DrawerNavigator';
import FirstScreen from './Screen/AllScreen/FirstScreen';
import LoginScreen from './Screen/Login/LoginScreen';
import SignupScreen from './Screen/Login/SignupScreen';
import DonationsScreen from './Screen/AllScreen/DonationScreen';
import ExpensesScreen from './Screen/AllScreen/ExpensesScreeen';
import BorrowScreen from './Screen/AllScreen/BorrowScreen';
import PaymentManagement from './Screen/AllScreen/PaymentManagement';
import PaymentMethods from './Screen/ProfileScreens/PaymentMethods';
import PaymentQRScreen from './Screen/AllScreen/PaymentQRScreen';
import MemberDetails from './Screen/ProfileScreens/MemberDetails';
import MemberManagement from './Screen/AllScreen/MemberManagement';
import MemberRequest from './Screen/AllScreen/MemberRequest';
import ReportsScreen from './Screen/Reports/ReportsScreen';
import DonationHistoryScreen from './Screen/UserHistory/DonationHistoryScreen';
import DonationReportsScreen from './Screen/AllScreen/DonationReportsScreen';
import DonationRequestScreen from './Screen/AllScreen/DonationRequest';
import ExpenseReportsScreen from './Screen/AllScreen/ExpenseReportsScreen';
import BorrowHistoryScreen from './Screen/UserHistory/BorrowHistoryScreen';
import BorrowRequestScreen from './Screen/AllScreen/BorrowRequest';
import BorrowScreenReports from './Screen/AllScreen/BorrowScreenReports';
import ProfileScreen from './Screen/AllScreen/ProfileScreen';
import MyProfileScreen from './Screen/AllScreen/MyProfile';
import SendMessageScreen from './Screen/Notification/SendMessageScreen';
import BasicInfo from './Screen/AppSettings/BasicInfo';
import RequestTabs from './Screen/AllScreen/RequestTabs';
import UserDetails from './Screen/UserHistory/UserDetailsScreen';

const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen
          name="Parent"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DonationsScreen"
          component={DonationsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ExpensesScreen"
          component={ExpensesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BorrowScreen"
          component={BorrowScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RequestTabs"
          component={RequestTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentManagement"
          component={PaymentManagement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentMethods"
          component={PaymentMethods}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentQRScreen"
          component={PaymentQRScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SendMessageScreen"
          component={SendMessageScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MemberDetails"
          component={MemberDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MemberManagement"
          component={MemberManagement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MemberRequest"
          component={MemberRequest}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BasicInfo"
          component={BasicInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReportsScreen"
          component={ReportsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DonationHistoryScreen"
          component={DonationHistoryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DonationReportsScreen"
          component={DonationReportsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DonationRequestScreen"
          component={DonationRequestScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ExpenseReportsScreen"
          component={ExpenseReportsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BorrowHistoryScreen"
          component={BorrowHistoryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BorrowRequestScreen"
          component={BorrowRequestScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BorrowScreenReports"
          component={BorrowScreenReports}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
