/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import {FloatingAction} from 'react-native-floating-action';
import XLSX from 'xlsx';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';

const ExpenseReportsScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  const GetAllExpenses = async () => {
    const apiUrl = `http://3.6.89.38:9090/api/v1/expenses/getAll?filter=${filter}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        setExpenses(response.data.data);
      } else {
        ToastAndroid.showWithGravity(
          'Error While Fetching Donation reports Api Or No Data Present',
          response.status,
          ToastAndroid.BOTTOM,
          ToastAndroid.CENTER,
        );
        setExpenses([]);
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error While Fetching Expense reports Api',
        ToastAndroid.BOTTOM,
        ToastAndroid.CENTER,
      );
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllExpenses();
  }, [filter]); // Trigger API call when the filter changes

  const handleFilterChange = value => {
    setFilter(value);
  };

  const exportDataToExcel = async () => {
    try {
      const filePath = DownloadDirectoryPath + '/expenses.xlsx';

      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(expenses);
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

      await RNFS.writeFile(filePath, wbout, 'ascii');
      Alert.alert('Export Data Successfully', `File saved to: ${filePath}`);
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
      Alert.alert('Error exporting data to Excel');
    }
  };

  return (
    <View style={styles.container}>
      <FloatingAction
        actions={[{text: 'Excel', name: 'download', color: '#4CAF50'}]}
        onPressItem={name => {
          if (name === 'download') {
            exportDataToExcel();
          }
        }}
        color="green"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Expenses</Text>

        {/* Dropdown filter */}
        <RNPickerSelect
          onValueChange={handleFilterChange}
          items={[
            {label: 'All', value: 'all'},
            {label: 'Day', value: 'day'},
            {label: 'Week', value: 'week'},
            {label: 'Month', value: 'month'},
          ]}
          value={filter}
          style={pickerSelectStyles}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          expenses.map(expense => (
            <View key={expense.expenseId} style={styles.card}>
              <Text style={styles.text2}>
                Description: {expense.description}
              </Text>
              <Text style={styles.text2}>Amount: {expense.amount}</Text>
              <Text style={styles.text2}>Category: {expense.category}</Text>
              <Text style={styles.text2}>
                Expense Date:{' '}
                {expense.dateOfExpense === null
                  ? 'N/A'
                  : new Date(expense.dateOfExpense).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  card: {
    backgroundColor: '#00539C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  text2: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
});

export default ExpenseReportsScreen;
