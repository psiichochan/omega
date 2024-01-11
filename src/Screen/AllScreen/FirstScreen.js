/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function FirstScreen({navigation}) {
  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    const loggedIn = async () => {
      const userDetails = await AsyncStorage.getItem('UserDetails');
      if (userDetails) {
        setImmediate(() => {
          navigation.navigate('Parent');
        });
      }
    };
    loggedIn();
  });

  return (
    <View>
      <View style={styles.innerContainer}>
        <Text style={styles.welcome}>Welcome To Club</Text>
        <Text style={styles.alpha}>Alpha & Omega</Text>
      </View>
      <View style={{marginTop: hp(15)}}>
        <TouchableOpacity style={styles.card} onPress={navigateToLogin}>
          <Text style={styles.cardTitle}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.cardTitle}>Signup</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rights}>
        <Text style={styles.text}>All Rights Reserved</Text>
        <Text style={styles.text}>Design & Developed by</Text>
        <Text style={styles.text}>Tech Way Online</Text>
      </View>
    </View>
  );
}

export default FirstScreen;

const styles = StyleSheet.create({
  innerContainer: {
    marginTop: hp(10),
  },
  welcome: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: hp(4),
    textAlign: 'center',
  },
  alpha: {
    color: 'black',
    fontSize: hp(4),
    fontWeight: '800',
    textAlign: 'center',
  },
  card: {
    width: wp(80),
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: 'white',
  },
  text: {fontSize: hp(2), color: 'black', fontWeight: '600'},
  rights: {alignItems: 'center', marginTop: hp(30)},
});
