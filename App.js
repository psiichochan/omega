/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/AppNavigator';

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
