/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import axios from 'axios';

function DonationHistoryScreen({userId, userName}) {
  console.log('routes: ', userId, userName);
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `http://3.6.89.38:9090/api/v1/userController/user/activities?username=${userName}&id=${userId}&filter=month`;
        const response = await axios.get(apiUrl);
        console.log(response.data);
        if (response.status === 200) {
          setDonationHistory(response.data.Donation);
        } else if (response.status === 204) {
          // If response status is 204, show ToastAndroid message
          ToastAndroid.showWithGravity(
            'No data found',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      } catch (error) {
        console.log('Error fetching donation history: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={donationHistory}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.text}>Amount: {item.amount}</Text>
            <Text style={styles.text}>Note: {item.note}</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>
              Status: {item.status ? 'Approved' : 'Not Approved'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default DonationHistoryScreen;
