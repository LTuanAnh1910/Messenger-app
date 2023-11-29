import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            onPress={() => navigation.navigate("Chat")}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  const handleLogOut = () => {
    const clearAuthToken = async () => {
      await AsyncStorage.removeItem("authToken");
      navigation.replace("Login");
    };
    clearAuthToken();
  };

  console.log("users", users);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10 }}>
        {users?.map((item, index) => (
          <View key={index} style={{}}>
            <User key={index} item={item} />
          </View>
        ))}
      </View>
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Pressable
          onPress={handleLogOut}
          style={{
            flexDirection: "row",
            gap: 5,
            backgroundColor: "white",
            padding: 10,
            width: 150,
            borderRadius: 7,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 30,
          }}
        >
          <MaterialIcons name="logout" size={24} color="red" />
          <Text
            style={{
              textAlign: "center",
              color: "red",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Log out
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
