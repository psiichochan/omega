/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {FloatingAction} from 'react-native-floating-action';
import XLSX from 'xlsx';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';
import RNPickerSelect from 'react-native-picker-select';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const BorrowScreenReports = () => {
  const [borrow, setBorrow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  const getBorrowReports = async () => {
    const apiUrl = `http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=${filter}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setBorrow(response.data.data);
      } else if (response.status === 204 || response.status === 404) {
        // Handle cases where there is no content or the resource is not found
        setBorrow([]);
        ToastAndroid.showWithGravity(
          'No borrowing data found.',
          ToastAndroid.BOTTOM,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Error While Fetching Borrow reports Api',
          response.status,
          ToastAndroid.BOTTOM,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error While Fetching Borrow reports Api',
        ToastAndroid.BOTTOM,
        ToastAndroid.CENTER,
      );
      setBorrow([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBorrowReports();
  }, [filter]);

  const exportDataToExcel = async () => {
    try {
      const filePath = DownloadDirectoryPath + '/borrow.xlsx';

      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(borrow);
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

      await RNFS.writeFile(filePath, wbout, 'ascii');
      ToastAndroid.showWithGravity(
        'Export Data Successfully',
        ToastAndroid.BOTTOM,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      ToastAndroid.showWithGravity(
        'Error exporting data to Excel',
        ToastAndroid.BOTTOM,
        ToastAndroid.CENTER,
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrow Reports</Text>
      {/* Dropdown filter */}
      <RNPickerSelect
        onValueChange={setFilter}
        items={[
          {label: 'All', value: 'all'},
          {label: 'Day', value: 'day'},
          {label: 'Week', value: 'week'},
          {label: 'Month', value: 'month'},
        ]}
        value={filter}
        style={pickerSelectStyles}
      />
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : borrow.length === 0 ? (
          <Text>No borrowing data available.</Text>
        ) : (
          borrow.map(item => (
            <View key={item.borrowingId} style={styles.card}>
              <Text style={styles.text2}>Username: {item.borrowerName}</Text>
              <Text style={styles.text2}>Amount: {item.amount}</Text>
              <Text style={styles.text2}>Note: {item.note}</Text>
              <Text style={styles.text2}>
                Registration Date:{' '}
                {item.borrowedDate === null
                  ? 'N/A'
                  : new Date(item.borrowedDate).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <FloatingAction
        actions={[{text: 'Excel', name: 'download', color: '#4CAF50'}]}
        onPressItem={name => {
          if (name === 'download') {
            exportDataToExcel();
          }
        }}
        color="green"
      />
    </View>
  );
};

export default BorrowScreenReports;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
    marginLeft: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    width: wp(90),
    alignSelf: 'center',
  },
  text2: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
});
