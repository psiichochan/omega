import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
  ToastAndroid,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Card } from "react-native-paper";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ExpensesScreen = ({ route }) => {
  const isAdmin = route.params;
  console.log("isAdmin: ", isAdmin);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensesNote, setExpensesNote] = useState("");
  const [expensesRecords, setExpensesRecords] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState("");
  const [qrImage, setQRImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [selectedImage, setSelectedImage] = useState(false); // Added state for image selection
  const [imageStatus, setImageStatus] = useState(false);
  useEffect(() => {
    fetchExpensesList();
  }, [selectedFilter]);

  const fetchExpensesList = async () => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/expenses/getAll?filter=${selectedFilter}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setTotalExpenses(response.data.totalAmount);
        setExpensesRecords(response.data.data.reverse());
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

  const extractImageName = (path) => {
    const pathArray = path.split("/");
    const filename = pathArray[pathArray.length - 1];
    return filename;
  };

  const handleReselectImage = () => {
    setQRImage(null);
    setSelectedImage(false); // Set selected image state to false
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        ToastAndroid.showWithGravity(
          "Permission to access media library is required",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setQRImage(result.uri);
        setImageStatus(true);
        const name = extractImageName(result.uri);
        setImageName(name);
        setSelectedImage(true); // Set selected image state to true
      }
    } catch (error) {
      console.log("ImagePicker Error: ", error);
    }
  };

  async function ImageUpload() {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: qrImage,
        name: imageName,
        fileName: "image",
        type: "image/jpg",
      });
      console.log("response image", imageName);
      const response = await axios.post(
        "http://3.6.89.38:9090/api/v1/fileAttachment/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("response image", response.status);
      if (response.status === 200) {
        console.log("response image", response.data);
        ToastAndroid.showWithGravity(
          "Receipt Code Uploaded successfully!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log("Receipt Uploaded successfully!");
      } else {
        ToastAndroid.showWithGravity(
          `Error Uploading Receipt Code: ${response.status} ${response.statusText}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log(
          "Error Uploading Receipt Code:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error Uploading QR Code: ${error}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.error("Error during API request:", error);
    } finally {
      setLoadingImage(false);
    }
  }

  const makeExpense = async () => {
    try {
      if (!selectedImage) {
        ToastAndroid.showWithGravity(
          "Please select an image",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        return;
      }

      const amount = parseFloat(expenseAmount);
      if (isNaN(amount) || amount <= 0) {
        console.error("Invalid expense amount");
        return;
      }

      const userDetails = await AsyncStorage.getItem("UserDetails");
      const allDetails = JSON.parse(userDetails);

      const expenseData = {
        description: expensesNote,
        amount: expenseAmount,
        category: "Food",
        date_of_expense: new Date().toISOString(),
        user_id: allDetails.id,
        imageName: imageName,
      };

      const response = await fetch(
        "http://3.6.89.38:9090/api/v1/expenses/addExpenses",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (response.ok) {
        ImageUpload();
        setImageStatus(false);
        setExpensesRecords((prevRecords) => [...prevRecords, expenseData]);
        setExpenseAmount("");
        setExpensesNote("");
        fetchExpensesList();
      } else {
        console.log("Failed to add expense. Server response:", response.status);
      }
    } catch (error) {
      console.error("Error making expense:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.recordCard}>
      <Card.Content>
        <Text style={styles.recordAmount}>
          {item.date === null ? "---" : new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.recordAmount}>${item.amount}</Text>
        <Text style={styles.recordAmount}>
          {item.description === "" ? "---" : item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {isAdmin && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Enter Expense amount"
            keyboardType="numeric"
            value={expenseAmount}
            onChangeText={(text) =>
              setExpenseAmount(text.replace(/[^0-9]/g, ""))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Expense Note"
            value={expensesNote}
            onChangeText={(text) =>
              setExpensesNote(text.replace(/[^a-zA-Z0-9]/g, ""))
            }
          />
          {qrImage ? (
            <View>
              {imageStatus === true ? (
                <Image source={{ uri: qrImage }} style={styles.qrImage} />
              ) : (
                <View></View>
              )}

              <Button title="Reselect Image" onPress={handleReselectImage} />
            </View>
          ) : (
            <Button title="Select Receipt Image" onPress={handleImageUpload} />
          )}
          <Button
            title="Add Expenses"
            onPress={makeExpense}
            disabled={expenseAmount === ""}
          />
        </View>
      )}

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
        Total Expenses: {totalExpenses}
      </Text>
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>Expense Records</Text>
        <FlatList
          data={expensesRecords}
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
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default ExpensesScreen;
