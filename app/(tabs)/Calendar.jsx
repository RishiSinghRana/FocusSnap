import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar as RNCalendar } from "react-native-calendars";
import dayjs from "dayjs";

const Calendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [dailyTime, setDailyTime] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [selectedTotal, setSelectedTotal] = useState(0);

  useEffect(() => {
    loadTaskData();
  }, []);

  const loadTaskData = async () => {
    const stored = await AsyncStorage.getItem("tasks");
    const tasks = stored ? JSON.parse(stored) : [];

    const dayTotals = {};
    let yearTotal = 0;

    tasks.forEach((task) => {
      if (!task?.timeLogs || !task?.startDate) return;

      const taskDate = dayjs(task.startDate).format("YYYY-MM-DD");
      const taskYear = dayjs(task.startDate).format("YYYY");

      const totalTime = task.timeLogs.reduce((acc, log) => acc + (log?.duration || 0), 0);

      // Day
      dayTotals[taskDate] = (dayTotals[taskDate] || 0) + totalTime;

      // Year
      if (dayjs().format("YYYY") === taskYear) {
        yearTotal += totalTime;
      }
    });

    const markDates = {};
    for (const date in dayTotals) {
      markDates[date] = {
        marked: true,
        dotColor: "orange",
      };
    }

    setMarkedDates(markDates);
    setDailyTime(dayTotals);
    setYearlyTotal(yearTotal);
    updateMonthlyTotal(dayjs().format("YYYY-MM"), dayTotals);
    updateSelectedTotal(dayjs().format("YYYY-MM-DD"), dayTotals);
  };

  const updateMonthlyTotal = (month, timeData) => {
    const total = Object.entries(timeData)
      .filter(([date]) => date.startsWith(month))
      .reduce((sum, [_, t]) => sum + t, 0);
    setMonthlyTotal(total);
  };

  const updateSelectedTotal = (date, timeData) => {
    setSelectedTotal(timeData[date] || 0);
  };

  const onDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    updateMonthlyTotal(date.slice(0, 7), dailyTime);
    updateSelectedTotal(date, dailyTime);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-2xl font-bold mb-4 text-center">Calendar</Text>
      <RNCalendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: "blue",
            marked: true,
            dotColor: "orange",
          },
        }}
        theme={{
          calendarBackground: "#1f2937",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          todayTextColor: "#3b82f6",
          selectedDayBackgroundColor: "#3b82f6",
          selectedDayTextColor: "#fff",
          arrowColor: "#fff",
        }}
      />

      <View className="mt-6 bg-gray-800 rounded-lg p-4">
        <Text className="text-white text-lg font-bold mb-2">Stats</Text>
        <Text className="text-gray-300">📅 Selected Day: {formatTime(selectedTotal)}</Text>
        <Text className="text-gray-300">🗓️ This Month: {formatTime(monthlyTotal)}</Text>
        <Text className="text-gray-300">📆 This Year: {formatTime(yearlyTotal)}</Text>
      </View>
    </ScrollView>
  );
};

export default Calendar;
