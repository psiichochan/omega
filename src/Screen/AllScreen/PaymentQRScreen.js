import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const PaymentQRScreen = ({ navigation, route }) => {
  const { donationAmount, date, donationNote } = route.params;
  // console.log(donationAmount, "ss");
  const [paymentImage, setPaymentImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [bankDetails, setBankDetails] = useState([]);

  const selectPaymentImage = async () => {
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
        setPaymentImage(result.uri);
        const imageName = result.uri.split("/").pop();
        setImageName(imageName);
      }
    } catch (error) {
      console.log("ImagePicker Error: ", error);
    }
  };

  // console.log(donationBody, "data");
  const [loading, setIsLoading] = useState(false);

  const getBankDetails = async () => {
    try {
      const response = await axios.get("http://3.6.89.38:9090/api/v1/bank/get");
      if (response.status === 200) {
        setBankDetails(response.data[0]);
        console.log(response.data[0]);
      } else {
        console.log(
          "Error saving bank details:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API request:", error);
    }
  };

  useEffect(() => {
    getBankDetails();
  });

  const [imageUrl, setImageUrl] = useState();
  let base64Url;

  async function GetMyProfileData() {
    const apiUrl = `http://3.6.89.38:9090/api/v1/fileAttachment/getFile?fileName=${bankDetails.imageName}`;

    const response = await axios.get(apiUrl);
    let profileData;

    if (response.status === 200) {
      base64Url = JSON.stringify(response.data.data.data);
      const base64Icon = `data:image/png;base64,${base64Url}`;
      profileData = base64Icon;
      setImageUrl(profileData);
    }
    return profileData;
  }
  useEffect(() => {
    GetMyProfileData();
  });

  async function ImageUpload() {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: paymentImage,
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
          "QR Code Uploaded successfully!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log("QR Code Uploaded successfully!");
      } else {
        ToastAndroid.showWithGravity(
          `Error Uploading QR Code: ${response.status} ${response.statusText}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log(
          "Error Uploading QR Code:",
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

  async function saveDonation() {
    setIsLoading(true);
    const userDetails = await AsyncStorage.getItem("UserDetails");
    const allDetails = JSON.parse(userDetails);

    try {
      const donationBody = {
        username: allDetails.firstName,
        amount: donationAmount,
        note: donationNote,
        screenshot: imageName,
        date: date,
      };
      const response = await axios.post(
        `http://3.6.89.38:9090/api/v1/donation/save`,
        donationBody
      );
      if (response.status === 200) {
        ImageUpload();
        ToastAndroid.showWithGravity(
          "Donation added successfully",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log("response", response);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Something went wrong ${error}",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.log("tt", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.containerMain}>
      <Text style={styles.payUsing}>Please Pay Using Below QR</Text>
      <Text style={[styles.payUsing, { paddingTop: 20 }]}>
        Amount : NPR {donationAmount}
      </Text>
      <Image source={{ uri: imageUrl }} style={styles.imageQR} />

      <View style={[{ top: 100, left: 10 }]}>
        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
          OR
        </Text>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Bank Account Details:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Name: {bankDetails.name}
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Account no: {bankDetails.accountNo}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            IFSC Code: {bankDetails.ifscCode}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            UPI Id: {bankDetails.upiId}
          </Text>
        </View>
        <View style={{ top: 20 }}>
          <Text
            style={{
              textAlign: "center",
              right: 10,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            After Making Payment Please Upload the ScreenShot By Clicking Below
            Button
          </Text>
        </View>

        {/* Image Upload Section */}
        {paymentImage && (
          <Image source={{ uri: paymentImage }} style={styles.uploadedImage} />
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={selectPaymentImage}
        >
          <Text style={styles.uploadText}>Upload Payment Screenshot</Text>
        </TouchableOpacity>
        {loading === true ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={saveDonation}>
            <Text style={styles.uploadText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* <Button /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  containerMain: {
    flex: 1,
    height: "auto",
    backgroundColor: "white",
    marginTop: hp(5),
  },
  imageQR: {
    width: 200,
    height: 200,
    alignSelf: "center",
    top: 80,
  },
  payUsing: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: 20,
  },
  uploadButton: {
    marginTop: 30,
    backgroundColor: "#4285f4",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignSelf: "center",
  },

  uploadText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  uploadedImage: {
    width: 200,
    height: 100,
    marginTop: 10,
    top: 20,
    resizeMode: "contain",
  },
});

export default PaymentQRScreen;
