/* eslint-disable react-native/no-inline-styles */ /* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PaymentQRScreen = ({navigation, route}) => {
  const {donationAmount, date, donationNote} = route.params;
  const [paymentImage, setPaymentImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [bankDetails, setBankDetails] = useState([]);

  const extractImageName = path => {
    const pathArray = path.split('/');
    const filename = pathArray[pathArray.length - 1];
    return filename;
  };

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      if (image) {
        const name = extractImageName(image.path);
        const imagePath = image.path;
        setPaymentImage(imagePath);

        setImageName(name);
      }
    } catch (error) {}
  };

  const [loading, setIsLoading] = useState(false);

  const getBankDetails = async () => {
    try {
      const response = await axios.get(
        'http://65.2.123.63:8080/api/v1/bank/get',
      );
      if (response.status === 200) {
        setBankDetails(response.data[0]);
      } else {
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  useEffect(() => {
    getBankDetails();
  });

  const [imageUrl, setImageUrl] = useState();
  let base64Url;

  async function GetMyProfileData() {
    const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${bankDetails.imageName}`;

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
      formData.append('file', {
        uri: paymentImage,
        name: imageName,
        fileName: 'image',
        type: 'image/jpg',
      });
      const response = await axios.post(
        'http://65.2.123.63:8080/api/v1/fileAttachment/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'QR Code Uploaded successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          `Error Uploading QR Code: ${response.status} ${response.statusText}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error Uploading QR Code: ${error}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      console.error('Error during API request:', error);
    }
  }

  async function saveDonation() {
    setIsLoading(true);
    const userDetails = await AsyncStorage.getItem('UserDetails');
    const allDetails = JSON.parse(userDetails);

    try {
      const donationBody = {
        username: allDetails.username,
        amount: donationAmount,
        note: donationNote,
        screenshot: imageName,
        date: date,
      };
      const response = await axios.post(
        'http://65.2.123.63:8080/api/v1/donation/save',
        donationBody,
      );
      if (response.status === 200) {
        ImageUpload();
        ToastAndroid.showWithGravity(
          'Donation added successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Something went wrong ${error}',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Text style={styles.payUsing}>Please Pay Using Below QR</Text>
      <Text style={styles.payUsing}>Amount : NPR {donationAmount}</Text>
      <Image source={{uri: imageUrl}} style={styles.imageQR} />

      <View style={styles.innerContainer}>
        <Text style={styles.Or}>OR</Text>
        <View>
          <Text style={styles.bankDetails}>Bank Account Details:</Text>
          <Text style={styles.bankDetails}>Name: {bankDetails.name}</Text>

          <Text style={styles.bankDetails}>
            Account no: {bankDetails.accountNo}
          </Text>
          <Text style={styles.bankDetails}>
            IFSC Code: {bankDetails.ifscCode}
          </Text>
          <Text style={styles.bankDetails}>UPI Id: {bankDetails.upiId}</Text>
        </View>
        <View style={styles.hello}>
          <Text style={styles.longText}>
            After Making Payment Please Upload the ScreenShot By Clicking Below
            Button
          </Text>
        </View>

        {/* Image Upload Section */}
        {paymentImage && (
          <Image source={{uri: paymentImage}} style={styles.uploadedImage} />
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'white',
  },
  longText: {
    textAlign: 'center',
    right: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  hello: {
    top: hp(2),
  },

  innerContainer: {top: 100, left: 10},
  Or: {
    textAlign: 'center',
    fontSize: hp(4),
    fontWeight: 'bold',
    color: 'black',
  },
  imageQR: {
    width: wp(50),
    height: hp(20),
    alignSelf: 'center',
    top: 80,
  },
  bankDetails: {fontSize: 20, fontWeight: 'bold', color: 'black'},
  payUsing: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    top: 20,
    color: 'black',
  },
  uploadButton: {
    marginTop: hp(3),
    backgroundColor: '#00539C',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  submitBtn: {
    marginTop: hp(3),
    backgroundColor: '#00539C',
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignSelf: 'center',
  },

  uploadText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  uploadedImage: {
    width: wp(30),
    height: hp(20),
    // marginTop: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default PaymentQRScreen;
