import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (loginSuccess) {
      // Navigate to the next screen after loginSuccess is set to true
      navigation.navigate("TabNavigator");

      // Reset loginSuccess to false for subsequent logins
      setLoginSuccess(false);

      // Clear text fields
      setUsername("");
      setPassword("");
      setResetKey((prevKey) => prevKey + 1);
    }
  }, [loginSuccess, navigation]);

  const handleLogin = async () => {
    try {
      const requestBody = {
        email: username,
        password: password,
      };
      const response = await axios.post(
        "http://3.6.89.38:9090/api/v1/userController/login",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          "Login Successfully",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        const userDetails = JSON.stringify(response.data);
        await AsyncStorage.setItem("UserDetails", userDetails);

        navigation.navigate("TabNavigator", {
          isAdmin: username === "rpdhole25@gmail.com" ? true : false,
        });
        console.log(response.data);
      } else if (response.status === 401) {
        ToastAndroid.showWithGravity(
          "Please Enter Valid Credentials",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          "Server Error",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={styles.container}>
        <Text style={styles.logo}>LOGIN</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email Id"
            placeholderTextColor="black"
            onChangeText={(text) => setUsername(text)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, { bottom: 20 }]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signup}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
  },
  signup: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: "10",
    color: "black",
    fontStyle: "normal",
    textDecorationLine: "underline",
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#b981c7",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  signupBtn: {
    width: "80%",

    borderRadius: 25,
    paddingLeft: 60,
  },
  loginText: {
    // color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LoginScreen;
