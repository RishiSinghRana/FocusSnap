import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, router } from "expo-router";
import dayjs from "dayjs";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [cumulativeTime, setCumulativeTime] = useState(0);
  const [activeTaskId, setActiveTaskID] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  useEffect(() => {
    loadCumulativeTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning ? { ...task, tspent: task.tspent + 1 } : task
        )
      );
      setCumulativeTime((prevTime) => prevTime + (activeTaskId ? 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTaskId]);

  const fetchTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(parsedTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const loadCumulativeTime = async () => {
    const storedTime = await AsyncStorage.getItem("cumulativeTime");
    if (storedTime) setCumulativeTime(parseInt(storedTime));
  };

  const saveTasks = async (updatedTasks) => {
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const startTask = async (id) => {
    if (activeTaskId !== null) {
      Alert.alert("Stop current task first!", "Only one task can run at a time.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setActiveTaskID(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isRunning: true, hasStartedOnce: true, photo: result.assets[0].uri } : task
        )
      );
    }
  };

  const stopTask = (id) => {
    setActiveTaskID(null);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isRunning: false } : task))
    );
  };

  const resumeTask = (id) => {
    if (activeTaskId !== null) {
      Alert.alert("Stop current task first!", "Only one task can run at a time.");
      return;
    }

    setActiveTaskID(id);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isRunning: true } : task))
    );
  };

  const deleteTask = async (id) => {
    if (activeTaskId === id) setActiveTaskID(null);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(updatedTasks);
  };

  const editTask = (task) => {
    router.push({ pathname: "../components/EditTask", params: task });
  };

  const today = dayjs().format("YYYY-MM-DD");
  const todayTasks = tasks.filter((task) => dayjs(task.date).isSame(today, "day"));
  const futureTasks = tasks.filter((task) => dayjs(task.date).isAfter(today, "day"));

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">
        Total Time: {cumulativeTime}s
      </Text>

      {/* Today's Tasks Section */}
      <Text className="text-white text-lg font-bold mb-3">Today's Tasks</Text>
      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-800 p-4 mb-3 rounded-lg flex-row justify-between items-center">
            <View>
              <Text className="text-white text-lg">{item.name}</Text>
              <Text className="text-gray-400">Start Date: {dayjs(item.date).format("DD MMM YYYY")}</Text>
              <Text className="text-gray-400">Completion Date: {dayjs(item.completionDate).format("DD MMM YYYY")}</Text>
              <Text className="text-gray-400">Time Spent: {item.tspent}s</Text>
            </View>

            {/* Edit Button */}
            <TouchableOpacity onPress={() => editTask(item)}>
              <Text className="text-yellow-400">✏ Edit</Text>
            </TouchableOpacity>

            {/* Remove Button - Only if task is stopped */}
            {!item.isRunning && (
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text className="text-gray-400">🗑 Remove</Text>
              </TouchableOpacity>
            )}

            {item.photo ? (
              <Image source={{ uri: item.photo }} className="w-10 h-10 rounded-lg" />
            ) : null}

            {!item.hasStartedOnce && (
              <TouchableOpacity onPress={() => startTask(item.id)}>
                <Text className="text-blue-400">📸 Start</Text>
              </TouchableOpacity>
            )}

            {item.isRunning && (
              <TouchableOpacity onPress={() => stopTask(item.id)}>
                <Text className="text-red-400">⏹ Stop</Text>
              </TouchableOpacity>
            )}

            {!item.isRunning && item.hasStartedOnce && (
              <TouchableOpacity onPress={() => resumeTask(item.id)}>
                <Text className="text-green-400">▶ Resume</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Future Tasks Section */}
      {futureTasks.length > 0 && (
        <>
          <Text className="text-white text-lg font-bold mt-5 mb-3">Future Tasks</Text>
          <FlatList
            data={futureTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="bg-gray-800 p-4 mb-3 rounded-lg flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-lg">{item.name}</Text>
                  <Text className="text-gray-400">Start Date: {dayjs(item.date).format("DD MMM YYYY")}</Text>
                  <Text className="text-gray-400">Completion Date: {dayjs(item.completionDate).format("DD MMM YYYY")}</Text>
                </View>

                {/* Edit Button */}
                <TouchableOpacity onPress={() => editTask(item)}>
                  <Text className="text-yellow-400">✏ Edit</Text>
                </TouchableOpacity>

                {/* Remove Button */}
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Text className="text-gray-400">🗑 Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg mt-5"
        onPress={() => router.push("../components/AddTask")}
      >
        <Text className="text-white text-center text-lg">+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
