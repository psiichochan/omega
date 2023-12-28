import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("member"); // Default role

  const handleSignup = async () => {
    if (
      !name ||
      !surname ||
      !username ||
      !mobile ||
      !email ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      ToastAndroid.showWithGravity(
        "Please fill in all fields",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      ToastAndroid.showWithGravity(
        "Invalid mobile number format",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.showWithGravity(
        "Invalid email format",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        "Passwords do not match",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    try {
      const apiUrl = "http://3.6.89.38:9090/api/v1/userController/signup";

      const userData = {
        firstName: name,
        lastName: surname,
        username: username,
        mobileno: mobile,
        email: email,
        address: address,
        password: password,
        confirmPassword: confirmPassword,
      };

      console.log("body: ", userData);

      const response = await axios.post(apiUrl, JSON.stringify(userData), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          "SignUp Successfully. Please Wait While Admin Approves Your request",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        navigation.navigate("Login");
      } else {
        ToastAndroid.showWithGravity(
          response.data,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error cases here
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.signupText}>Sign Up</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="black"
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="black"
              onChangeText={(text) => setSurname(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Username"
              placeholderTextColor="black"
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Mobile No."
              placeholderTextColor="black"
              onChangeText={(text) => setMobile(text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email ID"
              placeholderTextColor="black"
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Address"
              placeholderTextColor="black"
              onChangeText={(text) => setAddress(text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirm Password"
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
          </View>

          {/* Role Dropdown */}
          {/* <View style={styles.inputView}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.inputText}
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Member" value="member" />
              </Picker>
            </View> */}

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
            <Text style={styles.signupBtnText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  signupText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 40,
    textAlign: "center",
  },
  inputView: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  signupBtn: {
    width: "80%",
    backgroundColor: "#b981c7",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  signupBtnText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SignupScreen;
