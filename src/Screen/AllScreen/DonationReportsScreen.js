/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import XLSX from 'xlsx';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';
import RNPickerSelect from 'react-native-picker-select';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const DonationReportsScreen = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  const GetDonationReport = async () => {
    const apiUrl = `http://3.6.89.38:9090/api/v1/donation/get/approved?filter=${filter}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setDonations(response.data.data);
      } else if (response.status === 204 || response.status === 404) {
        // Handle cases where there is no content or the resource is not found
        setDonations([]);
        ToastAndroid.showWithGravity(
          'No donation data found.',
          ToastAndroid.BOTTOM,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Error While Fetching Donation reports Api',
          response.status,
          ToastAndroid.BOTTOM,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error While Fetching Donation reports Api',
        ToastAndroid.BOTTOM,
        ToastAndroid.CENTER,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDonationReport();
  }, [filter]);

  const exportDataToExcel = async () => {
    try {
      const filePath = DownloadDirectoryPath + '/donation.xlsx';

      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(donations);
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

      await RNFS.writeFile(filePath, wbout, 'ascii');
      Alert.alert('Export Data Successfully', `File saved to: ${filePath}`);
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      Alert.alert('Error exporting data to Excel');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation Reports</Text>
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
        ) : donations.length === 0 ? (
          <Text>No donation data available.</Text>
        ) : (
          donations.map(donation => (
            <View key={donation.id} style={styles.card}>
              <Text style={styles.text2}>Username: {donation.username}</Text>
              <Text style={styles.text2}>Amount: {donation.amount}</Text>
              <Text style={styles.text2}>Note: {donation.note}</Text>
              <Text style={styles.text2}>
                Date:{' '}
                {donation.date === null
                  ? 'N/A'
                  : new Date(donation.date).toLocaleDateString()}
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

export default DonationReportsScreen;

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
