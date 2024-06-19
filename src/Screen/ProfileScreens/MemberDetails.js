/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function MemberDetails() {
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAllUserDetails = async () => {
    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/getAllUser';
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setUserDetails(response.data);
        setLoading(false);
      } else {
        ToastAndroid.showWithGravity(
          "Error While Fetching User's List",
          ToastAndroid.BOTTOM,
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Error While Fetching User's List",
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
      );
      setLoading(false); // Set loading to false on API call failure
    }
  };
  const getStatusColor = status => {
    return status ? 'green' : 'red';
  };

  const showUserDetails = user => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  useEffect(() => {
    getAllUserDetails();
  }, []);

  return (
    <View>
      {loading ? ( // Display loader if loading is true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {userDetails.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.card}
              onPress={() => showUserDetails(user)}>
              <Text style={styles.title}>
                {user.firstName} {user.lastName}
              </Text>
              <Text
                style={[styles.text2, {color: getStatusColor(user.approved)}]}>
                Status: {user.approved ? 'Approved' : 'Not Approved'}
              </Text>
            </TouchableOpacity>
          ))}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedUser && (
                  <React.Fragment>
                    <Text style={styles.modalTitle}>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Text>
                    <Text
                      style={[
                        styles.modalText2,
                        {color: getStatusColor(selectedUser.approved)},
                      ]}>
                      Status:{' '}
                      {selectedUser.approved
                        ? 'Approved'
                        : 'Not Approved Or Rejected'}
                    </Text>
                    <Text style={styles.modalText2}>
                      Username: {selectedUser.username}
                    </Text>
                    <Text style={styles.modalText2}>
                      Email: {selectedUser.email}
                    </Text>
                    <Text style={styles.modalText2}>
                      Mobile No: {selectedUser.mobileNo || 'N/A'}
                    </Text>
                    <Text style={styles.modalText2}>
                      Address: {selectedUser.address || 'N/A'}
                    </Text>
                    {/* Add other fields as needed */}
                  </React.Fragment>
                )}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  modalText2: {
    color: 'black',
    fontWeight: '500',
    fontSize: 15,
  },
  modalCloseButton: {
    backgroundColor: '#00539C',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    width: wp(15),
    alignSelf: 'center',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default MemberDetails;
