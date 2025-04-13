import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

const Settings = () => {
  const [region, setRegion] = useState("Global");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoMarkAfter, setAutoMarkAfter] = useState("3");
  
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedRegion = await AsyncStorage.getItem("region");
      const storedNotifications = await AsyncStorage.getItem("notifications");
      const storedAutoMark = await AsyncStorage.getItem("autoMarkAfter");

      if (storedRegion) setRegion(storedRegion);
      if (storedNotifications !== null) setNotificationsEnabled(storedNotifications === "true");
      if (storedAutoMark) setAutoMarkAfter(storedAutoMark);
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("region", region);
      await AsyncStorage.setItem("notifications", notificationsEnabled.toString());
      await AsyncStorage.setItem("autoMarkAfter", autoMarkAfter);
      Alert.alert("Settings Saved");
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  const exportCSV = async () => {
    try {
      const tasksData = await AsyncStorage.getItem("tasks");
      const tasks = tasksData ? JSON.parse(tasksData) : [];

      if (!tasks.length) {
        Alert.alert("No tasks to export");
        return;
      }

      const csvHeader = "Name,Start Date,Completion Date,Time Spent (s),Completed At\n";
      const csvRows = tasks.map(task =>
        `${task.name},${task.date},${task.completionDate || task.compdate},${task.tspent || 0},${task.completedAt || ""}`
      );

      const csvContent = csvHeader + csvRows.join("\n");

      const path = FileSystem.documentDirectory + "tasks_export.csv";
      await FileSystem.writeAsStringAsync(path, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

      await Sharing.shareAsync(path);
    } catch (error) {
      console.error("Error exporting CSV", error);
      Alert.alert("Error", "Could not export tasks");
    }
  };

  const exportPDF = async () => {
    try {
      const tasksData = await AsyncStorage.getItem("tasks");
      const tasks = tasksData ? JSON.parse(tasksData) : [];

      if (!tasks.length) {
        Alert.alert("No tasks to export");
        return;
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <h2>Task Report</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>Completion Date</th>
                  <th>Time Spent (s)</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.map(task => `
                  <tr>
                    <td>${task.name}</td>
                    <td>${task.date}</td>
                    <td>${task.completionDate || task.compdate || ""}</td>
                    <td>${task.tspent || 0}</td>
                    <td>${task.completedAt || ""}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error exporting PDF", error);
      Alert.alert("Error", "Could not export tasks as PDF");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold mb-5 text-center">Settings</Text>

      {/* Region Picker */}
      <Text className="text-white mb-2">Region</Text>
      <View className="bg-gray-800 rounded-lg mb-4">
        <Picker
          selectedValue={region}
          onValueChange={(value) => setRegion(value)}
          dropdownIconColor="#fff"
          style={{ color: "white" }}
        >
          <Picker.Item label="Global" value="Global" />
          <Picker.Item label="Asia" value="Asia" />
          <Picker.Item label="Europe" value="Europe" />
          <Picker.Item label="North America" value="North America" />
          <Picker.Item label="Africa" value="Africa" />
        </Picker>
      </View>

      {/* Notification Toggle */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white">Task Notifications/Reminders</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ true: "#22c55e", false: "#ccc" }}
          thumbColor={notificationsEnabled ? "#22c55e" : "#999"}
        />
      </View>

      {/* Auto Mark After Deadline Picker */}
      <Text className="text-white mb-2">Auto-Mark Task As Done After</Text>
      <View className="bg-gray-800 rounded-lg mb-4">
        <Picker
          selectedValue={autoMarkAfter}
          onValueChange={(value) => setAutoMarkAfter(value)}
          dropdownIconColor="#fff"
          style={{ color: "white" }}
        >
          <Picker.Item label="After 1 Day" value="1" />
          <Picker.Item label="After 2 Days" value="2" />
          <Picker.Item label="After 3 Days" value="3" />
          <Picker.Item label="After 4 Days" value="4" />
          <Picker.Item label="After 5 Days" value="5" />
          <Picker.Item label="After 6 Days" value="6" />
          <Picker.Item label="After 7 Days" value="7" />
        </Picker>
      </View>

      {/* Export Buttons */}
      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg mb-3"
        onPress={exportCSV}
      >
        <Text className="text-white text-center">Export Tasks as CSV</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-purple-600 p-3 rounded-lg mb-4"
        onPress={exportPDF}
      >
        <Text className="text-white text-center">Export Tasks as PDF</Text>
      </TouchableOpacity>

      {/* Save Settings Button */}
      <TouchableOpacity
        className="bg-green-600 p-3 rounded-lg mb-8"
        onPress={saveSettings}
      >
        <Text className="text-white text-center">Save Settings</Text>
      </TouchableOpacity>

      {/* Developer Credits */}
      <View className="border-t border-gray-700 pt-4">
        <Text className="text-gray-400 text-center">Made with 💙 by Rishi Singh Rana</Text>
      </View>
    </ScrollView>
  );
};

export default Settings;
