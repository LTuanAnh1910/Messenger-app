import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    axios
      .post("http://localhost:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registration succesfull", "You have been successfully");

        setName("");
        setEmail("");
        setPassword("");
        setImage("");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert(
          "Registration error",
          "An error occurred while registering"
        );
        console.log("Registration failed", error);
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
            Register
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              marginTop: 15,
            }}
          >
            Register Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: 300,
                marginVertical: 15,
              }}
              placeholderTextColor={"black"}
              placeholder="enter your Name"
            />
          </View>
          <View style={{ marginTop: 10 }}>
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
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Image
            </Text>

            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: 300,
                marginVertical: 15,
              }}
              placeholderTextColor={"black"}
              placeholder="Image"
            />
          </View>
        </View>

        <Pressable
          onPress={handleRegister}
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
            Register
          </Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 15 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
