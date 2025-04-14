import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const EditTask = () => {
  const params = useLocalSearchParams();
  // Initialize with empty values first
  const [tName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [compDate, setCompDate] = useState(new Date());
  const [showTDatePick, setTDatePick] = useState(false);
  const [showCompPick, setCompPick] = useState(false);
  const [taskId, setTaskId] = useState(null);
  
  // Load task data from storage based on the ID
  useEffect(() => {
    const loadTaskData = async () => {
      try {
        // Get stored tasks
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (!storedTasks) return;
        
        const tasks = JSON.parse(storedTasks);
        // Find the task with the matching ID
        const taskToEdit = tasks.find(t => t.id.toString() === params.id?.toString());
        
        if (taskToEdit) {
          // Set state with the found task data
          setTaskName(taskToEdit.name || "");
          setTaskDesc(taskToEdit.description || "");
          setTaskDate(dayjs(taskToEdit.date).toDate());
          setCompDate(dayjs(taskToEdit.compdate || taskToEdit.completionDate).toDate());
          setTaskId(taskToEdit.id);
        } else {
          Alert.alert("Error", "Task not found!");
          router.replace("/");
        }
      } catch (error) {
        console.error("Error loading task:", error);
        Alert.alert("Error", "Failed to load task data");
      }
    };
    
    loadTaskData();
  }, [params.id]);

  const updateTask = async () => {
    if (!taskId) {
      Alert.alert("Error", "Task ID is missing");
      return;
    }
    
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
 
      const updatedTasks = tasks.map((t) =>
        t.id.toString() === taskId.toString()
          ? {
              ...t, // Preserve all original properties
              name: tName,
              description: taskDesc,
              date: dayjs(taskDate).format("YYYY-MM-DD"),
              compdate: dayjs(compDate).format("YYYY-MM-DD"),
            }
          : t
      );  
      
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      Alert.alert("Success", "Task updated successfully!");
      router.replace("/");
    } catch (error) {
      console.error("Error updating task", error);
      Alert.alert("Error", "Failed to update task");
    }
  };
 
  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Edit Task</Text>
      {/*Task Name */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        value={tName}
        onChangeText={setTaskName}
        placeholder="Task name"
        placeholderTextColor="#666"
      />
      {/*Task Description */}
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        value={taskDesc}
        onChangeText={setTaskDesc}
        multiline
        placeholder="Task description"
        placeholderTextColor="#666"
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