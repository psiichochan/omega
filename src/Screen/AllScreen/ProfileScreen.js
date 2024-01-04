/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ScrollView} from 'react-native-gesture-handler';

function ProfileScreen({route}) {
  const navigation = useNavigation();

  const [userDetails, setUserDetails] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  const getUserDetails = async () => {
    const userDetails1 = await AsyncStorage.getItem('UserDetails');
    const allDetails = JSON.parse(userDetails1);
    const hello = allDetails.email === 'rpdhole25@gmail.com' ? true : false;
    setIsAdmin(hello);
    setUserDetails(allDetails);
  };
  useEffect(() => {
    getUserDetails();
  });

  const navigateToAbout = () => {
    Alert.alert(
      'About',
      'Yet to add about.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  };

  const navigateToMemberRequest = () => {
    navigation.navigate('MemberRequest');
  };

  const navigateToNotificationScreen = () => {
    navigation.navigate('NotificationScreen');
  };

  const navigateToPaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };

  const navigateToAppSettings = () => {
    navigation.navigate('BasicInfo');
  };

  const navigateToReports = () => {
    navigation.navigate('Reports');
  };

  const navigateToMemberDetails = () => {
    navigation.navigate('MemberDetails');
  };
  const navigateToUserDetails = () => {
    navigation.navigate('UserDetails');
  };

  const navigateToPaymentRequest = () => {
    navigation.navigate('RequestTabs');
  };

  const navigateToSendMessageScreen = () => {
    navigation.navigate('SendMessageScreen');
  };
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, sure',
          onPress: async () => {
            try {
              navigation.navigate('Auth'); // Navigate to 'Auth' after logout
              await AsyncStorage.removeItem('UserDetails');
            } catch (error) {
              console.error('Error clearing UserDetails:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  console.log('this is Admin: ', isAdmin);
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={require('../../../assets/AllImages/profilePic.jpg')}
        />

        {/* About Section */}
        <TouchableOpacity style={styles.card} onPress={navigateToAbout}>
          <Text style={styles.cardTitle}>About</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToPaymentMethods}>
            <Text style={styles.cardTitle}>Payment Methods</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToPaymentRequest}>
            <Text style={styles.cardTitle}>Payment Request</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToSendMessageScreen}>
            <Text style={styles.cardTitle}>Send Notification</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToMemberRequest}>
            <Text style={styles.cardTitle}>Member Request</Text>
          </TouchableOpacity>
        )}
        {!isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToNotificationScreen}>
            <Text style={styles.cardTitle}>Notification's</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToMemberDetails}>
            <Text style={styles.cardTitle}>Member's Details</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity style={styles.card} onPress={navigateToReports}>
            <Text style={styles.cardTitle}>Reports</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity style={styles.card} onPress={navigateToUserDetails}>
            <Text style={styles.cardTitle}>User's History</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.card} onPress={navigateToAppSettings}>
          <Text style={styles.cardTitle}>App Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <Text style={styles.cardTitle}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: hp(1),
  },
  mainContainer: {flex: 1, backgroundColor: 'white'},
  profileImage: {
    width: wp(25),
    height: hp(15),
    borderRadius: 75,
    // marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileInfo: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '700',
  },
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
});

export default ProfileScreen;
