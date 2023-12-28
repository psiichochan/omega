// borrowRequestScreen.js

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

function BorrowCard({ borrow, onUpdate, GetBorrowUnApproved }) {
  const handleUpdate = (status) => {
    onUpdate(
      borrow.borrowingId,
      status,
      borrow.borrowerName,
      borrow.amount,
      borrow.note,
      borrow.borrowedDate
    );
    GetBorrowUnApproved();
    console.log("this is borrow ID: ", borrow.id);
  };

  //   useEffect(() => {
  //     GetMyProfileData();
  //   }, []);

  const dateString = borrow.borrowedDate;
  const [datePart, timePart] = dateString.split("T");

  return (
    <View style={styles.card}>
      <Text style={styles.amount}>{`Name: ${borrow.borrowerName}`}</Text>
      <Text style={styles.amount}>{`Date: ${datePart}`}</Text>
      <Text style={styles.amount}>{`Amount: ${borrow.amount}`}</Text>
      <Text style={styles.note}>{`Note: ${borrow.note}`}</Text>

      {/* Approve and Decline Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleUpdate(true)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleUpdate(false)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BorrowRequestScreen() {
  const [borrow, setBorrow] = useState([]);
  const [value, setValue] = useState(true);

  async function GetBorrowUnApproved() {
    try {
      const response = await axios.get(
        `http://3.6.89.38:9090/api/v1/borrowing/get/unapproved`
      );
      if (response.status === 200) {
        const data = response.data;

        setBorrow(data);
        GetBorrowUnApproved();
      } else if (response.status === 404) {
        // setValue(false);
      }
    } catch {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    GetBorrowUnApproved();
  });

  const handleUpdate = async (
    borrowId,
    status,
    username,
    amount,
    note,
    date
  ) => {
    const userDetails = await AsyncStorage.getItem("UserDetails");
    const allDetails = JSON.parse(userDetails);

    try {
      const requestBody = {
        userId: allDetails.id,
        borrowingId: borrowId,
        borrowerName: username,
        amount: amount,
        note: note,
        date: date,
        status: status,
      };
      console.log("request Body: ", requestBody);
      const response = await axios.put(
        `http://3.6.89.38:9090/api/v1/borrowing/updateBorrowing`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          "Borrowing Updated Successfully",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }

      setBorrow((prevBorrows) =>
        prevBorrows.filter((borrow) => borrow.id !== borrowId)
      );
      GetBorrowUnApproved();
      console.log(`borrow ${borrowId} ${status ? "approved" : "declined"}`);
    } catch (error) {
      console.error("Error updating borrow:", error);
    }
  };

  return (
    <View style={styles.container}>
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
          Donation Request's
        </Text>
      </View>

      <FlatList
        data={borrow}
        renderItem={(borrow) => (
          <BorrowCard
            key={borrow.borrowingId}
            borrow={borrow.item}
            onUpdate={handleUpdate}
            GetBorrowUnApproved={GetBorrowUnApproved}
          />
        )}
        keyExtractor={(item) => item.borrowingId.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
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
    width: wp(60),
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: hp(10),
  },
  paymentImage: {
    width: 200,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BorrowRequestScreen;
