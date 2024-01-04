/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';

const HomeScreen = ({route, navigation}) => {
  const {isAdmin} = route.params;

  const [totalDonations, setTotalDonations] = useState('');
  const [totalExpenses, setTotalExpenses] = useState('');
  const [totalBorrow, setTotalBorrow] = useState('');
  const [routes] = useState([
    {key: 'donations', title: 'Donations'},
    {key: 'expenses', title: 'Expenses', params: isAdmin},
    {key: 'borrow', title: 'Borrow'},
  ]);

  useEffect(() => {
    const backAction = () => {
      // Disable the hardware back button on the HomeScreen
      if (navigation.isFocused()) {
        return true; // Disable back button on the HomeScreen
      }
      return false; // Allow back button on other screens
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Cleanup the event listener when the component is unmounted
    return () => backHandler.remove();
  }, [navigation]);
  const navigateToDonationScreen = () => {
    navigation.navigate('DonationsScreen');
  };

  const navigateToExpensesScreen = () => {
    navigation.navigate('ExpenseScreen', {
      isAdmin: route.params,
    });
  };

  const navigateToBorrowScreen = () => {
    navigation.navigate('BorrowScreen');
  };

  const getApprovedDonations = async () => {
    const response = await axios.get(
      'http://3.6.89.38:9090/api/v1/donation/get/approved?filter=all',
    );
    if (response.status === 200) {
      setTotalDonations(response.data.totalAmount);
      console.log(totalDonations);
    }
  };

  const getExpenses = async () => {
    const response = await axios.get(
      'http://3.6.89.38:9090/api/v1/expenses/getAll?filter=all',
    );
    if (response.status === 200) {
      setTotalExpenses(response.data.totalAmount);
    }
  };

  const getApprovedBorrow = async () => {
    const response = await axios.get(
      'http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=all',
    );
    if (response.status === 200) {
      setTotalBorrow(response.data.totalAmount);
    }
  };

  useEffect(() => {
    getApprovedDonations();
    getExpenses();
    getApprovedBorrow();
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: hp(5),
        }}>
        <View
          style={{
            height: hp(7),
            width: wp(48),
            borderColor: 'black',
            borderRadius: 10,
            // borderWidth: 0.1,
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#00539C',
            paddingTop: hp(2),
          }}>
          <Text
            style={{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 15,
              color: 'white',
            }}>
            Approved Donations: {totalDonations}
          </Text>
        </View>
        <View
          style={{
            height: hp(7),
            width: wp(48),
            borderColor: 'black',
            borderRadius: 10,
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#00539C',
            paddingTop: hp(2),
          }}>
          <Text
            style={{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 15,
              color: 'white',
            }}>
            Total Expenses: {totalExpenses}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: hp(7),
          width: wp(48),
          borderColor: 'black',
          borderRadius: 10,
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#00539C',
          paddingTop: hp(1),
          marginTop: hp(2),
        }}>
        <Text
          style={{
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 15,
            top: 10,
            color: 'white',
          }}>
          Approved Borrow: {totalBorrow}
        </Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDonationScreen}>
          <Text style={styles.buttonText}>Donation's</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToExpensesScreen}>
          <Text style={styles.buttonText}>Expense's</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToBorrowScreen}>
          <Text style={styles.buttonText}>Borrow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00539C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    width: wp(90),
    height: hp(15),
    alignItems: 'center', // Fix the typo here
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: hp(3),
  },
});
