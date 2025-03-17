import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddTask = () => {
  const [taskName, setTaskname] = useState("");
  const [taskDescription, setTaskdesc] = useState("");
  const [taskDate, setTaskdate] = useState(new Date());
  const [compdate, setCompdate] = useState(new Date());
  const [showdatepicker, setDatepicker] = useState(false);
  const [showcompdatePicker, setCompdatepicker] = useState(false);

  const formatdate = (date) => date.toISOString().split("T")[0];

  const handleSavetask = async () => {
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
        date: formatdate(taskDate),
        compdate: formatdate(compdate),
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

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Add New Task</Text>

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Name"
        placeholderTextColor="#ccc"
        value={taskName}
        onChangeText={setTaskname}
      />

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Enter Task Description"
        placeholderTextColor="#ccc"
        value={taskDescription}
        onChangeText={setTaskdesc}
        multiline
      />

      <TouchableOpacity onPress={() => setDatepicker(true)} className="bg-blue-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">📅 Task Date: {formatdate(taskDate)}</Text>
      </TouchableOpacity>
      {showdatepicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setDatepicker(false);
            if (selectedDate) setTaskdate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setCompdatepicker(true)} className="bg-green-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">✅ Completion Date: {formatdate(compdate)}</Text>
      </TouchableOpacity>
      {showcompdatePicker && (
        <DateTimePicker
          value={compdate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setCompdatepicker(false);
            if (selectedDate) setCompdate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={handleSavetask} className="bg-purple-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">💾 Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;
