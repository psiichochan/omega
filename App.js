import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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

const Tab = createBottomTabNavigator();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on app start
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const authToken = await AsyncStorage.getItem('UserDetails');
    setIsAuthenticated(!!authToken);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'TabNavigator' : 'Auth'}
        screenOptions={{headerMode: 'none'}}>
        <Stack.Screen name="Auth" component={AuthStack} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
