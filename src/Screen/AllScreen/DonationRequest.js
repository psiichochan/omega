/* eslint-disable no-catch-shadow */ /* eslint-disable no-shadow */ /* eslint-disable prettier/prettier */

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BorrowCard({borrow, onUpdate, GetDonationUnApproved}) {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  const handleUpdate = status => {
    onUpdate(
      borrow.id,
      status,
      borrow.username,
      borrow.amount,
      borrow.note,
      borrow.date,
    );
    GetDonationUnApproved();
    console.log('this is borrow ID: ', borrow.id);
  };

  async function GetMyProfileData() {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/fileAttachment/getFile?fileName=${borrow.screenshot}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        setImageUrl(base64Icon);
        console.log(imageUrl);
      } else {
        // Handle error appropriately
        ToastAndroid.showWithGravity(
          'Failed to fetch image',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      // Handle network or other errors
      ToastAndroid.showWithGravity(
        'Network error or something went wrong',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      // Update loading state
      setLoading(false);
    }
  }

  useEffect(() => {
    GetMyProfileData();
  }, []);

  const dateString = borrow.date;
  const [datePart] = dateString.split('T');
  console.log('this is Borrow: ', borrow);
  return (
    <View style={styles.card}>
      <Text style={styles.amount}>{`Name: ${borrow.username}`}</Text>
      <Text style={styles.amount}>{`Date: ${datePart}`}</Text>
      <Text style={styles.amount}>{`Amount: ${borrow.amount}`}</Text>
      {loading ? (
        <Text>Loading image...</Text>
      ) : (
        <Image style={styles.paymentImage} source={{uri: imageUrl}} />
      )}
      <Text style={styles.amount}>{`Note: ${borrow.note}`}</Text>

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
  const [donation, setDonation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('BorrowRequestScreen rendered');
  }, []);

  async function GetDonationUnApproved() {
    try {
      const response = await axios.get(
        'http://3.6.89.38:9090/api/v1/donation/get/unapproved',
      );

      if (response.status === 200) {
        const data = response.data.reverse();
        setDonation(data);
        setError(null);
      } else if (response.status === 404 || response.status === 204) {
        // Handle cases when no data is present
        setDonation([]);
        setError('No data available.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetDonationUnApproved();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const handleUpdate = async (id, status, username, amount, note, date) => {
    try {
      const requestBody = {
        id: id,
        username: username,
        amount: amount,
        note: note,
        date: date,
        status: status,
      };
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
          'Donation Updated Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      setDonation(prevDonation =>
        prevDonation.filter(donation => donation.id !== id),
      );
      GetDonationUnApproved();
    } catch (error) {
      console.error('Error updating borrow:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : donation.length === 0 ? (
        <Text style={styles.noDataText}>No data available.</Text>
      ) : (
        <FlatList
          data={donation}
          renderItem={donation => (
            <BorrowCard
              key={donation.id}
              borrow={donation.item}
              onUpdate={handleUpdate}
              GetDonationUnApproved={GetDonationUnApproved}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#00539C',
    width: wp(100),
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    width: wp(90),
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: hp(10),
  },
  paymentImage: {
    width: wp(45),
    height: hp(15),
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
  loadingText: {
    textAlign: 'center',
    marginTop: hp(3),
    fontSize: 18,
  },
  errorText: {
    textAlign: 'center',
    marginTop: hp(3),
    fontSize: 18,
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: hp(3),
    fontSize: 18,
  },
});

export default DonationRequestScreen;
