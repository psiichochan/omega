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
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

const HomeScreen = ({route, navigation}) => {
  const [selectedValue, setSelectedValue] = useState('all');

  const [totalDonations, setTotalDonations] = useState('');
  const [totalExpenses, setTotalExpenses] = useState('');
  const [totalBorrow, setTotalBorrow] = useState('');
  const [countOfApprovedUsers, setCountOfApprovedUsers] = useState('');
  const [countOfUnApprovedUsers, setCountOfUnApprovedUsers] = useState('');
  const [countOfPendingUsers, setCountOfPendingUsers] = useState('');
  const [availableExpense, setAvailableExpense] = useState(0);

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
    navigation.navigate('ExpensesScreen', {
      isAdmin: route.params,
    });
  };

  const navigateToBorrowScreen = () => {
    navigation.navigate('BorrowScreen');
  };

  const getApprovedDonations = async () => {
    try {
      const response = await axios.get(
        `http://3.6.89.38:9090/api/v1/donation/get/approved?filter=${selectedValue}`,
      );
      console.log(response.status);
      if (response.status === 200) {
        setTotalDonations(response.data.totalAmount);
        console.log(response.status);
      } else if (response.status === 204) {
        setTotalDonations(0);
      }
    } catch (e) {
      console.log('error in get donations: ', e);
    }
  };

  const getExpenses = async () => {
    const response = await axios.get(
      `http://3.6.89.38:9090/api/v1/expenses/getAll?filter=${selectedValue}`,
    );
    if (response.status === 200) {
      setTotalExpenses(response.data.totalAmount);
    } else if (response.status === 204) {
      setTotalExpenses(0);
    }
  };

  const getApprovedBorrow = async () => {
    const response = await axios.get(
      `http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=${selectedValue}`,
    );
    if (response.status === 200) {
      setTotalBorrow(response.data.totalAmount);
    } else if (response.status === 204) {
      setTotalBorrow(0);
    }
  };

  const GetUserCount = async () => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/userController/user/filter?filter=${selectedValue}`;

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const countOfApprovedUsers1 = response.data['Approved Users'].length;
        const countOfUnApprovedUsers1 =
          response.data['Unapproved Users'].length;
        const countOfPendingUsers1 = response.data['Pending Users'].length;
        setCountOfApprovedUsers(countOfApprovedUsers1);
        setCountOfUnApprovedUsers(countOfUnApprovedUsers1);
        setCountOfPendingUsers(countOfPendingUsers1);
      }
    } catch (error) {
      console.log('this is error while fetching users count==> ', error);
    }
  };

  useEffect(() => {
    getApprovedDonations();
    getExpenses();
    getApprovedBorrow();
    GetUserCount();
    calculateAvailableExpense();
  }, [selectedValue]);

  const calculateAvailableExpense = async () => {
    if (
      totalDonations !== undefined &&
      totalBorrow !== undefined &&
      totalExpenses !== undefined
    ) {
      const adminAvailableExpense =
        totalDonations - totalBorrow - totalExpenses;
      setAvailableExpense(adminAvailableExpense);
    }
  };
  console.log('available balance: ', availableExpense);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View>
        <RNPickerSelect
          placeholder={{
            label: 'Select Filter',
            value: null,
            color: 'black',
            fontWeight: 'bold',
          }}
          onValueChange={value => setSelectedValue(value)}
          items={[
            {label: 'Today', value: 'day', color: 'black'},
            {label: 'Weekly', value: 'week', color: 'black'},
            {label: 'Monthly', value: 'month', color: 'black'},
            {label: 'All', value: 'all', color: 'black'},
          ]}
        />
        <View style={{marginTop: 0}}>
          <Text
            style={[
              styles.totalValues,
              {
                alignSelf: 'center',
                backgroundColor: 'white',
                fontSize: hp(2.8),
                paddingTop: hp(1.2),
                color: 'black',
              },
            ]}>
            Payments
          </Text>
          <Text
            style={[
              styles.totalValues,
              {alignSelf: 'center', backgroundColor: '#00539c'},
            ]}>
            Available Balance: Rs. {availableExpense}
          </Text>
          <Text style={[styles.totalValues, {backgroundColor: 'green'}]}>
            Donations: Rs. {totalDonations}
          </Text>

          <Text style={[styles.totalValues, {backgroundColor: 'red'}]}>
            Expenses: Rs. {totalExpenses}
          </Text>
          <Text
            style={[
              styles.totalValues,
              {alignSelf: 'center', backgroundColor: 'orange'},
            ]}>
            Borrow: Rs. {totalBorrow}
          </Text>
        </View>
        <View
          style={[
            {
              borderColor: 'black',
              borderWidth: 2,
              width: wp(58),
              borderRadius: 3,
              alignSelf: 'center',
              marginTop: hp(2),
            },
          ]}
        />
        <Text
          style={[
            styles.totalValues,
            {
              alignSelf: 'center',
              backgroundColor: 'white',
              fontSize: hp(2.8),
              paddingTop: hp(1.2),
              color: 'black',
            },
          ]}>
          Member's
        </Text>

        <Text style={[styles.totalValues, {backgroundColor: '#3d3a3a'}]}>
          Approved User's: {countOfApprovedUsers}
        </Text>
        <Text style={[styles.totalValues, {backgroundColor: '#3d3a3a'}]}>
          Unapproved User's: {countOfUnApprovedUsers}
        </Text>
        <Text
          style={[
            styles.totalValues,
            {alignSelf: 'center', backgroundColor: '#3d3a3a'},
          ]}>
          Pending User's: {countOfPendingUsers}
        </Text>
      </View>
      <View
        style={[
          {
            borderColor: 'black',
            borderWidth: 2,
            width: wp(58),
            borderRadius: 3,
            alignSelf: 'center',
            marginTop: hp(2),
          },
        ]}
      />
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#00539C',
    // paddingVertical: 15,
    // paddingHorizontal: 30,
    // marginVertical: 10,
    borderRadius: 10,
    width: wp(30),
    height: hp(5),
    alignItems: 'center', // Fix the typo here
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: hp(1),
  },
  totalValues: {
    fontSize: hp(2.3),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#00539C',
    width: wp(95),
    height: hp(6),
    paddingTop: hp(1.2),
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
