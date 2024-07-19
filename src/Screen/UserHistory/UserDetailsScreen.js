/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function UserDetails() {
  const [userDetails, setuserDetails] = useState([]);
  const navigation = useNavigation();

  const getAllUserDetails = async () => {
    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/getAllUser';
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        // Filter users who have been approved
        const approvedUsers = response.data.filter(user => user.approved);

        setuserDetails(approvedUsers);
      } else {
        ToastAndroid.showWithGravity(
          "Error While Fetching User's List",
          ToastAndroid.BOTTOM,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error while Fetching UserDetails: ${error}`,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const showUserDetails = user => {
    // Navigate to the next screen and pass the id and username
    navigation.navigate('UserTransactionRecords', {
      id: user.id,
      username: `${user.username}`,
    });
  };

  useEffect(() => {
    getAllUserDetails();
  }, []);

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>User's history</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {userDetails.map(user => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => showUserDetails(user)}>
            <Text style={styles.title}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.text2}>EmailId: {user.email}</Text>
            <Text style={styles.text2}>MobileNo.: {user.mobileNo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flexGrow: 1,
  },
  headerContainer: {
    width: wp(60),
    height: hp(6),
    backgroundColor: '#00539C',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 5,
    marginTop: hp(2),
  },
  headerText: {
    fontSize: hp(3),
    color: 'white',
    textAlign: 'center',
    paddingTop: hp(1),
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    flex: 1,
  },
  text2: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
});

export default UserDetails;
