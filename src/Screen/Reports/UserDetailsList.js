/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FloatingAction} from 'react-native-floating-action';
import XLSX from 'xlsx';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';

function UserDetailsList() {
  const [userDetails, setuserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getAllUserDetails = async () => {
    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/getAllUser';
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        // Filter users who have been approved
        const approvedUsers = response.data.filter(user => user.approved);

        setuserDetails(approvedUsers);
      } else {
        ToastAndroid.showWithGravity(
          "Error While Fetching User's List",
          ToastAndroid.BOTTOM,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error while Fetching UserDetails: ${error}`,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const exportDataToExcel = async () => {
    try {
      const filePath = DownloadDirectoryPath + '/MemberData.xlsx';

      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(userDetails);
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

      await RNFS.writeFile(filePath, wbout, 'ascii');
      Alert.alert('Export Data Successfully', `File saved to: ${filePath}`);
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      Alert.alert('Error exporting data to Excel');
    }
  };

  const handleSearch = () => {
    const filteredUsers = userDetails.filter(user =>
      user.mobileNo.includes(searchQuery),
    );

    setFilteredUserDetails(filteredUsers);
  };

  useEffect(() => {
    getAllUserDetails();
  }, []);

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>User's</Text>
      </View>
      {/* <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Mobile No."
          placeholderTextColor="white"
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={{color: 'white'}}>Search</Text>
        </TouchableOpacity>
      </View> */}
      <ScrollView contentContainerStyle={styles.container}>
        {userDetails.map(user => (
          <TouchableOpacity key={user.id} style={styles.card}>
            <Text style={styles.title}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.text2}>EmailId: {user.email}</Text>
            <Text style={styles.text2}>MobileNo.: {user.mobileNo}</Text>
            <Text style={styles.text2}>Address: {user.address}</Text>
          </TouchableOpacity>
        ))}
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
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flexGrow: 1,
  },
  headerContainer: {
    width: wp(60),
    height: hp(6),
    backgroundColor: '#00539C',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 5,
    marginTop: hp(2),
  },
  headerText: {
    fontSize: hp(3),
    color: 'white',
    textAlign: 'center',
    paddingTop: hp(1),
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    flex: 1,
  },
  text2: {
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#00539C',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
});

export default UserDetailsList;
