/* eslint-disable react-native/no-inline-styles */ /* eslint-disable react/no-unstable-nested-components */ /* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from '../AllScreen/TabNavigator';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

const ExpandableList = ({nav, items, onMainListClick}) => {
  const [selectedValue, setSelectedValue] = useState(1);

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginTop: hp(2)}}>
        <TouchableOpacity
          onPress={() => {
            setSelectedValue({...selectedValue, [index]: item.value});
            onMainListClick(nav, item, null);
          }}>
          <View style={styles.iconContainer}>
            {item.icon}
            <Text style={[styles.drawerLabelStyle, {marginLeft: 15}]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

function DrawerNavigator({navigation}) {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const GetIsAdmin = async () => {
      const userDetails1 = await AsyncStorage.getItem('UserDetails');
      const allDetails = JSON.parse(userDetails1);
      const hello = allDetails.email === 'rpdhole25@gmail.com' ? true : false;
      setIsAdmin(hello);
      console.log('isAdmin: ', hello);
    };
    GetIsAdmin();
  }, []);

  const items = [
    {
      title: 'Member Management',
      value: 'Value 1',
      componentName: 'MemberManagement',
      adminOnly: true,
    },
    {
      title: 'Payment Management',
      value: 'Value 2',
      componentName: 'PaymentManagement',
      // adminOnly: true, // Add this property for admin-only items
    },
    {
      title: 'Send Notifications',
      value: 'Value 5',
      componentName: 'SendMessageScreen',
      adminOnly: true,
    },
    {
      title: 'Notification',
      value: 'Value 11',
      componentName: 'Notification',
    },
    {
      title: 'Reports',
      value: 'Value 10',
      componentName: 'ReportsScreen',
    },
    {
      title: 'App Settings',
      value: 'Value 12',
      componentName: 'BasicInfo',
      adminOnly: true,
    },
    {
      title: 'Log Out',
      value: 'Value 13',
      componentName: 'Log Out',
    },
  ];

  const navigateToScreen = (nav, screenName, data) => {
    switch (screenName) {
      case 'MemberManagement':
        nav.navigate('MemberManagement');
        break;
      case 'PaymentManagement':
        nav.navigate('PaymentManagement');
        break;
      case 'SendMessageScreen':
        nav.navigate('SendMessageScreen');
        break;
      case 'Notification':
        nav.navigate('NotificationScreen');
        break;
      case 'ReportsScreen':
        nav.navigate('ReportsScreen');
        break;
      case 'BasicInfo':
        nav.navigate('BasicInfo');
        break;
      case 'Log Out':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes, sure',
              onPress: async () => {
                try {
                  navigation.navigate('FirstScreen');
                  await AsyncStorage.removeItem('UserDetails');
                } catch (error) {
                  console.error('Error clearing UserDetails:', error);
                }
              },
            },
          ],
          {cancelable: true},
        );
        break;
      default:
        return null;
    }
  };

  const onClickMainMenu = (nav, item, subIndex) => {
    navigateToScreen(nav, item.componentName, null);
  };

  const [imageUrl, setImageUrl] = useState();
  const [imageName, setImageName] = useState();

  const GetUserDetails = async () => {
    const userDetailsJson = await AsyncStorage.getItem('UserDetails');
    const userDetails = JSON.parse(userDetailsJson);
    const apiUrl = `http://65.2.123.63:8080/api/v1/userController/getUser/username?username=${userDetails.username}`;
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      setImageName(response.data.profile_pic);
    }
  };

  let base64Url;
  async function GetMyProfileData() {
    const apiUrl = `http://65.2.123.63:8080/api/v1/fileAttachment/getFile?fileName=${imageName}`;

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
    GetUserDetails();
    GetMyProfileData();
  }, [imageName]);

  const filteredItems = items.filter(item => !item.adminOnly || isAdmin);

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <View>
          {imageName ? (
            <Image source={{uri: imageUrl}} style={styles.imageQR} />
          ) : (
            <Image
              source={require('../../../assets/AllImages/profilePic.jpg')}
              style={styles.imageQR}
            />
          )}
          <ExpandableList
            nav={navigation}
            items={filteredItems}
            onMainListClick={onClickMainMenu}
          />
        </View>
      )}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;

const styles = StyleSheet.create({
  drawerLabelStyle: {
    fontSize: hp(1.9),
    fontWeight: '700',
    color: '#1B1B1B',
  },
  imageQR: {
    width: wp(50),
    height: hp(20),
    alignSelf: 'center',
    borderRadius: 100,
    marginTop: hp(3),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginLeft: 15,
  },
});
