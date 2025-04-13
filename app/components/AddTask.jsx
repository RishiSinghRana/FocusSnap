import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs"; // Import dayjs

const AddTask = () => {
  const [tName, setTName] = useState("");
  const [taskDescription, setTaskdesc] = useState("");
  const [taskDate, setTaskdate] = useState(new Date());
  const [compdate, setCompdate] = useState(new Date());
  const [showDatePick, setDatePick] = useState(false);
  const [showCompPick, setCompPick] = useState(false);

  // Format the date using dayjs
  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  // Save task to AsyncStorage
  const saveTask = async () => {
    if (!tName.trim()) {
      Alert.alert("Error", "Task name cannot be empty.");
      return;
    }
    try {
      const existingTasks = await AsyncStorage.getItem("tasks");
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      const newTask = {
        id: Date.now(),
        name: tName.trim(),
        description: taskDescription.trim(),
        date: formatDate(taskDate), // Save the formatted task date
        compdate: formatDate(compdate), // Save the formatted completion date
        isRunning: false,
        elapsedTime: 0,
      };
      tasks.push(newTask);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      Alert.alert("Success", "Task added successfully!");
      router.replace("/");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handle Task Date picker change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDate;
    setDatePick(false);
    setTaskdate(dayjs(currentDate).startOf("day").toDate()); // Ensure time is reset to start of the day
  };

  // Handle Completion Date picker change
  const handleCompDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || compdate;
    setCompPick(false);
    setCompdate(dayjs(currentDate).startOf("day").toDate()); // Ensure time is reset to start of the day
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Add New Task</Text>

      {/* Task Name Input */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Name"
        placeholderTextColor="#ccc"
        value={tName}
        onChangeText={setTName}
      />

      {/* Task Description Input */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Description"
        placeholderTextColor="#ccc"
        value={taskDescription}
        onChangeText={setTaskdesc}
        multiline
      />

      {/* Task Date Picker */}
      <TouchableOpacity onPress={() => setDatePick(true)} className="bg-blue-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">📅 Task Date: {formatDate(taskDate)}</Text>
      </TouchableOpacity>
      {showDatePick && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={handleDateChange} // Use the function that formats the date properly
        />
      )}

      {/* Completion Date Picker */}
      <TouchableOpacity onPress={() => setCompPick(true)} className="bg-green-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">✅ Completion Date: {formatDate(compdate)}</Text>
      </TouchableOpacity>
      {showCompPick && (
        <DateTimePicker
          value={compdate}
          mode="date"
          display="default"
          onChange={handleCompDateChange} // Use the function that formats the date properly
        />
      )}

      {/* Save Task Button */}
      <TouchableOpacity onPress={saveTask} className="bg-purple-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">💾 Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;
