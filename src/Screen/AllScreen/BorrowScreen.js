import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ToastAndroid,
} from "react-native";
import { Card } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const BorrowScreen = () => {
  const [borrowAmount, setBorrowAmount] = useState("");
  const [borrowNote, setBorrowNote] = useState("");
  const [totalBorrowAmount, setTotalBorrowAmount] = useState("");
  const [borrowApprovedRecords, setBorrowApprovedRecords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const postBorrowerDetails = async () => {
    const userDetails = await AsyncStorage.getItem("UserDetails");
    const allDetails = JSON.parse(userDetails);

    const currentDate = new Date();
    const dateString = currentDate.toISOString();

    const requestBody = {
      amount: borrowAmount,
      note: borrowNote,
      borrowerName: `${allDetails.firstName} ${allDetails.lastName}`,
      borrowedDate: dateString,
      returnDate: "",
      userId: allDetails.id,
    };

    console.log("requestBody: ", requestBody);

    const response = await axios.post(
      "http://3.6.89.38:9090/api/v1/borrowing/addBorrowing",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      ToastAndroid.showWithGravity(
        "Borrow request raised",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  const getBorrowApprovedList = async () => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=${selectedFilter}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setTotalBorrowAmount(response.data.totalAmount);
        setBorrowApprovedRecords(response.data.data.reverse());
      } else {
        console.log(
          "Failed to fetch expenses list. Server response:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching expenses list:", error);
    }
  };

  useEffect(() => {
    getBorrowApprovedList();
  }, [selectedFilter]);

  const renderItem = ({ item }) => (
    <Card style={styles.recordCard}>
      <Card.Content>
        <Text style={styles.recordAmount}>Name: {item.borrowerName}</Text>
        <Text style={styles.recordAmount}>Amount: ${item.amount}</Text>
        <Text style={styles.recordAmount}>Description: {item.note}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Enter Borrow amount"
          keyboardType="numeric"
          value={borrowAmount}
          onChangeText={(text) => setBorrowAmount(text.replace(/[^0-9]/g, ""))}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Borrow Note"
          value={borrowNote}
          onChangeText={(text) =>
            setBorrowNote(text.replace(/[^a-zA-Z0-9]/g, ""))
          }
        />
        <Button
          title="Borrow"
          onPress={postBorrowerDetails}
          disabled={borrowAmount === ""}
        />
      </View>

      <RNPickerSelect
        placeholder={{ label: "Select Filter", value: null }}
        onValueChange={(value) => setSelectedFilter(value)}
        items={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "All", value: "all" },
        ]}
      />
      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
        Total Borrow Amount: {totalBorrowAmount}
      </Text>
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>Borrow Records</Text>
        <FlatList
          data={borrowApprovedRecords}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    marginTop: hp(5),
  },
  section: {
    marginBottom: 20,
    top: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  recordsSection: {
    flex: 1,
    marginTop: 20,
  },
  recordCard: {
    marginVertical: 5,
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BorrowScreen;
