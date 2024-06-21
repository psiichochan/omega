/* eslint-disable react-native/no-inline-styles */ /* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function MyProfileScreen() {
  const [qrImage1, setqrImage1] = useState(null);
  const [imageName1, setImageName1] = useState('');
  const [qrImage2, setqrImage2] = useState(null);

  const [imageName2, setImageName2] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [userName, setUserName] = useState('');
  const [details, setDetails] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const extractImageName1 = path => {
    const pathArray = path.split('/');
    const filename = pathArray[pathArray.length - 1];
    return filename;
  };
  const extractImageName2 = path => {
    const pathArray = path.split('/');
    const filename = pathArray[pathArray.length - 1];
    return filename;
  };

  const handleImageSelect1 = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      if (image) {
        const name1 = extractImageName1(image.path);
        const imagePath = image.path;
        setqrImage1(imagePath);
        setImageName1(name1);
      }
    } catch (error) {}
  };

  const handleImageSelect2 = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      if (image) {
        const name1 = extractImageName2(image.path);
        const imagePath = image.path;
        setqrImage2(imagePath);
        setImageName2(name1);
      }
    } catch (error) {}
  };

  async function ImageUpload1() {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: qrImage1,
        name: imageName1,
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

  async function ImageUpload2() {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: qrImage2,
        name: imageName2,
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
  const handleEdit = () => {
    if (!editMode) {
      setName(details.firstName);
      setMobileNo(details.mobileNo);
      setEmail(details.email);
      setAddress(details.address);
      setBankName(details.bank_name);
      setAccountNo(details.accountNo);
      setIfscCode(details.ifscCode);
      setUpiId(details.upiId);
      setImageName1(details.profile_pic);
      setImageName2(details.imageName);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        id: details.id,
        username: details.username,
        email: editMode ? email : details.email,
        password: details.password,
        firstName: editMode ? name : details.firstName,
        lastName: details.lastName,
        mobileNo: editMode ? mobileNo : details.mobileNo,
        address: editMode ? address : details.address,
        confirmPassword: details.confirmPassword,
        approved: details.approved,
        role: details.role,
        profile_pic: editMode ? imageName1 : details.profile_pic,
        bank_name: editMode ? bankName : details.bank_name,
        accountNo: editMode ? accountNo : details.accountNo,
        ifscCode: editMode ? ifscCode : details.ifscCode,
        upiId: editMode ? upiId : details.upiId,
        imageName: editMode ? imageName2 : details.imageName,
        status: details.status,
        created_date: details.created_date,
      };

      const response = await axios.put(
        'http://65.2.123.63:8080/api/v1/userController/update',
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ImageUpload1();
        ImageUpload2();
        ToastAndroid.showWithGravity(
          'Profile Updated successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setEditMode(false);
      } else {
        ToastAndroid.showWithGravity(
          `Error Updating Profile: ${response.status} ${response.statusText}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error Updating Profile: ${error}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      console.error('Error during API request:', error);
    }
  };

  const storedDetails = useCallback(async () => {
    const data = await AsyncStorage.getItem('UserDetails');
    const parsedData = JSON.parse(data);
    setUserName(parsedData.username);
    return parsedData.username;
  }, []);

  const getDetails = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/userController/getUser/username?username=${userName}`;
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setDetails(response.data);
      }
    } catch (error) {}
  }, [userName]);
  const GetQrImage = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${details.imageName}`;
      const response = await axios.get(apiUrl);
      let profileData;
      let base64Url;
      if (response.status === 200) {
        base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        profileData = base64Icon;
        setqrImage2(profileData);
      }
    } catch (error) {}
  }, [details.imageName]);

  const GetProfileImage = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${details.profile_pic}`;
      const response = await axios.get(apiUrl);
      let profileData;
      let base64Url;
      if (response.status === 200) {
        base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        profileData = base64Icon;
        setqrImage1(profileData);
      }
    } catch (error) {}
  }, [details.profile_pic]);

  const GetQRImage = useCallback(async () => {
    try {
      const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${details.imageName}`;
      const response = await axios.get(apiUrl);
      let profileData;
      let base64Url;
      if (response.status === 200) {
        base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        profileData = base64Icon;
        setqrImage2(profileData);
      }
    } catch (error) {}
  }, [details.imageName]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = await storedDetails();
        if (username) {
          await getDetails();
          await GetQrImage();
          await GetProfileImage();
          await GetQRImage();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call fetchData function immediately

    // Note: You should include the functions and variables that are used inside the effect in the dependency array to avoid lint warnings.
  }, [
    userName,
    storedDetails,
    getDetails,
    GetQrImage,
    GetProfileImage,
    GetQRImage,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyBoardStyle}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View>
          <View style={styles.qrContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Image source={{uri: qrImage1}} style={styles.qrImage1} />
                {editMode && (
                  <TouchableOpacity onPress={handleImageSelect1}>
                    <Text style={{color: 'black'}}>Change Profile Pic</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.qrContainer} />
              <View style={styles.buttonContainer1}>
                {editMode ? (
                  <Button
                    title="Save"
                    onPress={handleSave}
                    color="#00539C"
                    style={{width: wp(2)}}
                  />
                ) : (
                  <Button
                    title="Edit"
                    onPress={handleEdit}
                    color="#00539C"
                    style={{width: wp(2)}}
                  />
                )}
              </View>
            </View>
          </View>
          <Text style={styles.buttonContainer}>Personal Information</Text>

          {/* Text and TextInput Components */}
          <View style={{alignItems: 'center'}}>
            <Text style={styles.text1}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="black"
              value={editMode ? name : details.firstName}
              onChangeText={text => {
                setName(text);
              }}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(58)}]}>
              Mobile No
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              placeholderTextColor="black"
              value={editMode ? mobileNo : details.mobileNo}
              onChangeText={text => setMobileNo(text)}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(58)}]}>
              Email Id :{' '}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email Id"
              placeholderTextColor="black"
              value={editMode ? email : details.email}
              onChangeText={text => setEmail(text)}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(58)}]}>
              Address:{' '}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="black"
              value={editMode ? address : details.address}
              onChangeText={text => setAddress(text)}
              editable={editMode}
            />
          </View>
          <View style={styles.buttonContainer} />
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Payment Details:
          </Text>
          <View style={styles.qrContainer}>
            <Image
              source={{uri: qrImage2}}
              style={[styles.qrImage1, {borderRadius: 0}]}
            />
            {editMode && (
              <TouchableOpacity onPress={handleImageSelect2}>
                <Text style={{color: 'black'}}>Change QR Code</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(56)}]}>
              Bank Name:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              placeholderTextColor="black"
              value={editMode ? bankName : details.bank_name}
              onChangeText={text => setBankName(text)}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(53)}]}>
              Account No.:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Account No."
              placeholderTextColor="black"
              value={editMode ? accountNo : details.accountNo}
              onChangeText={text => setAccountNo(text)}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(58)}]}>
              Ifsc Code:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ifsc Code"
              placeholderTextColor="black"
              value={editMode ? ifscCode : details.ifscCode}
              onChangeText={text => setIfscCode(text)}
              editable={editMode}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.text1, {paddingRight: wp(64)}]}>Upi ID:</Text>
            <TextInput
              style={styles.input}
              placeholder="Upi Id"
              placeholderTextColor="black"
              value={editMode ? upiId : details.upiId}
              onChangeText={text => setUpiId(text)}
              editable={editMode}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default MyProfileScreen;

const styles = StyleSheet.create({
  qrImage1: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignContent: 'flex-start',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 100, // Set the borderRadius to half of width/height to make it circular
  },
  buttonContainer1: {
    borderColor: 'black',
    borderWidth: 2,
    height: wp(15),
    borderRadius: 3,
    alignSelf: 'center',
    marginLeft: wp(7),
  },
  scrollViewStyle: {flexGrow: 1},
  keyBoardStyle: {flex: 1, backgroundColor: 'white'},
  qrContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
    marginTop: 20,
    marginLeft: wp(10),
    justifyContent: 'space-evenly',
  },

  input: {
    height: 40,
    width: wp(80),
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    color: 'black',
    borderRadius: 10,
    padding: 10,
  },
  text1: {
    paddingRight: wp(65),
    color: 'black',
    fontWeight: '700',
    fontSize: hp(1.8),
  },
  buttonContainer: {
    // marginTop: 20,
    width: wp(20),
    alignSelf: 'center',
    marginLeft: wp(20),
  },
});
