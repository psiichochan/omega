/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const AppSetting = ({navigation}) => {
  const handleBasicInfoPress = () => {
    navigation.navigate('BasicInfo');
  };

  const handleBankDetailsPress = () => {
    navigation.navigate('PaymentMethods');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Basic Info"
          onPress={handleBasicInfoPress}
          style={styles.button}
        />
        <Button
          title="Bank Details"
          onPress={handleBankDetailsPress}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default AppSetting;
