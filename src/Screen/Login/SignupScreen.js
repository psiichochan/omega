/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleMobileChange = text => {
    // Remove non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the length to 10 digits
    const limitedValue = numericValue.slice(0, 10);

    // Update the state
    setMobile(limitedValue);
  };

  const handleSignup = async () => {
    if (
      !name ||
      !surname ||
      !username ||
      !mobile ||
      !email ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      ToastAndroid.showWithGravity(
        'Please fill in all fields',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      ToastAndroid.showWithGravity(
        'Invalid mobile number format',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.showWithGravity(
        'Invalid email format',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        'Passwords do not match',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/signup';

      const userData = {
        firstName: name,
        lastName: surname,
        username: username,
        mobileNo: mobile,
        email: email,
        address: address,
        password: password,
        confirmPassword: confirmPassword,
      };

      const response = await axios.post(apiUrl, JSON.stringify(userData), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        ToastAndroid.showWithGravity(
          'SignUp Successfully. Please Wait While Admin Approves Your request',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.navigate('Login');
      } else {
        ToastAndroid.showWithGravity(
          response.data,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.signupText}>Sign Up</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="black"
              onChangeText={text => setName(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="black"
              onChangeText={text => setSurname(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Username"
              placeholderTextColor="black"
              onChangeText={text => setUsername(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Mobile No."
              placeholderTextColor="black"
              onChangeText={handleMobileChange}
              value={mobile}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email ID"
              placeholderTextColor="black"
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Address"
              placeholderTextColor="black"
              onChangeText={text => setAddress(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              value={password}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirm Password"
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)}
              value={confirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
            <Text style={styles.signupBtnText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  signupText: {
    fontSize: hp(6),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputView: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  scrollView: {flexGrow: 1},
  inputText: {
    height: 50,
    color: 'black',
  },
  signupBtn: {
    width: '80%',
    backgroundColor: '#00539C',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  signupBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
