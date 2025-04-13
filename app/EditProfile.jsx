import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // Import useRouter for expo-router

const EditProfile = () => {
  const router = useRouter(); // Initialize useRouter hook
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const storedUsername = await AsyncStorage.getItem("username");
    const storedEmail = await AsyncStorage.getItem("email");
    const storedPic = await AsyncStorage.getItem("profilePic");

    setUsername(storedUsername || "");
    setEmail(storedEmail || "");
    setProfilePic(storedPic || null);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return alert("Permission to access media library is required.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Updated to avoid deprecation warning
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("profilePic", profilePic || "");
      setTimeout(() => {
        Alert.alert("Success", "Settings saved successfully!");
        router.back();
      }, 0);
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold mb-5 text-center">Edit Profile</Text>

      {/* Success message */}
      {successMessage ? (
        <Text className="text-green-400 text-center mb-4">{successMessage}</Text>
      ) : null}

      <TouchableOpacity onPress={pickImage} className="items-center mb-5">
        <Image
          source={profilePic ? { uri: profilePic } : require("../assets/images/profile.png")}
          className="w-28 h-28 rounded-full"
        />
        <Text className="text-blue-400 mt-2">Change Photo</Text>
      </TouchableOpacity>

      <View className="mb-4">
        <Text className="text-white mb-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
          placeholder="Enter username"
          placeholderTextColor="#888"
        />
      </View>

      <View className="mb-6">
        <Text className="text-white mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg"
          placeholder="Enter email"
          placeholderTextColor="#888"
        />
      </View>

      <TouchableOpacity
        onPress={saveProfile}
        className="bg-blue-500 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
