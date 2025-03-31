import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import RNPickerSelect from "react-native-picker-select";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const screenWidth = Dimensions.get("window").width;

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("date");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadTaskHistory();
  }, []);

  const loadTaskHistory = async () => {
    try {
      const savedTasks = await SecureStore.getItemAsync("taskHistory");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const calculateStreaks = () => {
    const completedDays = new Set(tasks.map((task) => formatDate(task.date)));
    const today = new Date();
    let streak = 0, maxStreak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (completedDays.has(formatDate(checkDate))) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  };

  const exportData = async (type) => {
    setExporting(true);
    let content = "Date,Task Name,Duration (mins)\n";
    tasks.forEach((task) => {
      content += `${formatDate(task.date)},${task.name},${task.duration}\n`;
    });

    const fileUri = `${FileSystem.documentDirectory}task_history.${type}`;
    await FileSystem.writeAsStringAsync(fileUri, content);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Export Failed", "Sharing not available.");
    }
    setExporting(false);
  };

  return (
    <View style={tw`flex-1 bg-gray-100 dark:bg-gray-900 p-5`}>
      <Text style={tw`text-xl font-bold text-gray-800 dark:text-white mb-4`}>Task History</Text>

      {/* Filter & Sort Options */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg text-gray-700 dark:text-white mb-2`}>Sort By</Text>
        <RNPickerSelect
          onValueChange={setFilter}
          value={filter}
          items={[
            { label: "Date", value: "date" },
            { label: "Duration", value: "duration" },
            { label: "Task Name", value: "name" },
          ]}
          style={{
            inputIOS: tw`bg-white p-3 rounded-lg`,
            inputAndroid: tw`bg-white p-3 rounded-lg`,
          }}
        />
      </View>

      {/* Task List */}
      <ScrollView style={tw`flex-1`}>
        {tasks.length === 0 ? (
          <Text style={tw`text-center text-lg text-gray-500`}>No completed tasks yet.</Text>
        ) : (
          tasks
            .sort((a, b) => (filter === "date" ? new Date(a.date) - new Date(b.date) : filter === "duration" ? b.duration - a.duration : a.name.localeCompare(b.name)))
            .map((task, index) => (
              <View key={index} style={tw`bg-white dark:bg-gray-800 p-4 mb-3 rounded-lg`}>
                <Text style={tw`text-lg font-bold text-gray-800 dark:text-white`}>{task.name}</Text>
                <Text style={tw`text-gray-600 dark:text-gray-300`}>{formatDate(task.date)}</Text>
                <Text style={tw`text-gray-600 dark:text-gray-300`}>Duration: {task.duration} mins</Text>
              </View>
            ))
        )}
      </ScrollView>

      {/* Task Streak */}
      <Text style={tw`text-lg text-gray-700 dark:text-white mt-4`}>Max Streak: {calculateStreaks()} days</Text>

      {/* Graph View */}
      {tasks.length > 0 && (
        <View>
          <Text style={tw`text-lg text-gray-700 dark:text-white mb-2 mt-4`}>Progress Chart</Text>
          <LineChart
            data={{
              labels: tasks.slice(-7).map((task) => formatDate(task.date).split(" ")[1]),
              datasets: [{ data: tasks.slice(-7).map((task) => task.duration) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=" min"
            chartConfig={{
              backgroundColor: "#1E2923",
              backgroundGradientFrom: "#08130D",
              backgroundGradientTo: "#1E2923",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={tw`rounded-lg`}
          />
        </View>
      )}

      {/* Export Data Buttons */}
      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity style={tw`bg-blue-500 p-3 rounded-lg flex-1 mr-2`} onPress={() => exportData("csv")} disabled={exporting}>
          <Text style={tw`text-white text-center text-lg`}>Export CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-green-500 p-3 rounded-lg flex-1 ml-2`} onPress={() => exportData("pdf")} disabled={exporting}>
          <Text style={tw`text-white text-center text-lg`}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskHistory;
