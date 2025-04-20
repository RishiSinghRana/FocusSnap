import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const AddTask = () => {
  const [tName, setTName] = useState("");
  const [taskDescription, setTaskdesc] = useState("");
  const [taskDate, setTaskdate] = useState(new Date());
  const [compdate, setCompdate] = useState(new Date());
  const [showDatePick, setDatePick] = useState(false);
  const [showCompPick, setCompPick] = useState(false);

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

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
        date: formatDate(taskDate),
        compdate: formatDate(compdate),
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
    <ScrollView className="flex-1 bg-gray-900 px-6 py-8">
      <Text className="text-white text-3xl font-bold mb-8 text-center">📝 Add a New Task</Text>

      <TextInput
        className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-base"
        placeholder="Task Name"
        placeholderTextColor="#ccc"
        value={tName}
        onChangeText={setTName}
      />

      <TextInput
        className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-base h-28"
        placeholder="Task Description"
        placeholderTextColor="#ccc"
        value={taskDescription}
        onChangeText={setTaskdesc}
        multiline
      />

      <TouchableOpacity onPress={() => setDatePick(true)} className="bg-blue-600 p-4 rounded-lg mb-4">
        <Text className="text-white text-center text-base">📅 Select Task Date: {formatDate(taskDate)}</Text>
      </TouchableOpacity>
      {showDatePick && (
        <DateTimePicker value={taskDate} mode="date" display="default" onChange={(e, d) => {
          setDatePick(false);
          if (d) setTaskdate(dayjs(d).startOf("day").toDate());
        }} />
      )}

      <TouchableOpacity onPress={() => setCompPick(true)} className="bg-green-600 p-4 rounded-lg mb-4">
        <Text className="text-white text-center text-base">✅ Completion Date: {formatDate(compdate)}</Text>
      </TouchableOpacity>
      {showCompPick && (
        <DateTimePicker value={compdate} mode="date" display="default" onChange={(e, d) => {
          setCompPick(false);
          if (d) setCompdate(dayjs(d).startOf("day").toDate());
        }} />
      )}

      <TouchableOpacity onPress={saveTask} className="bg-purple-700 p-4 rounded-lg mt-4">
        <Text className="text-white text-center text-lg font-semibold">💾 Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTask;
