import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Message from "../api/models/message";
import * as ImagePicker from "expo-image-picker";

const ChatMessageScreen = () => {
  const navigation = useNavigation();
  const [showEmojiSelected, setShowEmojiSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectMessage, setSelectMessage] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [recepientData, setRecepientData] = useState();
  const route = useRoute();
  const { recepientId } = route.params;
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollBottom();
  }, []);

  const scrollBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollBottom();
  };
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/messages/${userId}/${recepientId}`
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

  useEffect(() => {
    fetchMessages();
  }, []);
  console.log("messages", selectMessage);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");

        fetchMessages();
      }
    } catch (error) {
      console.log("error sending message", error);
    }
  };
  const handleEmojiPress = () => {
    setShowEmojiSelected(!showEmojiSelected);
  };

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/user/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving data", error);
      }
    };

    fetchRecepientData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectMessage.length > 0 ? (
            <View style={{ fontSize: 16, fontWeight: "500" }}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectMessage.length}
              </Text>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recepientData?.image }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectMessage.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessage(selectMessage)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectMessage]);

  const deleteMessage = async (messageIds) => {
    try {
      const response = await fetch("http://localhost:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectMessage((previousMessages) =>
          previousMessages.filter((id) => !messageIds.includes(id))
        );

        fetchMessages();
      } else {
        console.log("error deleting message", response.status);
      }
    } catch (error) {
      console.log("error deleting message", error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };
  const handleSelectMessage = (message) => {
    //check if message is already selected
    const isSelected = selectMessage.includes(message._id);

    if (isSelected) {
      setSelectMessage((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectMessage((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages?.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectMessage.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#dcf8c6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },

                  isSelected && { width: "100%", backgroundColor: "#f0ffff" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    marginTop: 5,
                    color: "gray",
                  }}
                >
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
            const baseUrl =
              "/Users/macboookpro/Documents/Work/Messenger-app/api/files/";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };
            const isSelected = selectMessage.includes(item._id);

            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#dcf8c6",
                        padding: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                        marginTop: 5,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && { width: "100%", backgroundColor: "#f0ffff" },
                ]}
              >
                <Image
                  source={source}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 7,
                    marginBottom: 5,
                  }}
                />
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    position: "absolute",
                    right: 10,
                    bottom: 0,
                  }}
                >
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#dddddd",
          marginBottom: showEmojiSelected ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 25 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your messages ..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

          <FontAwesome5 name="microphone" size={23} color="gray" />
        </View>

        <Pressable
          onPress={() => handleSend("text")} //messageType = "text"
          style={{
            backgroundColor: "#007bff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
          >
            Send
          </Text>
        </Pressable>
      </View>

      {showEmojiSelected && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessageScreen;

const styles = StyleSheet.create({});
