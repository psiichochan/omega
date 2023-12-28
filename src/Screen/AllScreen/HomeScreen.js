import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import DonationsScreen from "./DonationScreen";
import axios from "axios";

const HomeScreen = ({ route, navigation }) => {
  const { isAdmin } = route.params;

  const [totalDonations, setTotalDonations] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [totalBorrow, setTotalBorrow] = useState("");
  const [routes] = useState([
    { key: "donations", title: "Donations" },
    { key: "expenses", title: "Expenses", params: isAdmin },
    { key: "borrow", title: "Borrow" },
  ]);

  // useEffect(() => {
  //   const handleHardwareBack = () => {
  //     // Disable hardware back button functionality here
  //     return true;
  //   };

  //   // Add the event listener when the component mounts
  //   BackHandler.addEventListener("hardwareBackPress", handleHardwareBack);

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleHardwareBack);
  //   };
  // }, []); // Empty dependency array ensures the effect is only run once

  // useFocusEffect(() => {
  //   // Re-enable hardware back button functionality when the screen is focused
  //   const handleHardwareBack = () => {
  //     return false;
  //   };

  //   BackHandler.addEventListener("hardwareBackPress", handleHardwareBack);

  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleHardwareBack);
  //   };
  // });

  const navigateToDonationScreen = () => {
    navigation.navigate("DonationsScreen");
  };

  const navigateToExpensesScreen = () => {
    navigation.navigate("ExpenseScreen", {
      isAdmin: route.params,
    });
  };

  const navigateToBorrowScreen = () => {
    navigation.navigate("BorrowScreen");
  };

  const getApprovedDonations = async () => {
    const response = await axios.get(
      "http://3.6.89.38:9090/api/v1/donation/get/approved?filter=all"
    );
    if (response.status === 200) {
      setTotalDonations(response.data.totalAmount);
    }
  };

  const getExpenses = async () => {
    const response = await axios.get(
      "http://3.6.89.38:9090/api/v1/expenses/getAll?filter=all"
    );
    if (response.status === 200) {
      setTotalExpenses(response.data.totalAmount);
    }
  };

  const getApprovedBorrow = async () => {
    const response = await axios.get(
      "http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=all"
    );
    if (response.status === 200) {
      setTotalBorrow(response.data.totalAmount);
    }
  };

  useEffect(() => {
    getApprovedDonations();
    getExpenses();
    getApprovedBorrow();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", marginTop: hp(5) }}>
      <View style={{ top: 5, left: 5 }}>
        <Text style={{ fontStyle: "normal", fontWeight: "bold", fontSize: 15 }}>
          Approved Donations: {totalDonations}
        </Text>
        <Text
          style={{
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 15,
            top: 5,
          }}
        >
          Approved Expenses: {totalExpenses}
        </Text>
        <Text
          style={{
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 15,
            top: 10,
          }}
        >
          Approved Borrow: {totalBorrow}
        </Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDonationScreen}
        >
          <Text style={styles.buttonText}>Donation's</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToExpensesScreen}
        >
          <Text style={styles.buttonText}>Expense's</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToBorrowScreen}
        >
          <Text style={styles.buttonText}>Borrow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2797ab",
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    width: wp(90),
    height: hp(15),
    alignItems: "center", // Fix the typo here
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
