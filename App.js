/* eslint-disable prettier/prettier */
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
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
import FirstScreen from './src/Screen/AllScreen/FirstScreen';
import MyProfileScreen from './src/Screen/AllScreen/MyProfile';
import MemberManagement from './src/Screen/AllScreen/MemberManagement';
import PaymentManagement from './src/Screen/AllScreen/PaymentManagement';
import UserDetailsList from './src/Screen/Reports/UserDetailsList';
import AppNavigator from './src/AppNavigator';

const Stack = createStackNavigator();

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  useEffect(() => {
    const handleGetToken = async () => {
      try {
        const data = await AsyncStorage.getItem('UserDetails');
        if (data) {
          setUserLoggedIn(true);
        } else {
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error('Error retrieving user details:', error);
        setUserLoggedIn(false);
      }
    };

    handleGetToken();
  }, []);

  if (userLoggedIn === null) {
    return null;
  }

  return <AppNavigator />;
};

export default App;
