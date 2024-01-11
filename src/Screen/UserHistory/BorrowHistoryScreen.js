/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';

const BorrowHistoryScreen = ({userId, userName}) => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [totalBorrow, setTotalBorrow] = useState();

  const getUserActivities = async () => {
    try {
      const response = await axios.get(
        `http://3.6.89.38:9090/api/v1/userController/user/activities?username=${userName}&id=${userId}&filter=month`,
      );

      if (response.status === 200) {
        const borrowingHistory = response.data.Borrowing || [];
        setBorrowHistory(borrowingHistory);
        setTotalBorrow(response.data['Total Borrowings']);
      }
    } catch (error) {
      console.log('Error fetching borrow history:', error);
      console.log(
        `http://3.6.89.38:9090/api/v1/userController/user/activities?username=${userName}&id=${userId}&filter=month`,
      );
    }
  };

  useEffect(() => {
    getUserActivities();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.totalBorrow}>Total Borrow:Rs. {totalBorrow} </Text>
      {borrowHistory.map(item => (
        <View key={item.borrowingId} style={styles.card}>
          <Text style={styles.title}>Amount: {item.amount}</Text>
          <Text style={styles.text}>Note: {item.note}</Text>
          <Text style={styles.text}>Borrower: {item.borrowerName}</Text>
          <Text style={styles.text}>Borrowed Date: {item.borrowedDate}</Text>
          <Text style={styles.text}>
            Status: {item.status ? 'Approved' : 'Pending'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  totalBorrow: {fontSize: 15, fontWeight: 'bold', color: 'black'},
  text: {
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

export default BorrowHistoryScreen;
