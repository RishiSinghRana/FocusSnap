import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const EditTask = () => {
  const task = useLocalSearchParams(); // Get task from params
  const [tName, setTaskName] = useState(task.name);
  const [taskDesc, setTaskDesc] = useState(task.description);
  const [taskDate, setTaskDate] = useState(dayjs(task.date).toDate());
  const [compDate, setCompDate] = useState(dayjs(task.completionDate).toDate());
  const [showTDatePick, setTDatePick] = useState(false);
  const [showCompPick, setCompPick] = useState(false);

  const updateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              name: tName,
              description: taskDesc,
              date: dayjs(taskDate).format("YYYY-MM-DD"),
              completionDate: dayjs(compDate).format("YYYY-MM-DD"),
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
        value={tName}
        onChangeText={setTaskName}
      />
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        value={taskDesc}
        onChangeText={setTaskDesc}
        multiline
      />
      {/* Task Date Picker */}
      <TouchableOpacity onPress={() => setTDatePick(true)} className="bg-blue-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">
          Task Date: {dayjs(taskDate).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
      {showTDatePick && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setTDatePick(false);
            if (date) setTaskDate(date);
          }}
        />
      )}
      {/* Completion Date Picker */}
      <TouchableOpacity onPress={() => setCompPick(true)} className="bg-green-600 p-3 rounded-lg mb-3">
        <Text className="text-white text-center">
          Completion Date: {dayjs(compDate).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
      {showCompPick && (
        <DateTimePicker
          value={compDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setCompPick(false);
            if (date) setCompDate(date);
          }}
        />
      )}
      <TouchableOpacity onPress={updateTask} className="bg-purple-600 p-3 rounded-lg mt-5">
        <Text className="text-white text-center text-lg">Update Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTask;