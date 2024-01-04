/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';

function ExpenseCard({expense}) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(true);

  async function GetMyProfileData() {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/fileAttachment/getFile?fileName=${expense.imageName}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const base64Url = JSON.stringify(response.data.data.data);
        const base64Icon = `data:image/png;base64,${base64Url}`;
        setImageUrl(base64Icon);
      } else {
        // Handle error appropriately
        ToastAndroid.showWithGravity(
          'Failed to fetch image',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      // Handle network or other errors
      ToastAndroid.showWithGravity(
        'Network error or something went wrong',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      // Update loading state
      setLoading(false);
    }
  }

  useEffect(() => {
    GetMyProfileData();
  }, []);

  const dateString = expense.dateOfExpense;
  const [datePart] = dateString.split('T');

  return (
    <View style={styles.recordCard}>
      <Text style={styles.recordAmount}>
        Date: {expense.dateOfExpense === null ? '---' : datePart}
      </Text>
      <Text style={styles.recordAmount}>Amount : ${expense.amount}</Text>
      {loading ? (
        <Text>Loading image...</Text>
      ) : (
        <Image style={styles.paymentImage} source={{uri: imageUrl}} />
      )}
      <Text style={styles.recordAmount}>
        Note: {expense.description === '' ? '---' : expense.description}
      </Text>
    </View>
  );
}

const ExpensesScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensesNote, setExpensesNote] = useState('');
  const [expensesRecords, setExpensesRecords] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState('');
  const [qrImage, setQRImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [selectedImage, setSelectedImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalDonation, setTotalDonation] = useState();
  const [totalBorrow, setTotalBorrow] = useState();
  const [availableExpense, setAvailableExpense] = useState(0);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    fetchExpensesList();
  }, [selectedFilter]);

  const getTotalDonation = async () => {
    try {
      const apiUrl =
        'http://3.6.89.38:9090/api/v1/donation/get/approved?filter=all';

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const totalAmount = response.data.totalAmount;
        setTotalDonation(totalAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalBorrow = async () => {
    try {
      const apiUrl =
        'http://3.6.89.38:9090/api/v1/borrowing/get/approved?filter=all';

      const response = await axios.get(apiUrl);

      const userDetails1 = await AsyncStorage.getItem('UserDetails');
      const allDetails = JSON.parse(userDetails1);
      const hello = allDetails.email === 'rpdhole25@gmail.com' ? true : false;
      setIsAdmin(hello);

      if (response.status === 200) {
        const totalAmount = response.data.totalAmount;
        setTotalBorrow(totalAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalBorrow();
    getTotalDonation();
  }, []);

  useEffect(() => {
    calculateAvailableExpense();
  }, [totalDonation, totalBorrow]);

  const calculateAvailableExpense = () => {
    if (
      isAdmin &&
      totalDonation !== undefined &&
      totalBorrow !== undefined &&
      totalExpenses !== undefined
    ) {
      console.log(totalBorrow, totalDonation, totalExpenses);
      const adminAvailableExpense = totalDonation - totalBorrow - totalExpenses;
      setAvailableExpense(adminAvailableExpense);
    }
  };

  const fetchExpensesList = async () => {
    try {
      const apiUrl = `http://3.6.89.38:9090/api/v1/expenses/getAll?filter=${selectedFilter}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setTotalExpenses(response.data.totalAmount);
        setExpensesRecords(response.data.data.reverse());
      } else if (response.status === 204) {
        setTotalExpenses('');
        setExpensesRecords([]);
      }
    } catch (error) {
      console.error('Error fetching expenses list:', error.message);
    } finally {
      setLoading(false);
    }
  };

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
        setSelectedImage(true);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

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
        'http://3.6.89.38:9090/api/v1/fileAttachment/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Receipt Code Uploaded successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log('Receipt Uploaded successfully!');
      } else {
        ToastAndroid.showWithGravity(
          `Error Uploading Receipt Code: ${response.status} ${response.statusText}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log(
          'Error Uploading Receipt Code:',
          response.status,
          response.statusText,
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

  const makeExpense = async () => {
    try {
      if (
        availableExpense <= 0 ||
        parseFloat(expenseAmount) > availableExpense
      ) {
        setQRImage('');
        setExpenseAmount('');
        setExpensesNote('');
        setSelectedImage(false);
        ToastAndroid.showWithGravity(
          'You have insufficient available expense.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }

      if (!selectedImage) {
        ToastAndroid.showWithGravity(
          'Please select an image',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }

      const amount = parseFloat(expenseAmount);
      if (isNaN(amount) || amount <= 0) {
        ToastAndroid.showWithGravity(
          'Invalid expense amount',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }

      const userDetails = await AsyncStorage.getItem('UserDetails');
      const allDetails = JSON.parse(userDetails);

      const expenseData = {
        description: expensesNote,
        amount: expenseAmount,
        category: 'Food',
        dateOfExpense: new Date().toISOString(),
        userId: allDetails.id,
        imageName: imageName,
      };

      const response = await axios.post(
        'http://3.6.89.38:9090/api/v1/expenses/addExpenses',
        JSON.stringify(expenseData),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        await ImageUpload();
        setExpensesRecords(prevRecords => [...prevRecords, expenseData]);
        setExpenseAmount('');
        setExpensesNote('');
        setQRImage('');
        fetchExpensesList();
        setSelectedImage(false);
      } else {
        console.log('Failed to add expense. Server response:', response.status);
      }
    } catch (error) {
      console.error('Error making expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.expenses}>Expense's</Text>
      {isAdmin && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Enter Expense amount"
            keyboardType="numeric"
            value={expenseAmount}
            onChangeText={text => setExpenseAmount(text.replace(/[^0-9]/g, ''))}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Expense Note"
            value={expensesNote}
            onChangeText={text => setExpensesNote(text)}
          />
          {selectedImage && (
            <Image source={{uri: qrImage}} style={styles.image1} />
          )}

          <Button
            title="Select Receipt Image"
            onPress={handleImageUpload}
            color={'#00539C'}
          />

          <View style={{marginTop: hp(2)}}>
            <Button
              title="Add Expenses"
              onPress={makeExpense}
              disabled={expenseAmount === ''}
              color={'#00539C'}
            />
          </View>
        </View>
      )}

      <RNPickerSelect
        placeholder={{label: 'Select Filter', value: null}}
        onValueChange={value => setSelectedFilter(value)}
        items={[
          {label: 'Day', value: 'day'},
          {label: 'Week', value: 'week'},
          {label: 'Month', value: 'month'},
          {label: 'All', value: 'all'},
        ]}
      />
      <Text style={styles.totalExpense}>Total Expenses: {totalExpenses}</Text>
      {isAdmin && (
        <Text style={styles.totalExpense}>
          Available Expense: {availableExpense}
        </Text>
      )}
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>Expense Records</Text>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={expensesRecords}
            renderItem={expense => (
              <ExpenseCard key={expense.id} expense={expense.item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
    top: 10,
  },
  totalExpense: {fontSize: 15, fontWeight: 'bold', color: 'black'},
  image1: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    alignContent: 'center',
  },
  image2: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    alignContent: 'center',
  },
  expenses: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#020000',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  recordsSection: {
    flex: 1,
    marginTop: 20,
  },
  paymentImage: {
    width: wp(30),
    height: hp(15),
    borderRadius: 5,
    marginBottom: 10,
  },
  recordCard: {
    width: wp(80),
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#00539C',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  recordAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default ExpensesScreen;
