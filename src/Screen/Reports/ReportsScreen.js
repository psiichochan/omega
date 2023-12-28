// Import necessary components from React and React Native
import React, { useState, useEffect } from "react";
import { TabView, TabBar } from "react-native-tab-view";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Create a bottom tab navigator
const RecordTab = ({ route }) => {
  const navigation = useNavigation();
  switch (route.key) {
    case "donations":
      return <DonationScreen1 navigation={navigation} />;
    case "expenses":
      return <ExpensesScreen1 isAdmin={route.params} />;
    case "borrow":
      return <BorrowScreen1 />;
    default:
      return null;
  }
};
// Screens for each tab
const DonationScreen1 = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const apiUrl = "http://3.6.89.38:9090/api/v1/donation/get/all";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setDonations(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donation Tab</Text>
      {donations.map((donation) => (
        <View key={donation.id} style={styles.card}>
          {/* <Text>ID: {donation.id}</Text> */}
          <Text>Username: {donation.username}</Text>
          <Text>Amount: {donation.amount}</Text>
          <Text>Note: {donation.note}</Text>
          <Text>Date: {donation.date}</Text>
          {/* <Text>Status: {donation.status ? "True" : "False"}</Text> */}
          {/* Add more fields as needed */}
        </View>
      ))}
    </ScrollView>
  );
};

const ExpensesScreen1 = () => {
  const [expenses, setExpenses] = useState([]);

  // useEffect(() => {
  //   const apiUrl = "http://3.6.89.38:9090/api/v1/expenses/getAll";

  //   try{
  //     const response = await axios
  //   }catch{

  //   }

  //   // fetch(apiUrl)
  //   //   .then((response) => response.data.json())
  //   //   .then((data) => setExpenses(data))
  //   //   .catch((error) => console.error("Error fetching data:", error));
  // }, []);
  const GetAllExpenses = async () => {
    const apiUrl = "http://3.6.89.38:9090/api/v1/expenses/getAll";
    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setExpenses(response.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    GetAllExpenses();
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      {expenses.map((expense) => (
        <View key={expense.expenseId} style={styles.card}>
          <Text>Description: {expense.description}</Text>
          <Text>Amount: {expense.amount}</Text>
          <Text>Category: {expense.category}</Text>
          {/* Add more fields as needed */}
        </View>
      ))}
    </ScrollView>
  );
};

const BorrowScreen1 = () => {
  const [borrow, setBorrow] = useState([]);

  useEffect(() => {
    const apiUrl = "http://3.6.89.38:9090/api/v1/borrowing/getAll";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setBorrow(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donation Tab</Text>
      {borrow.map((borrow) => (
        <View key={borrow.borrowingId} style={styles.card}>
          {/* <Text>ID: {donation.id}</Text> */}
          <Text>Username: {borrow.borrowerName}</Text>
          <Text>Amount: {borrow.amount}</Text>
          <Text>Note: {borrow.note}</Text>
          <Text>Date: {borrow.borrowedDate}</Text>
          {/* <Text>Status: {donation.status ? "True" : "False"}</Text> */}
          {/* Add more fields as needed */}
        </View>
      ))}
    </ScrollView>
  );
};

const ReportsScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "donations", title: "Donations" },
    { key: "expenses", title: "Expenses" },
    { key: "borrow", title: "Borrow" },
  ]);

  return (
    // <View style={{ marginTop: hp(5) }}>
    <TabView
      navigationState={{ index, routes }}
      renderScene={RecordTab}
      onIndexChange={setIndex}
      initialLayout={{ width: 300 }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#FFCB2D" }}
          style={{ backgroundColor: "#23A036", marginTop: hp(5) }}
        />
      )}
    />
    // </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
});
