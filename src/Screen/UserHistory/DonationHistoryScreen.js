/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import axios from 'axios';

function DonationHistoryScreen({userId, userName}) {
  const [donationHistory, setDonationHistory] = useState([]);
  const [totalDonations, setTotalDonations] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `http://65.2.123.63:8080/api/v1/userController/user/activities?username=${userName}&id=${userId}&filter=month`;
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setDonationHistory(response.data.Donation);
          setTotalDonations(response.data['Total Donations']);
        } else if (response.status === 204) {
          // If response status is 204, show ToastAndroid message
          ToastAndroid.showWithGravity(
            'No data found',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      } catch (error) {
        ToastAndroid.showWithGravity(
          `Error fetching donation history: ${error}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.totalDonation}>
        Total Donations:Rs. {totalDonations}{' '}
      </Text>
      {donationHistory.length === 0 || null ? (
        <Text style={styles.dataNotAvailable}>No History is Available</Text>
      ) : (
        <FlatList
          data={donationHistory}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.title}>Amount: {item.amount}</Text>
              <Text style={styles.text}>Note: {item.note}</Text>
              <Text style={styles.text}>Date: {item.date}</Text>
              <Text style={styles.text}>
                Status: {item.status ? 'Approved' : 'Not Approved'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 8,
  },
  totalDonation: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  dataNotAvailable: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    margin: 50,
    alignSelf: 'center',
  },
});

export default DonationHistoryScreen;
