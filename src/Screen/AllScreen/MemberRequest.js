import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function Card({ profile, onApprove, onDecline }) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.profileImage}
          source={require("./../../../assets/AllImages/profilePic.jpg")}
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
            onPress={() => onApprove(profile.id)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => onDecline(profile.id)}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function MemberRequest() {
  const [profiles, setProfiles] = useState([]);

  const getUnapprovedUser = async () => {
    const apiUrl =
      "http://3.6.89.38:9090/api/v1/userController/getAllUser/unapproved";

    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      setProfiles(response.data);
    } else {
      ToastAndroid.showWithGravity(
        "Error While Calling UnApproved User List",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  useEffect(() => {
    getUnapprovedUser();
  }, []);

  const handleApprove = async (profileId) => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/userController/update`;

      const profileToUpdate = profiles.find(
        (profile) => profile.id === profileId
      );

      const updatedProfileData = {
        ...profileToUpdate,
        approved: true,
      };

      const response = await axios.put(apiUrl, updatedProfileData);

      if (response.status === 200) {
        console.log(`User with ID ${profileId} has been approved.`);
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile.id !== profileId)
        );
      } else {
        console.error("Error updating user approval status:", response.status);
      }
    } catch (error) {
      console.error("Error updating user approval status:", error);
    }
  };

  const handleDecline = async (profileId) => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/userController/update`;

      const profileToUpdate = profiles.find(
        (profile) => profile.id === profileId
      );

      const updatedProfileData = {
        ...profileToUpdate,
        approved: false,
      };

      const response = await axios.put(apiUrl, updatedProfileData);

      if (response.status === 200) {
        console.log(`User with ID ${profileId} has been declined.`);
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile.id !== profileId)
        );
      } else {
        console.error("Error updating user approval status:", response.status);
      }
    } catch (error) {
      console.error("Error updating user approval status:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          backgroundColor: "#b981c7",
          width: wp(90),
          height: hp(5),
          borderRadius: 10,
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            paddingTop: hp(1),
          }}
        >
          Member Request's
        </Text>
      </View>

      {profiles.map((profile) => (
        <Card
          key={profile.id}
          profile={profile}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: hp(5),
  },
  card: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flexDirection: "row",
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileInfo: {
    fontSize: 14,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MemberRequest;
