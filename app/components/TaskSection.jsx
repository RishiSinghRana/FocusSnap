import React from "react";
import { View, Text, FlatList } from "react-native";
import dayjs from "dayjs";
import TaskItem from "./TaskItem";  // Assuming the individual task rendering is moved to a TaskItem component

const TaskSection = ({ title, tasks, taskCount, renderItem, ListEmptyComponent }) => {
  return (
    <>
      <Text className="text-white text-lg font-bold mb-3">
        {title} <Text className="text-yellow-400">({taskCount})</Text>
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};

export default TaskSection;
