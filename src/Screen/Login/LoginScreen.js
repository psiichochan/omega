/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (loginSuccess) {
      navigation.navigate('Parent');

      setLoginSuccess(false);

      setUsername('');
      setPassword('');
      setResetKey(prevKey => prevKey + 1);
    }
  }, [loginSuccess, navigation]);

  const handleLogin = async () => {
    try {
      const requestBody = {
        email: username,
        password: password,
      };
      const response = await axios.post(
        'http://65.2.123.63:8080/api/v1/userController/login',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Login Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        const userDetails = JSON.stringify(response.data);
        await AsyncStorage.setItem('UserDetails', userDetails);

        if (username === 'rpdhole25@gmail.com') {
          const isAdmin = JSON.stringify({isAdmin: true});
          await AsyncStorage.setItem('isAdmin', isAdmin);
        } else {
          const isAdmin = JSON.stringify({isAdmin: true});
          await AsyncStorage.setItem('isAdmin', isAdmin);
        }
        setPassword('');
        setUsername('');

        navigation.navigate('Parent', {
          isAdmin: username === 'rpdhole25@gmail.com' ? true : false,
        });
      } else if (response.status === 401) {
        ToastAndroid.showWithGravity(
          'Please Enter Valid Credentials',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Server Error',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Please Enter Valid Credentials',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.logo}>LOGIN</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email Id"
            placeholderTextColor="black"
            onChangeText={text => setUsername(text)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry
            onChangeText={text => setPassword(text)}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  mainContainer: {flex: 1, justifyContent: 'center'},
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
  },
  signup: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: '10',
    color: 'white',
    fontStyle: 'normal',
  },
  logo: {
    fontSize: hp(6),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: wp(80),
    backgroundColor: '#00539C',
    borderRadius: 25,
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    marginBottom: hp(1),
    bottom: hp(2),
  },
  signupBtn: {
    width: '80%',

    borderRadius: 25,
    paddingLeft: 60,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
