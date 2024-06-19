/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function BorrowCard({item}) {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const GetMyProfileData = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${item.item.imageName}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        setImageUrl(base64Icon);
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
  }, [item.item.imageName]);

  useEffect(() => {
    GetMyProfileData();
  }, [GetMyProfileData]);

  return (
    <Card style={styles.recordCard}>
      <Card.Content>
        <Text style={styles.recordAmount}>Name: {item.item.borrowerName}</Text>
        <Text style={styles.recordAmount}>Amount: {item.item.amount}</Text>
        <Text style={styles.recordAmount}>Description: {item.item.note}</Text>
        {loading ? (
          <Text>Loading image...</Text>
        ) : (
          <Image style={styles.paymentImage} source={{uri: imageUrl}} />
        )}
      </Card.Content>
    </Card>
  );
}

const BorrowScreen = () => {
  const [borrowAmount, setBorrowAmount] = useState('');
  const [borrowNote, setBorrowNote] = useState('');
  const [totalBorrowAmount, setTotalBorrowAmount] = useState('');
  const [borrowApprovedRecords, setBorrowApprovedRecords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const postBorrowerDetails = async () => {
    const userDetails = await AsyncStorage.getItem('UserDetails');
    const allDetails = JSON.parse(userDetails);

    const currentDate = new Date();
    const dateString = currentDate.toISOString();

    const requestBody = {
      amount: borrowAmount,
      note: borrowNote,
      borrowerName: `${allDetails.firstName} ${allDetails.lastName}`,
      borrowedDate: dateString,
      returnDate: '',
      userId: allDetails.id,
    };

    try {
      const response = await axios.post(
        'http://65.2.123.63:8080/api/v1/borrowing/addBorrowing',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Borrow request raised',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // Clear the input fields after successful borrow
        setBorrowAmount('');
        setBorrowNote('');
      }
    } catch (error) {
      console.error('Error posting borrowing details:', error);
    }
  };

  const getBorrowApprovedList = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/borrowing/get/approved?filter=${selectedFilter}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setTotalBorrowAmount(response.data.totalAmount);
        setBorrowApprovedRecords(response.data.data.reverse());
      } else if (response.status === 204 || response.status === 404) {
        ToastAndroid.showWithGravity(
          'No data present',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setBorrowApprovedRecords([]);
      } else {
        console.log(
          'Failed to fetch expenses list. Server response:',
          response.status,
        );
      }
    } catch (error) {
      console.error('Error fetching expenses list 123:', error);
      ToastAndroid.showWithGravity(
        'No data present',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setBorrowApprovedRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    setLoading(true);
    getBorrowApprovedList();
  }, [getBorrowApprovedList, selectedFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Enter Borrow amount"
          keyboardType="numeric"
          value={borrowAmount}
          onChangeText={text => setBorrowAmount(text.replace(/[^0-9 ]/g, ''))}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Borrow Note"
          value={borrowNote}
          onChangeText={text => setBorrowNote(text)}
        />
        <Button
          title="Borrow"
          color="#00539C"
          onPress={postBorrowerDetails}
          disabled={borrowAmount === ''}
        />
      </View>

      <RNPickerSelect
        placeholder={{label: 'Select Filter', value: null}}
        style={styles.rnPickerStyle}
        onValueChange={value => setSelectedFilter(value)}
        items={[
          {label: 'Day', value: 'day'},
          {label: 'Week', value: 'week'},
          {label: 'Month', value: 'month'},
          {label: 'All', value: 'all'},
        ]}
      />
      <Text style={styles.totalBorrowAmount}>
        Total Borrow Amount:{' '}
        <Text style={styles.amount}>{totalBorrowAmount}</Text>
      </Text>
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>Borrow Records</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={borrowApprovedRecords}
            renderItem={borrow => <BorrowCard item={borrow} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  amount: {fontSize: 17, color: 'black', fontWeight: '800'},
  totalBorrowAmount: {fontSize: 18, fontWeight: 'bold', color: 'black'},
  section: {
    marginBottom: 20,
    top: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  rnPickerStyle: {color: 'black'},
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 13,
    fontWeight: '600',
    borderRadius: 10,
  },
  paymentImage: {
    width: wp(45),
    height: hp(15),
    borderRadius: 5,
    marginBottom: 10,
  },
  recordsSection: {
    flex: 1,
    marginTop: 20,
  },
  recordCard: {
    width: wp(90),
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BorrowScreen;
