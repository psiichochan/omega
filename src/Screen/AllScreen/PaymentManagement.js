/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PaymentManagement({navigation}) {
  const navigateToPaymentRequest = () => {
    navigation.navigate('RequestTabs');
  };
  const navigateToUserDetails = () => {
    navigation.navigate('UserDetails');
  };

  const [isAdmin, setIsAdmin] = useState(null);

  const getUserDetails = async () => {
    const userDetails1 = await AsyncStorage.getItem('UserDetails');
    const allDetails = JSON.parse(userDetails1);
    const hello = allDetails.email === 'rpdhole25@gmail.com' ? true : false;
    console.log('hello :', hello);
    setIsAdmin(hello);
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <View style={styles.mainContainer}>
      {isAdmin === true ? (
        <TouchableOpacity
          style={styles.card}
          onPress={navigateToPaymentRequest}>
          <Text style={styles.cardTitle}>Payment Management</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <TouchableOpacity style={styles.card} onPress={navigateToUserDetails}>
        <Text style={styles.cardTitle}>Member History</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PaymentManagement;

const styles = StyleSheet.create({
  card: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
