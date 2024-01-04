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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BorrowCard({borrow, onUpdate, GetBorrowUnApproved}) {
  const handleUpdate = status => {
    onUpdate(
      borrow.borrowingId,
      status,
      borrow.borrowerName,
      borrow.amount,
      borrow.note,
      borrow.borrowedDate,
    );
    GetBorrowUnApproved();
  };
  console.log('this is borrow ID: ', borrow.borrowedDate);

  const dateString = borrow.borrowedDate;
  const [datePart] = dateString.split('T');
  console.log('this is Borrow: ', borrow);
  return (
    <View style={styles.card}>
      <Text style={styles.amount}>{`Name: ${borrow.borrowerName}`}</Text>
      <Text style={styles.amount}>{`Date: ${datePart}`}</Text>
      <Text style={styles.amount}>{`Amount: ${borrow.amount}`}</Text>
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

function BorrowRequestScreen() {
  const [borrow, setBorrow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('BorrowRequestScreen rendered');
  }, []);

  async function GetBorrowUnApproved() {
    try {
      const response = await axios.get(
        'http://3.6.89.38:9090/api/v1/borrowing/get/unapproved',
      );

      if (response.status === 200) {
        const data = response.data.reverse();
        setBorrow(data);
        setError(null);
      } else if (response.status === 404 || response.status === 204) {
        // Handle cases when no data is present
        setBorrow([]);
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
    GetBorrowUnApproved();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const handleUpdate = async (
    borrowId,
    status,
    username,
    amount,
    note,
    date,
  ) => {
    const userDetails = await AsyncStorage.getItem('UserDetails');
    const allDetails = JSON.parse(userDetails);

    console.log('this is status: ', status);

    try {
      const requestBody = {
        userId: allDetails.id,
        borrowingId: borrowId,
        borrowerName: username,
        amount: amount,
        note: note,
        borrowedDate: date,
        returnDate: '',
        status: status,
      };
      console.log('request Body: ', requestBody);
      const response = await axios.put(
        'http://3.6.89.38:9090/api/v1/borrowing/updateBorrowing',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Borrowing Updated Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      setBorrow(prevBorrows =>
        prevBorrows.filter(borrow => borrow.id !== borrowId),
      );
      GetBorrowUnApproved();
      console.log(`borrow ${borrowId} ${status ? 'approved' : 'declined'}`);
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
      ) : borrow.length === 0 ? (
        <Text style={styles.noDataText}>No data available.</Text>
      ) : (
        <FlatList
          data={borrow}
          renderItem={borrow1 => (
            <BorrowCard
              key={borrow1.borrowingId}
              borrow={borrow1.item}
              onUpdate={handleUpdate}
              GetBorrowUnApproved={GetBorrowUnApproved}
            />
          )}
          keyExtractor={item => item.borrowingId.toString()}
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

export default BorrowRequestScreen;
