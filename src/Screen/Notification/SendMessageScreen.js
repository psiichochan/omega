/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';

const SendMessageScreen = ({navigation}) => {
  // Initial state for email, contact number, and address
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const SendMessages = async () => {
    try {
      const requestBody = {
        title: title,
        message: message,
        status: true,
        date: new Date().toISOString(),
      };

      const apiUrl = 'http://3.6.89.38:9090/api/v1/notification/save';
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Message Send Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setMessage('');
        setTitle('');
      }
    } catch (error) {
      console.log('error in the code: ', error);
    }
  };

  const handleTitleChange = text => {
    setTitle(text);
  };

  const handleMessageChange = text => {
    setMessage(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={handleTitleChange}
      />

      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Message"
        value={message}
        onChangeText={handleMessageChange}
      />

      <Button title="Send Message" onPress={SendMessages} color="#00539C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SendMessageScreen;
