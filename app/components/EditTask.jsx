// app/components/EditTask.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const EditTask = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [name, setName] = useState("");
  const [tspent, setTspent] = useState(0);
  const [date, setDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [compdate, setCompdate] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  useEffect(() => {
    const loadTask = async () => {
      const saved = await AsyncStorage.getItem("tasks");
      const parsed = saved ? JSON.parse(saved) : [];
      const selected = parsed.find((task) => task.id.toString() === id);
      if (selected) {
        setTask(selected);
        setName(selected.name);
        setTspent(selected.tspent || 0);
        setDate(selected.date);
        setCompletionDate(selected.completionDate);
        setCompdate(selected.compdate);
        setCompletedAt(selected.completedAt);
      }
    };
    loadTask();
  }, [id]);

  const handleSave = async () => {
    const saved = await AsyncStorage.getItem("tasks");
    const parsed = saved ? JSON.parse(saved) : [];
    const updatedTasks = parsed.map((task) =>
      task.id.toString() === id ? { ...task, name, tspent, date, completionDate, compdate, completedAt } : task
    );
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    router.push(`/taskDetail?id=${id}`); // Navigate back to task detail after saving
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Task</Text>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter task name"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Total Time Spent:</Text>
          <TextInput
            style={styles.input}
            value={String(tspent)}
            onChangeText={(text) => setTspent(Number(text))}
            keyboardType="numeric"
            placeholder="Enter time spent"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Start Date:</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Enter start date (DD/MM/YYYY)"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Completion Date:</Text>
          <TextInput
            style={styles.input}
            value={completionDate}
            onChangeText={setCompletionDate}
            placeholder="Enter completion date (DD/MM/YYYY)"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Marked as Done:</Text>
          <TextInput
            style={styles.input}
            value={completedAt}
            onChangeText={setCompletedAt}
            placeholder="Enter done date (DD/MM/YYYY)"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Completion Status:</Text>
          <TextInput
            style={styles.input}
            value={compdate}
            onChangeText={setCompdate}
            placeholder="Enter completion status (optional)"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.cardSection}>
          <Button title="Save" onPress={handleSave} color="#4CAF50" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#1F2937",
    padding: 20,
  },
  card: {
    backgroundColor: "#2D3748",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cardSection: {
    marginBottom: 15,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#4A5568",
    color: "#E2E8F0",
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});

export default EditTask;
