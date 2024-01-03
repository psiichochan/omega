/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/Screen/Login/LoginScreen';
import SignupScreen from './src/Screen/Login/SignupScreen';
import TabNavigator from './src/Screen/AllScreen/TabNavigator';
import PaymentQRScreen from './src/Screen/AllScreen/PaymentQRScreen';
import MemberRequest from './src/Screen/AllScreen/MemberRequest';
import AppSetting from './src/Screen/ProfileScreens/AppSettings';
import PaymentMethods from './src/Screen/ProfileScreens/PaymentMethods';
import RequestTabs from './src/Screen/AllScreen/RequestTabs';
import ReportsScreen from './src/Screen/Reports/ReportsScreen';
import DonationRequestScreen from './src/Screen/AllScreen/DonationRequest';
import BorrowRequestScreen from './src/Screen/AllScreen/BorrowRequest';
import BorrowScreen from './src/Screen/AllScreen/BorrowScreen';
import ExpensesScreen from './src/Screen/AllScreen/ExpensesScreeen';
import DonationsScreen from './src/Screen/AllScreen/DonationScreen';
import MemberDetails from './src/Screen/ProfileScreens/MemberDetails';
import BorrowScreenReports from './src/Screen/AllScreen/BorrowScreenReports';
import DonationReportsScreen from './src/Screen/AllScreen/DonationReportsScreen';
import ExpenseReportsScreen from './src/Screen/AllScreen/ExpenseReportsScreen';
import UserDetails from './src/Screen/UserHistory/UserDetailsScreen';
import UserTransactionRecords from './src/Screen/UserHistory/UserTransactionRecords';
import BasicInfo from './src/Screen/AppSettings/BasicInfo';
import SendMessageScreen from './src/Screen/Notification/SendMessageScreen';
import NotificationScreen from './src/Screen/Notification/NotificationScreen';

const Stack = createStackNavigator();

const AuthStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    const handleGetToken = async () => {
      const data = await AsyncStorage.getItem('UserDetails');
      if (!data) {
        useNavigation.replace('Login');
      } else {
        useNavigation.replace('TabNavigator');
      }
    };

    setTimeout(() => {
      handleGetToken();
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerMode: 'none'}}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Payment" component={PaymentQRScreen} />
        <Stack.Screen name="MemberRequest" component={MemberRequest} />
        <Stack.Screen name="RequestTabs" component={RequestTabs} />
        <Stack.Screen name="AppSetting" component={AppSetting} />
        <Stack.Screen
          name="DonationRequestScreen"
          component={DonationRequestScreen}
        />
        <Stack.Screen
          name="BorrowRequestScreen"
          component={BorrowRequestScreen}
        />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="DonationsScreen" component={DonationsScreen} />
        <Stack.Screen name="ExpenseScreen" component={ExpensesScreen} />
        <Stack.Screen name="BorrowScreen" component={BorrowScreen} />
        <Stack.Screen name="MemberDetails" component={MemberDetails} />
        <Stack.Screen
          name="BorrowScreenReports"
          component={BorrowScreenReports}
        />
        <Stack.Screen
          name="DonationReportsScreen"
          component={DonationReportsScreen}
        />
        <Stack.Screen
          name="ExpenseReportsScreen"
          component={ExpenseReportsScreen}
        />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen
          name="UserTransactionRecords"
          component={UserTransactionRecords}
        />
        <Stack.Screen name="BasicInfo" component={BasicInfo} />
        <Stack.Screen name="SendMessageScreen" component={SendMessageScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
