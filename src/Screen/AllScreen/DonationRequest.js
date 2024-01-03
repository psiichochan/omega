/* eslint-disable prettier/prettier */
// DonationRequestScreen.js

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function DonationCard({donation, onUpdate, donationGet}) {
  const handleUpdate = status => {
    onUpdate(
      donation.id,
      status,
      donation.username,
      donation.amount,
      donation.note,
      donation.screenshot,
      donation.date,
    );
    donationGet();
    console.log('this is donation ID: ', donation.id);
  };

  const [imageUrl, setImageUrl] = useState();
  let base64Url;

  async function GetMyProfileData() {
    const apiUrl = `http://3.6.89.38:9090/api/v1/fileAttachment/getFile?fileName=${donation.screenshot}`;

    const response = await axios.get(apiUrl);
    let profileData;

    if (response.status === 200) {
      base64Url = JSON.stringify(response.data.data.data);
      const base64Icon = `data:image/png;base64,${base64Url}`;
      profileData = base64Icon;
      setImageUrl(profileData);
    } else {
      ToastAndroid.showWithGravity(
        'Login Successfully',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    return profileData;
  }

  useEffect(() => {
    GetMyProfileData();
  });

  const dateString = donation.date;
  const [datePart] = dateString.split('T');

  return (
    <View style={styles.card}>
      <Text style={styles.amount}>{`Name: ${donation.username}`}</Text>
      <Text style={styles.amount}>{`Date: ${datePart}`}</Text>
      <Image style={styles.paymentImage} source={{uri: imageUrl}} />
      <Text style={styles.amount}>{`Amount: ${donation.amount}`}</Text>
      <Text style={styles.amount}>{`Note: ${donation.note}`}</Text>

      {/* Approve and Decline Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleUpdate(true)}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleUpdate(false)}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DonationRequestScreen() {
  const [donations, setDonations] = useState([]);
  const [statusDonation, setStatusDonation] = useState(false);

  async function donationGet() {
    try {
      const response = await axios.get(
        'http://3.6.89.38:9090/api/v1/donation/get/unapproved',
      );
      if (response.status === 200) {
        const data = response.data;

        setDonations(data);
      } else {
        ToastAndroid.showWithGravity(
          response.statusText,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch {
      ToastAndroid.showWithGravity(
        'Error Or No Request',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }
  useEffect(() => {
    donationGet();
  });

  const handleUpdate = async (
    donationId,
    status,
    username,
    amount,
    note,
    screenshot,
    date,
  ) => {
    try {
      setStatusDonation(status);
      const requestBody = {
        id: donationId,
        username: username,
        amount: amount,
        note: note,
        screenshot: screenshot,
        date: date,
        status: status,
      };
      console.log('request Body: ', requestBody);
      const response = await axios.put(
        'http://3.6.89.38:9090/api/v1/donation/update',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Donation Approved Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      setDonations(prevDonations =>
        prevDonations.filter(donation => donation.id !== donationId),
      );
      donationGet();
      console.log(`Donation ${donationId} ${status ? 'approved' : 'declined'}`);
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        renderItem={donation => (
          <DonationCard
            key={donation.id}
            donation={donation.item}
            onUpdate={handleUpdate}
            donationGet={donationGet}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    top: hp(2),
  },
  card: {
    width: wp(80),
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: hp(1),
    color: 'white',
  },
  flatListContainer: {
    flexGrow: 1,
    flex: 1,
    paddingBottom: hp(10),
  },
  headerTextContainer: {
    backgroundColor: '#00539C',
    width: wp(90),
    height: hp(5),
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  paymentImage: {
    width: 200,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DonationRequestScreen;
