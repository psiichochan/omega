/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function PaymentManagement({navigation}) {
  const navigateToPaymentRequest = () => {
    navigation.navigate('RequestTabs');
  };
  const navigateToUserDetails = () => {
    navigation.navigate('UserDetails');
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.card} onPress={navigateToPaymentRequest}>
        <Text style={styles.cardTitle}>Payment Management</Text>
      </TouchableOpacity>
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
