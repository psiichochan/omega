/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function Card({profile, onApprove, onDecline}) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.profileImage}
          source={require('./../../../assets/AllImages/profilePic.jpg')}
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.profileName}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={styles.profileInfo}>{profile.mobileNo}</Text>
        <Text style={styles.profileInfo}>{profile.address}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApprove(profile.id)}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => onDecline(profile.id)}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function MemberRequest() {
  const [profiles, setProfiles] = useState([]);
  const [contain, setContain] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUnapprovedUser = async () => {
    try {
      const apiUrl =
        'http://65.2.123.63:8080/api/v1/userController/getAllUser/unapproved';

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setProfiles(response.data);
        setContain(false);
      } else if (response.status === 204) {
        setProfiles([]);
        setContain(true);
      } else {
        ToastAndroid.showWithGravity(
          'Error While Calling UnApproved User List',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      ToastAndroid.showWithGravity(
        'Error While Calling UnApproved User List',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };
  useEffect(() => {
    getUnapprovedUser();
  }, []);

  const handleApprove = async profileId => {
    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/update';

      const profileToUpdate = profiles.find(
        profile => profile.id === profileId,
      );

      const updatedProfileData = {
        ...profileToUpdate,
        approved: true,
      };

      const response = await axios.put(apiUrl, updatedProfileData);

      if (response.status === 200) {
        setProfiles(prevProfiles =>
          prevProfiles.filter(profile => profile.id !== profileId),
        );
        ToastAndroid.showWithGravity(
          'Member Request Approved Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } else {
        console.error('Error updating user approval status:', response.status);
      }
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  };

  const handleDecline = async profileId => {
    try {
      const apiUrl = 'http://65.2.123.63:8080/api/v1/userController/update';

      const profileToUpdate = profiles.find(
        profile => profile.id === profileId,
      );

      const updatedProfileData = {
        ...profileToUpdate,
        approved: false,
      };

      const response = await axios.put(apiUrl, updatedProfileData);

      if (response.status === 200) {
        setProfiles(prevProfiles =>
          prevProfiles.filter(profile => profile.id !== profileId),
        );
        ToastAndroid.showWithGravity(
          'Member Request Declined Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } else {
        console.error('Error updating user approval status:', response.status);
      }
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? ( // Display loader if loading is true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <React.Fragment>
          {profiles.map(profile => (
            <Card
              key={profile.id}
              profile={profile}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))}
          {contain === true ? (
            <View>
              <Text style={styles.containText}>No data present</Text>
            </View>
          ) : (
            <View />
          )}
        </React.Fragment>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containText: {fontSize: 20, fontWeight: 'bold', color: 'black', top: hp(10)},
  card: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    flexDirection: 'row',
  },
  memberRequestContainer: {
    backgroundColor: '#00539C',
    width: wp(90),
    height: hp(5),
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
    marginTop: hp(2),
  },
  memberRequestName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: hp(1),
    color: 'white',
  },
  leftContainer: {
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  profileInfo: {
    fontSize: 14,
    marginBottom: 3,
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MemberRequest;
