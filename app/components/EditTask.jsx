import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const EditTask = () => {
  const task = useLocalSearchParams(); // Get task from params

  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskDate, setTaskDate] = useState(dayjs(task.date).toDate());
  const [completionDate, setCompletionDate] = useState(dayjs(task.completionDate).toDate());
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] = useState(false);

  const handleUpdateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              name: taskName,
              description: taskDescription,
              date: dayjs(taskDate).format("YYYY-MM-DD"),
              completionDate: dayjs(completionDate).format("YYYY-MM-DD"),
            }
          : t
      );

      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      Alert.alert("Success", "Task updated successfully!");
      router.replace("/");
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Edit Task</Text>

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        value={taskDescription}
        onChangeText={setTaskDescription}
        multiline
      />

      {/* Task Date Picker */}
      <TouchableOpacity onPress={() => setShowTaskDatePicker(true)} className="bg-blue-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">
          Task Date: {dayjs(taskDate).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
      {showTaskDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowTaskDatePicker(false);
            if (date) setTaskDate(date);
          }}
        />
      )}

      {/* Completion Date Picker */}
      <TouchableOpacity onPress={() => setShowCompletionDatePicker(true)} className="bg-green-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">
          Completion Date: {dayjs(completionDate).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
      {showCompletionDatePicker && (
        <DateTimePicker
          value={completionDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowCompletionDatePicker(false);
            if (date) setCompletionDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={handleUpdateTask} className="bg-purple-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">Update Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTask;
