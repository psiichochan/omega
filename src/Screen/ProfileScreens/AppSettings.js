/* eslint-disable prettier/prettier */
// Import necessary components from React and React Native
import React, {useState, useEffect} from 'react';
import {TabView, TabBar} from 'react-native-tab-view';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ReportsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BasicInfo')}>
        <Text style={styles.buttonText}>Basic Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PaymentMethods')}>
        <Text style={styles.buttonText}>Payment Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#00539C',

    marginVertical: 10,
    borderRadius: 10,
    width: wp(80),
    height: hp(6),
    paddingTop: hp(1),
  },
});
