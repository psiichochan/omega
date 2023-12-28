import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MemberRequest from "./MemberRequest";
import DonationRequestScreen from "./DonationRequest";
import BorrowRequestScreen from "./BorrowRequest";

const RequestTabs = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MemberRequest")}
      >
        <Text style={styles.buttonText}>Member Request</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DonationRequestScreen")}
      >
        <Text style={styles.buttonText}>Donation Request</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BorrowRequestScreen")}
      >
        <Text style={styles.buttonText}>Borrow Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ab2787",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RequestTabs;
