import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const { isAdmin } = route.params;
  const [userDetails, setUserDetails] = useState([]);

  const getUserDetails = async () => {
    const userDetails = await AsyncStorage.getItem("UserDetails");
    const allDetails = JSON.parse(userDetails);
    setUserDetails(allDetails);
  };
  useEffect(() => {
    getUserDetails();
  });

  const navigateToAbout = () => {
    navigation.navigate("AboutScreen");
  };

  const navigateToMemberRequest = () => {
    navigation.navigate("RequestTabs");
  };

  const navigateToPaymentMethods = () => {
    navigation.navigate("PaymentMethods");
  };

  const navigateToAppSettings = () => {
    navigation.navigate("AppSetting");
  };

  const navigateToReports = () => {
    navigation.navigate("Reports");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, sure",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={require("../../../assets/AllImages/profilePic.jpg")}
        />

        <Text style={styles.profileName}></Text>
        <Text style={styles.profileInfo}>UserName: {userDetails.username}</Text>

        {/* About Section */}
        <TouchableOpacity style={styles.card} onPress={navigateToAbout}>
          <Text style={styles.cardTitle}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={navigateToPaymentMethods}
        >
          <Text style={styles.cardTitle}>Payment Methods</Text>
        </TouchableOpacity>

        {/* Member Request Section - Conditionally Rendered */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.card}
            onPress={navigateToMemberRequest}
          >
            <Text style={styles.cardTitle}>Member Request</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.card} onPress={navigateToReports}>
          <Text style={styles.cardTitle}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={navigateToAppSettings}>
          <Text style={styles.cardTitle}>App Setting</Text>
        </TouchableOpacity>

        {/* Logout Section */}
        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <Text style={styles.cardTitle}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: hp(10),
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  card: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
