/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BasicInfo = ({navigation}) => {
  // Initial state for email, contact number, and address
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');

  const retrieveObject = async UserDetails => {
    try {
      const jsonValue = await AsyncStorage.getItem(UserDetails);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving object:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      const retrievedUserData = await retrieveObject('UserDetails');
      console.log(retrievedUserData);

      if (retrievedUserData) {
        setEmail(retrievedUserData.email || 'N/A');
        setContactNumber(retrievedUserData.mobileNo || 'N/A');
        setAddress(retrievedUserData.address || 'N/A');
      }
    };

    fetchUserDetails();
  }, []);

  const updateUserDetails = async () => {
    const apiUrl = 'http://3.6.89.38:9090/api/v1/userController/update';
    const retrievedUserData = await retrieveObject('UserDetails');
    const requestBody = {
      id: retrievedUserData.id,
      username: retrievedUserData.username,
      email: email,
      password: retrievedUserData.password,
      firstName: retrievedUserData.firstName,
      lastName: retrievedUserData.lastName,
      mobileNo: contactNumber,
      address: address,
      confirmPassword: retrievedUserData.confirmPassword,
      approved: true,
    };

    const response = await axios.put(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log(response.data);
    }

    console.log('data: ', retrievedUserData);
  };

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handleContactNumberChange = text => {
    setContactNumber(text);
  };

  const handleAddressChange = text => {
    setAddress(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={handleEmailChange}
      />

      <Text style={styles.label}>Contact Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Number"
        value={contactNumber}
        onChangeText={handleContactNumberChange}
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Address"
        value={address}
        onChangeText={handleAddressChange}
      />

      <Button
        title="Save Changes"
        onPress={updateUserDetails}
        color="#00539C"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // marginTop: hp(5),
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BasicInfo;
