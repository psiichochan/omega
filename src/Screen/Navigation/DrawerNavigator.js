/* eslint-disable react/no-unstable-nested-components */ /* eslint-disable prettier/prettier */
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

const ExpandableList = ({nav, items, onMainListClick, onSubListClick}) => {
  const [selectedValue, setSelectedValue] = useState(1);

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginTop: hp(2)}}>
        <TouchableOpacity
          onPress={() => {
            setSelectedValue({...selectedValue, [index]: item.value});
            onMainListClick(nav, item, null);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              marginLeft: 15,
            }}>
            {item.icon}
            <Text style={[styles.drawerLabelStyle, {marginLeft: 15}]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <View
          style={{
            borderColor: '#AE285D',
            borderWidth: 2,
            width: wp(58),
            borderRadius: 3,
            alignSelf: 'center',
          }}
        /> */}
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
  const items = [
    {
      title: 'Member Management',
      value: 'Value 1',
      componentName: 'MemberManagement',
    },
    {
      title: 'Payment Management',
      value: 'Value 2',
      componentName: 'PaymentManagement',
    },

    {
      title: 'Send Notifications',
      value: 'Value 5',
      componentName: 'SendMessageScreen',
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
    const apiUrl = `http://3.6.89.38:9090/api/v1/userController/getUser/username?username=${userDetails.username}`;
    console.log(userDetails);
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      setImageName(response.data.profile_pic);
    } else {
      console.log(response.status);
    }
  };

  let base64Url;
  async function GetMyProfileData() {
    const apiUrl = `http://3.6.89.38:9090/api/v1/fileAttachment/getFile?fileName=${imageName}`;

    const response = await axios.get(apiUrl);
    let profileData;
    console.log(response.status);
    if (response.status === 200) {
      base64Url = JSON.stringify(response.data.data.data);

      const base64Icon = `data:image/png;base64,${base64Url}`;
      profileData = base64Icon;
      setImageUrl(profileData);
    } else {
    }
    return profileData;
  }
  useEffect(() => {
    GetUserDetails();
    GetMyProfileData();
  });
  return (
    <Drawer.Navigator
      drawerContent={props => {
        return (
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
              items={items}
              onMainListClick={onClickMainMenu}
            />
          </View>
        );
      }}>
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
});
