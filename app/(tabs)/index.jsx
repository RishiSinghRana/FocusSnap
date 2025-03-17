import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, router } from "expo-router";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [cumulativeTime, setcumutime] = useState(0);
  const [activeTaskId, setactivetaskID] = useState(null);

  // Fetch tasks when screen loads
  useFocusEffect(
    React.useCallback(() => {
      fetchtasks();
    }, [])
  );

  useEffect(() => {
    loadtime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning ? { ...task, tspent: task.tspent + 1 } : task
        )
      );
      setcumutime((prevTime) => prevTime + (activeTaskId ? 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTaskId]);

  const fetchtasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const loadtime = async () => {
    const storedTime = await AsyncStorage.getItem("cumulativeTime");
    if (storedTime) setcumutime(parseInt(storedTime));
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
    if (!result.cancelled) {
      setactivetaskID(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isRunning: true, hasStartedOnce: true, photo: result.assets[0].uri } : task
        )
      );
    }
  };

  const stopTask = (id) => {
    setactivetaskID(null);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isRunning: false } : task))
    );
  };

  const resumeTask = (id) => {
    if (activeTaskId !== null) {
      Alert.alert("Stop current task first!", "Only one task can run at a time.");
      return;
    }

    setactivetaskID(id);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isRunning: true } : task))
    );
  };

  const deleteTask = async (id) => {
    if (activeTaskId === id) setactivetaskID(null);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(updatedTasks);
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">
        Total Time: {cumulativeTime}s
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-800 p-4 mb-3 rounded-lg flex-row justify-between items-center">
            <View>
              <Text className="text-white text-lg">{item.name}</Text>
              <Text className="text-gray-400">{item.tspent}s</Text>
            </View>

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

            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text className="text-gray-400">🗑 Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg mt-5"
        onPress={() => router.push("./AddTask")}
      >
        <Text className="text-white text-center text-lg">+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
