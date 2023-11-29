import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  console.log(messages);
  useEffect(() => {
    fetchMessages();
  }, []);
  const getLastMessage = () => {
    const userMessage = messages.filter(
      (mesage) => mesage.messageType === "text"
    );

    const n = userMessage.length;

    return userMessage[n - 1];
  };

  const lastMessage = getLastMessage();

  console.log(lastMessage);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Message", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#d0d0d0",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>

        {lastMessage && (
          <Text style={{ marginTop: 3, fontWeight: "500", color: "gray" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>

      <View>
        {lastMessage && (
          <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
            {formatTime(lastMessage?.timeStamp)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
