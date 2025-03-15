import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [completionDate, setCompletionDate] = useState(new Date());
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] = useState(false);

  // Format Date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Save Task to AsyncStorage
  const handleSaveTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Error", "Task name cannot be empty.");
      return;
    }

    try {
      const existingTasks = await AsyncStorage.getItem("tasks");
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];

      const newTask = {
        id: Date.now(),
        name: taskName.trim(),
        description: taskDescription.trim(),
        date: formatDate(taskDate),
        completionDate: formatDate(completionDate),
        isRunning: false,
        elapsedTime: 0, // Time tracking for the task
      };

      tasks.push(newTask);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));

      Alert.alert("Success", "Task added successfully!");
      router.replace("/"); // Navigate back to Home Screen
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Add New Task</Text>

      {/* Task Name Input */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Name"
        placeholderTextColor="#ccc"
        value={taskName}
        onChangeText={setTaskName}
      />

      {/* Task Description Input */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Description"
        placeholderTextColor="#ccc"
        value={taskDescription}
        onChangeText={setTaskDescription}
        multiline
      />

      {/* Task Date Picker */}
      <TouchableOpacity onPress={() => setShowTaskDatePicker(true)} className="bg-blue-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">📅 Task Date: {formatDate(taskDate)}</Text>
      </TouchableOpacity>
      {showTaskDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowTaskDatePicker(false);
            if (selectedDate) setTaskDate(selectedDate);
          }}
        />
      )}

      {/* Completion Date Picker */}
      <TouchableOpacity onPress={() => setShowCompletionDatePicker(true)} className="bg-green-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">✅ Completion Date: {formatDate(completionDate)}</Text>
      </TouchableOpacity>
      {showCompletionDatePicker && (
        <DateTimePicker
          value={completionDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowCompletionDatePicker(false);
            if (selectedDate) setCompletionDate(selectedDate);
          }}
        />
      )}

      {/* Save Task Button */}
      <TouchableOpacity onPress={handleSaveTask} className="bg-purple-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">💾 Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;
