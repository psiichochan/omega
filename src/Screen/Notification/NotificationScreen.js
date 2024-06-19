/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';

function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get('http://65.2.123.63:8080/api/v1/notification/getAll')
      .then(response => setNotifications(response.data.reverse()))
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  const renderItem = ({item}) => {
    const dateString = item.date;
    const [datePart] = dateString.split('T');
    return (
      <TouchableOpacity style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{datePart}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.uid.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  notificationCard: {
    backgroundColor: '#00539C',
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  notificationDate: {
    fontSize: 14,
    color: 'white',
  },
});

export default NotificationScreen;
