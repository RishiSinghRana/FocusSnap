import React, { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { router } from "expo-router";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "User Name",
    email: "user@example.com",
    profilePic: null,
    joinedOn: dayjs().format("DD MMM YYYY"),
    totalTasks: 0,
    taskGoal: 50,
  });

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const savedTasks = await AsyncStorage.getItem("tasks");
          const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
          const completedTasks = parsedTasks.filter((t) => t.isCompleted);

          const username = await AsyncStorage.getItem("username");
          const email = await AsyncStorage.getItem("email");
          const profilePic = await AsyncStorage.getItem("profilePic");
          const joined = await AsyncStorage.getItem("joinedDate");

          if (!joined) await AsyncStorage.setItem("joinedDate", new Date().toISOString());

          setUserData((prev) => ({
            ...prev,
            username: username || prev.username,
            email: email || prev.email,
            profilePic: profilePic || null,
            totalTasks: completedTasks.length,
            joinedOn: dayjs(joined || new Date()).format("DD MMM YYYY"),
          }));
        } catch (error) {
          console.error("Error loading profile data", error);
        }
      };

      loadUserData();
    }, [])
  );

  const handleEditProfile = () => {
    router.push("/EditProfile");;
  };

  const handleLogout = () => {
    alert("Logout logic not implemented yet.");
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <View className="items-center mb-6">
        <Image
          source={
            userData.profilePic
              ? { uri: userData.profilePic }
              : require("../../assets/images/profile.png")
          }
          className="w-28 h-28 rounded-full mb-3"
        />
        <Text className="text-white text-xl font-bold">{userData.username}</Text>
        <Text className="text-gray-400">{userData.email}</Text>
        <TouchableOpacity
          className="mt-3 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={handleEditProfile}
        >
          <Text className="text-white font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-gray-800 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-bold mb-2">📊 Stats</Text>
        <View className="space-y-1">
          <Text className="text-gray-300">✅ Total Tasks Completed: {userData.totalTasks}</Text>
          <Text className="text-gray-300">🎯 Task Goal: {userData.taskGoal}</Text>
          <Text className="text-gray-300">📅 Joined On: {userData.joinedOn}</Text>
        </View>
      </View>

      <View className="bg-gray-800 p-4 rounded-lg mb-6">
        <Text className="text-white text-lg font-bold mb-2">🏆 Achievements</Text>
        {userData.totalTasks >= 50 && (
          <Text className="text-red-400 mb-1">🏆 Task Master (50+ Tasks)</Text>
        )}
        {userData.totalTasks >= 25 && (
          <Text className="text-yellow-400 mb-1">🥇 Completed 25 Tasks!</Text>
        )}
        {userData.totalTasks >= 5 && (
          <Text className="text-green-400 mb-1">🏅 Completed 5 Tasks!</Text>
        )}
        {userData.totalTasks < 5 && (
          <Text className="text-gray-400">No achievements yet. Keep going!</Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-red-500 px-4 py-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-center text-lg">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
