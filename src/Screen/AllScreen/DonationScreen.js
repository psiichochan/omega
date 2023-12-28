import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const DonationsScreen = ({ navigation, username }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationNote, setDonationNote] = useState("");
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState("");
  const [selectedValue, setSelectedValue] = useState("all");

  useEffect(() => {
    GetApprovedDonationList();
  }, [selectedValue]);

  const makeDonation = () => {
    const amount = parseFloat(donationAmount);
    if (!isNaN(amount) && amount > 0) {
      setDonationAmount("");
      setDonationNote("");

      navigation.navigate("Payment", {
        donationAmount: amount,
        date: new Date(),
        donationNote: donationNote,
      });
    }
  };
  const GetApprovedDonationList = async () => {
    const apiUrl = `http://3.6.89.38:9090/api/v1/donation/get/approved?filter=${selectedValue}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        const data = response.data.data;

        setTotalDonations(response.data.totalAmount);
        setDonations(data);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.error("Error fetching donation list:", error);
    }
  };

  function DonationCard({ donation }) {
    // console.log("hello", donation);
    const dateString = donation.date;
    const [datePart, timePart] = dateString.split("T");
    return (
      <View style={styles.card}>
        <Text style={styles.amount}>{`Name: ${donation.username}`}</Text>
        <Text style={styles.amount}>{`Date: ${datePart}`}</Text>
        {/* <Image style={styles.paymentImage} source={{ uri: imageUrl }} /> */}
        <Text style={styles.amount}>{`Amount: ${donation.amount}`}</Text>
        <Text style={styles.amount}>{`Note: ${donation.note}`}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Section</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter donation amount"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={(text) => setDonationAmount(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Note"
            value={donationNote}
            onChangeText={(text) => setDonationNote(text)}
          />
          <Button
            title="Make Donation"
            onPress={makeDonation}
            disabled={donationAmount === "" && donationNote === ""}
          />
        </View>

        <RNPickerSelect
          placeholder={{ label: "Select Filter", value: null }}
          onValueChange={(value) => setSelectedValue(value)}
          items={[
            { label: "Today", value: "day" },
            { label: "Weekly", value: "week" },
            { label: "Monthly", value: "month" },
            { label: "All", value: "all" },
          ]}
        />
        <View style={styles.recordsSection}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Total Donations: {totalDonations}
          </Text>
          <Text style={styles.sectionTitle}>Donation Records</Text>
          <FlatList
            data={donations}
            renderItem={(donation) => (
              <DonationCard key={donation.id} donation={donation.item} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DonationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    color: "white",
    marginTop: hp(5),
  },
  card: {
    width: wp(90),
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    // alignItems: "center",
    // alignSelf: "center",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  recordsSection: {
    marginTop: 20,
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: hp(10),
  },
  recordCard: {
    marginVertical: 5,
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentScreenshot: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginTop: 10,
  },
});
