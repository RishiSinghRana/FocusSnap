// app/components/TaskDetail.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const TaskDetail = () => {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };  

  useEffect(() => {
    const loadTask = async () => {
      const saved = await AsyncStorage.getItem("tasks");
      const parsed = saved ? JSON.parse(saved) : [];
      const selected = parsed.find((task) => task.id.toString() === id);
      setTask(selected);
    };
    loadTask();
  }, [id]);

  if (!task) {
    return (
      <View className="flex-1 bg-gray-900 p-5">
        <Text className="text-white text-center">Loading task...</Text>
      </View>
    );
  }

  const {
    name,
    tspent,
    date,
    completionDate,
    compdate,
    completedAt,
    photos = []
  } = task;

  const format = (d) => dayjs(d).format("DD MMM YYYY");

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold mb-5 text-center">Task Details</Text>

      <Text className="text-white text-lg font-semibold">Name:</Text>
      <Text className="text-gray-300 mb-3">{name}</Text>

      <Text className="text-white text-lg font-semibold">Total Time Spent:</Text>
      <Text className="text-gray-300 mb-3">{formatTime(tspent || 0)}</Text>

      <Text className="text-white text-lg font-semibold">Start Date:</Text>
      <Text className="text-gray-300 mb-3">{date ? format(date) : "—"}</Text>

      <Text className="text-white text-lg font-semibold">Completion Date:</Text>
      <Text className="text-gray-300 mb-3">
        {completionDate ? format(completionDate) : compdate ? format(compdate) : "—"}
      </Text>

      <Text className="text-white text-lg font-semibold">Marked as Done:</Text>
      <Text className="text-gray-300 mb-3">{completedAt ? format(completedAt) : "—"}</Text>

      <Text className="text-white text-lg font-semibold mb-2">Photos:</Text>
      {photos.length > 0 ? (
        <View className="flex-row flex-wrap gap-3">
          {photos.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              className="w-24 h-24 rounded-lg mb-3 mr-3"
            />
          ))}
        </View>
      ) : (
        <Text className="text-gray-400">No photos available</Text>
      )}
    </ScrollView>
  );
};

export default TaskDetail;
