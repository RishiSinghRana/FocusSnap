import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, router } from "expo-router";
import dayjs from "dayjs";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [activeId, setActiveId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [])
  );

  useEffect(() => {
    loadTotalTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning
            ? { ...task, tspent: (task.tspent ?? 0) + 1 }
            : task
        )
      );
      setTotalTime((prevTime) => prevTime + (activeId ? 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeId]);

  const getTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(parsedTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const loadTotalTime = async () => {
    const storedTime = await AsyncStorage.getItem("cumulativeTime");
    if (storedTime) setTotalTime(parseInt(storedTime));
  };

  const storeTasks = async (updatedTasks) => {
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const beginTask = async (id) => {
    if (activeId !== null) {
      Alert.alert("Stop current task first!", "Only one task can run at a time.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setActiveId(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                isRunning: true,
                hasStartedOnce: true,
                photo: result.assets[0].uri,
                photos: [...(task.photos || []), result.assets[0].uri],
              }
            : task
        )
      );
    }
  };

  const endTask = (id) => {
    setActiveId(null);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isRunning: false } : task))
    );
  };

  const contTask = async (id) => {
    if (activeId !== null) {
      Alert.alert("Stop current task first!", "Only one task can run at a time.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });

    if (!result.canceled) {
      setActiveId(id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                isRunning: true,
                photo: result.assets[0].uri,
                photos: [...(task.photos || []), result.assets[0].uri],
              }
            : task
        )
      );
    }
  };

  const remTask = async (id) => {
    if (activeId === id) setActiveId(null);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await storeTasks(updatedTasks);
  };

  const modTask = (task) => {
    router.push({ pathname: "../components/EditTask", params: task });
  };

  const markTaskDone = async (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, isCompleted: true, completedAt: new Date().toISOString() } : task
    );
    await storeTasks(updatedTasks);
  };

  const today = dayjs().format("YYYY-MM-DD");

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const todayList = activeTasks.filter((task) => dayjs(task.date).isSame(today, "day"));
  const futureList = activeTasks.filter((task) => dayjs(task.date).isAfter(today, "day"));

  const overdueList = activeTasks.filter((task) => {
    const completionDate = task.completionDate || task.compdate;
    return completionDate && dayjs(completionDate).isBefore(today, "day");
  });

  const renderTaskItem = (item, showDoneButton = true, restrictToEditRemoveOnly = false) => (
    <View className="bg-gray-800 p-4 mb-3 rounded-lg flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-white text-lg">{item.name}</Text>
        <Text className="text-gray-400">Start Date: {dayjs(item.date).format("DD MMM YYYY")}</Text>
        <Text className="text-gray-400">
          Completion Date: {dayjs(item.completionDate || item.compdate).format("DD MMM YYYY")}
        </Text>
        <Text className="text-gray-400">Time Spent: {item.tspent || 0}s</Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity className="mx-1" onPress={() => modTask(item)}>
          <Text className="text-2xl">🖊️</Text>
        </TouchableOpacity>

        {!item.isRunning && (
          <TouchableOpacity className="mx-1" onPress={() => remTask(item.id)}>
            <Text className="text-2xl">🗑️</Text>
          </TouchableOpacity>
        )}

        {showDoneButton && !item.isRunning && !restrictToEditRemoveOnly && (
          <TouchableOpacity className="mx-1" onPress={() => markTaskDone(item.id)}>
            <Text className="text-2xl text-green-500">✓</Text>
          </TouchableOpacity>
        )}
      </View>

      {item.photo ? (
        <Image source={{ uri: item.photo }} className="w-10 h-10 rounded-lg ml-2" />
      ) : null}

      {!restrictToEditRemoveOnly && (
        <View className="ml-2">
          {!item.hasStartedOnce && (
            <TouchableOpacity onPress={() => beginTask(item.id)}>
              <Text className="text-2xl mb-2">📸</Text>
            </TouchableOpacity>
          )}

          {item.isRunning && (
            <TouchableOpacity onPress={() => endTask(item.id)}>
              <Text className="text-2xl">⏹</Text>
            </TouchableOpacity>
          )}

          {!item.isRunning && item.hasStartedOnce && (
            <TouchableOpacity onPress={() => contTask(item.id)}>
              <Text className="text-2xl text-green-400">▶</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">
        Total Time: {totalTime}s
      </Text>

      <Text className="text-white text-lg font-bold mb-3">
        Today's Tasks <Text className="text-yellow-400">({todayList.length})</Text>
      </Text>
      <FlatList
        data={todayList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderTaskItem(item)}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 py-2">No tasks for today</Text>
        }
      />

      {overdueList.length > 0 && (
        <>
          <Text className="text-white text-lg font-bold mt-5 mb-3">
            Overdue Tasks <Text className="text-red-500">({overdueList.length})</Text>
          </Text>
          <FlatList
            data={overdueList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderTaskItem(item)}
          />
        </>
      )}

      {futureList.length > 0 && (
        <>
          <Text className="text-white text-lg font-bold mt-5 mb-3">
            Future Tasks <Text className="text-blue-400">({futureList.length})</Text>
          </Text>
          <FlatList
            data={futureList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderTaskItem(item, false, true)}
          />
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <Text className="text-white text-lg font-bold mt-5 mb-3">
            Completed Tasks <Text className="text-green-500">({completedTasks.length})</Text>
          </Text>
          <FlatList
            data={completedTasks.slice(0, 3)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderTaskItem(item, false, true)}
            ListFooterComponent={
              completedTasks.length > 3 ? (
                <TouchableOpacity
                  className="py-2"
                  onPress={() => router.push("/TaskHistory")}
                >
                  <Text className="text-center text-blue-400">
                    View all {completedTasks.length} completed tasks
                  </Text>
                </TouchableOpacity>
              ) : null
            }
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
