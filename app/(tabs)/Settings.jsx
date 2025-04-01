import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import RNPickerSelect from "react-native-picker-select";
import * as SecureStore from "expo-secure-store";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [dailyGoal, setDailyGoal] = useState(30);
  const [selectedSound, setSelectedSound] = useState("default");

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await SecureStore.getItemAsync("settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setIsDarkMode(parsedSettings.isDarkMode);
        setNotifications(parsedSettings.notifications);
        setLanguage(parsedSettings.language);
        setDailyGoal(parsedSettings.dailyGoal);
        setSelectedSound(parsedSettings.selectedSound);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = { isDarkMode, notifications, language, dailyGoal, selectedSound };
      await SecureStore.setItemAsync("settings", JSON.stringify(settings));
      Alert.alert("Settings Saved", "Your preferences have been updated.");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const resetStreak = () => {
    Alert.alert(
      "Reset Streak",
      "Are you sure you want to reset your streak?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => console.log("Streak Reset") },
      ]
    );
  };

  const backupSettings = async () => {
    try {
      const settings = { isDarkMode, notifications, language, dailyGoal, selectedSound };
      await SecureStore.setItemAsync("backup_settings", JSON.stringify(settings));
      Alert.alert("Backup Successful", "Your settings have been saved.");
    } catch (error) {
      console.error("Error backing up settings:", error);
    }
  };

  const restoreSettings = async () => {
    try {
      const savedBackup = await SecureStore.getItemAsync("backup_settings");
      if (savedBackup) {
        const parsedSettings = JSON.parse(savedBackup);
        setIsDarkMode(parsedSettings.isDarkMode);
        setNotifications(parsedSettings.notifications);
        setLanguage(parsedSettings.language);
        setDailyGoal(parsedSettings.dailyGoal);
        setSelectedSound(parsedSettings.selectedSound);
        Alert.alert("Restore Successful", "Your settings have been restored.");
      } else {
        Alert.alert("No Backup Found", "No previous settings were found.");
      }
    } catch (error) {
      console.error("Error restoring settings:", error);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 dark:bg-gray-900 p-5`}>
      <Text style={tw`text-xl font-bold text-gray-800 dark:text-white mb-4`}>Settings</Text>

      {/* Light Mode Toggle */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white`}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      {/* Notifications Toggle */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white`}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* Language Selection */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white mb-2`}>Language</Text>
        <RNPickerSelect
          onValueChange={setLanguage}
          value={language}
          items={[
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" },
            { label: "French", value: "fr" },
          ]}
          style={{
            inputIOS: tw`bg-white p-3 rounded-lg`,
            inputAndroid: tw`bg-white p-3 rounded-lg`,
          }}
        />
      </View>

      {/* Daily Goal */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white mb-2`}>Daily Goal (minutes)</Text>
        <RNPickerSelect
          onValueChange={setDailyGoal}
          value={dailyGoal}
          items={[
            { label: "30 min", value: 30 },
            { label: "60 min", value: 60 },
            { label: "90 min", value: 90 },
          ]}
          style={{
            inputIOS: tw`bg-white p-3 rounded-lg`,
            inputAndroid: tw`bg-white p-3 rounded-lg`,
          }}
        />
      </View>

      {/* Focus Mode Sound */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white mb-2`}>Focus Mode Sound</Text>
        <RNPickerSelect
          onValueChange={setSelectedSound}
          value={selectedSound}
          items={[
            { label: "Default", value: "default" },
            { label: "Rain", value: "rain" },
            { label: "Waves", value: "waves" },
          ]}
          style={{
            inputIOS: tw`bg-white p-3 rounded-lg`,
            inputAndroid: tw`bg-white p-3 rounded-lg`,
          }}
        />
      </View>

      {/* Reset Streak Button */}
      <TouchableOpacity style={tw`bg-red-500 p-3 rounded-lg mb-4`} onPress={resetStreak}>
        <Text style={tw`text-white text-center text-lg`}>Reset Streak</Text>
      </TouchableOpacity>

      {/* Backup & Restore Buttons */}
      <View style={tw`flex-row justify-between mb-4`}>
        <TouchableOpacity style={tw`bg-green-500 p-3 rounded-lg flex-1 mr-2`} onPress={backupSettings}>
          <Text style={tw`text-white text-center text-lg`}>Backup Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-yellow-500 p-3 rounded-lg flex-1 ml-2`} onPress={restoreSettings}>
          <Text style={tw`text-black text-center text-lg`}>Restore Data</Text>
        </TouchableOpacity>
      </View>

      {/* Save Settings Button */}
      <TouchableOpacity style={tw`bg-blue-500 p-3 rounded-lg`} onPress={saveSettings}>
        <Text style={tw`text-white text-center text-lg`}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Settings;
