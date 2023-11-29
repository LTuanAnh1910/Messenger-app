import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, sentFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http:localhost:8000/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          sentFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriend = async () => {
      const response = await fetch(`http://localhost:8000/friends/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserFriends(data);
      } else {
        console.log("error retreving user friend", response.status);
      }
    };
    fetchUserFriend();
  }, []);

  console.log("friendRequests", friendRequests);
  console.log("userFriends", userFriends);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://localhost:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              resizeMode: "cover",
            }}
            source={{ uri: item?.image }}
          />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
          <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
        </View>

        {userFriends.includes(item._id) ? (
          <Pressable
            onPress={() => sendFriendRequest(userId, item._id)}
            style={{
              backgroundColor: "#567189",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
              Friend
            </Text>
          </Pressable>
        ) : requestSent ||
          friendRequests.some((friend) => friend._id === item._id) ? (
          <Pressable
            onPress={() => sendFriendRequest(userId, item._id)}
            style={{
              backgroundColor: "#567189",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
              Request Sent
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFriendRequest(userId, item._id)}
            style={{
              backgroundColor: "#567189",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>
              Add Friend
            </Text>
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
