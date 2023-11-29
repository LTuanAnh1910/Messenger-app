import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequests from "../components/FriendRequests";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendsRequests();
  }, []);

  const fetchFriendsRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/friend-request/${userId}`
      );

      if (response.status === 200) {
        const friendRequestsData = response.data.map((friendRequests) => ({
          _id: friendRequests._id,
          name: friendRequests.name,
          email: friendRequests.email,
          image: friendRequests.image,
        }));
        setFriendRequests(friendRequestsData);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };
  console.log(friendRequests);
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your Friends Requests</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequests
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
