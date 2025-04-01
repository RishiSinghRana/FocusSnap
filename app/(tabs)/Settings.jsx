import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const regions = ["North America", "Europe", "Asia", "Australia", "Africa"];
const languages = ["English", "Spanish", "French", "German", "Chinese"];

const SettingsScreen = () => {
  const [name, setName] = useState("");
  const [region, setRegion] = useState(regions[0]);
  const [language, setLanguage] = useState(languages[0]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedName = await AsyncStorage.getItem("userName");
      const savedRegion = await AsyncStorage.getItem("userRegion");
      const savedLanguage = await AsyncStorage.getItem("userLanguage");

      if (savedName) setName(savedName);
      if (savedRegion) setRegion(savedRegion);
      if (savedLanguage) setLanguage(savedLanguage);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("userRegion", region);
      await AsyncStorage.setItem("userLanguage", language);
      Alert.alert("Success", "Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Settings</Text>

      {/* Change Name */}
      <Text className="text-white mb-2">Name:</Text>
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="gray"
      />

      {/* Select Region */}
      <Text className="text-white mb-2">Region:</Text>
      <View className="bg-gray-800 rounded-lg mb-4">
        <Picker selectedValue={region} onValueChange={setRegion} style={{ color: "white" }}>
          {regions.map((reg) => (
            <Picker.Item key={reg} label={reg} value={reg} />
          ))}
        </Picker>
      </View>

      {/* Select Language */}
      <Text className="text-white mb-2">Language:</Text>
      <View className="bg-gray-800 rounded-lg mb-4">
        <Picker selectedValue={language} onValueChange={setLanguage} style={{ color: "white" }}>
          {languages.map((lang) => (
            <Picker.Item key={lang} label={lang} value={lang} />
          ))}
        </Picker>
      </View>

      {/* Save Button */}
      <TouchableOpacity onPress={saveSettings} className="bg-blue-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">Save Settings</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="bg-gray-600 p-3 rounded-lg mt-3">
        <Text className="text-white text-center text-lg">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
