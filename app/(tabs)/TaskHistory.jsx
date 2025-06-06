// app/history.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY");
  };

  const calculateStreaks = () => {
    const completedDays = new Set(tasks.map((task) => dayjs(task.date).format("YYYY-MM-DD")));
    const today = dayjs();
    let streak = 0, maxStreak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = today.subtract(i, 'day').format("YYYY-MM-DD");
      if (completedDays.has(checkDate)) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  };

  const sortedTasks = tasks.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold mb-4 ">Task History</Text>

      {/* Task Stats */}
      <Text className="text-white text-2xl font-bold mb-4">Max Streak: <Text className="text-orange-500"> {calculateStreaks()} days🔥</Text></Text>

      {/* Task List */}
      <ScrollView className="flex-1">
        {sortedTasks.length === 0 ? (
          <Text className="text-center text-lg text-gray-400">No tasks available.</Text>
        ) : (
          sortedTasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push({ pathname: "/components/TaskDetail", params: { id: task.id.toString() } })}
              className="bg-gray-800 p-4 mb-3 rounded-lg"
            >
              <View>
                <Text className="text-white text-lg">{task.name}</Text>
                <Text className="text-gray-400">Start Date: {formatDate(task.date)}</Text>
                <Text className="text-gray-400">
                  Completion Date: {task.completionDate ? formatDate(task.completionDate) : formatDate(task.compdate)}
                </Text>
                <Text className="text-gray-400">Time Spent: {formatTime(task.tspent || 0)}</Text>
              </View>
              {task.photo && (
                <Image source={{ uri: task.photo }} className="w-10 h-10 rounded-lg mt-2" />
              )}
              <Text className={task.hasStartedOnce ? "text-green-400 mt-2" : "text-gray-400 mt-2"}>
                {task.hasStartedOnce ? "Started" : "Not Started"}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Graph View */}
      {tasks.length > 0 && (
        <View className="mt-4">
          <Text className="text-white text-lg font-bold mb-2">Progress Chart</Text>
          <LineChart
            data={{
              labels: tasks.slice(-7).map((task) => dayjs(task.date).format("DD/MM")),
              datasets: [{ data: tasks.slice(-7).map((task) => task.tspent || 0) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="s"
            chartConfig={{
              backgroundColor: "#1E2923",
              backgroundGradientFrom: "#1F2937",
              backgroundGradientTo: "#111827",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#3B82F6" }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      )}
    </View>
  );
};

export default TaskHistory;
