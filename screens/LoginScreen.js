import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");

      try {
        if (token) {
          navigation.navigate("Home");
        } else {
          //token not found, show loggin screen
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);

        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login Error", error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        padding: 10,
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4a55a2", fontSize: 17, fontWeight: "600" }}>
            Sign In
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              marginTop: 15,
            }}
          >
            Sign In Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: 300,
                marginVertical: 15,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your Email"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                fontSize: password ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: 300,
                marginVertical: 15,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your password"
              secureTextEntry={true}
            />
          </View>
        </View>

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#4a55a2",
            padding: 15,
            marginTop: 50,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 15 }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
