import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import dayjs from "dayjs";

const TaskItem = ({ item, showDoneButton = true, restrictToEditRemoveOnly = false, modTask, remTask, markDone, markUndo, beginTask, contTask, endTask }) => {
  return (
    <View className="bg-gray-800 p-4 mb-3 rounded-lg flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-white text-lg">{item.name}</Text>
        <Text className="text-gray-400">Start Date: {dayjs(item.date).format("DD MMM YYYY")}</Text>
        <Text className="text-gray-400">
          Completion Date: {dayjs(item.completionDate || item.compdate).format("DD MMM YYYY")}
        </Text>
        <Text className="text-gray-400">Time Spent: {formatTime(item.tspent || 0)}</Text>
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

        {showDoneButton && !item.isRunning && !restrictToEditRemoveOnly && !item.isCompleted && (
          <TouchableOpacity className="mx-1" onPress={() => markDone(item.id)}>
            <Text className="text-2xl text-green-500">✓</Text>
          </TouchableOpacity>
        )}

        {item.isCompleted && (
          <TouchableOpacity className="mx-1" onPress={() => markUndo(item.id)}>
            <Text className="text-2xl">↩️</Text>
          </TouchableOpacity>
        )}
      </View>

      {item.photo && (
        <Image source={{ uri: item.photo }} className="w-10 h-10 rounded-lg ml-2" />
      )}

      {!restrictToEditRemoveOnly && !item.isCompleted && (
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
};

export default TaskItem;
