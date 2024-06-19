/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const PaymentMethods = () => {
  const navigation = useNavigation();

  const [qrImage, setQRImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [bankDetails, setBankDetails] = useState({
    name: '',
    accountNo: '',
    bankName: '',
    ifscCode: '',
    upiId: '',
  });
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
        setQRImage(imagePath);

        setImageName(name);
        // setSelectedImage(true); // Set selected image state to true
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error in ImagePicker: ${error}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prevDetails => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleReselectImage = () => {
    setQRImage(null);
  };
  const [loadingImage, setLoadingImage] = useState(false);

  const getBankDetails = async () => {
    const apiUrl = 'http://65.2.123.63:8080/api/v1/bank/get';

    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const data = response.data;
      setBankDetails(data[0]);
    }
  };

  useEffect(() => {
    getBankDetails();
  });

  async function ImageUpload() {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: qrImage,
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
    } finally {
      setLoadingImage(false);
    }
  }

  const saveDataToAPI = async () => {
    setLoadingImage(true);
    try {
      const requestBody = {
        id: 355,
        name: bankDetails.name,
        accountNo: bankDetails.accountNo,
        ifscCode: bankDetails.ifscCode,
        upiId: bankDetails.upiId,
        imageName: qrImage ? imageName : null,
        status: 'true',
      };

      const response = await axios.put(
        'http://65.2.123.63:8080/api/v1/bank/details/update',
        JSON.stringify(requestBody),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        ImageUpload();
        setLoadingImage(false);
        ToastAndroid.showWithGravity(
          'Bank details saved successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // ImageUpload();
        navigation.goBack();
      } else {
        ToastAndroid.showWithGravity(
          'Error saving bank details:',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Qr}>QR</Text>
      <View style={styles.qrContainer}>
        <Text style={styles.label}>Upload QR Code</Text>
        {qrImage ? (
          <View>
            <Image source={{uri: qrImage}} style={styles.qrImage} />
            <Button title="Reselect Image" onPress={handleReselectImage} />
          </View>
        ) : (
          <Button
            title="Select QR Code"
            onPress={handleImageUpload}
            color="#00539C"
          />
        )}
      </View>
      <View style={styles.bankDetailsContainer}>
        <Text style={styles.label}>Bank Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Account Holder Name"
          value={bankDetails.name}
          onChangeText={text => handleBankDetailsChange('accountHolder', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Account Number"
          value={bankDetails.accountNo}
          onChangeText={text => handleBankDetailsChange('accountNumber', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="IFSC CODE"
          value={bankDetails.ifscCode}
          onChangeText={text => handleBankDetailsChange('ifscCode', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="UPI ID"
          value={bankDetails.upiId}
          onChangeText={text => handleBankDetailsChange('upiId', text)}
        />
      </View>
      <Button title="Save Data" onPress={saveDataToAPI} color="#00539C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  Qr: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  qrContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  bankDetailsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default PaymentMethods;
