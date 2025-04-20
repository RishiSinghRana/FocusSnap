// app/components/TaskDetail.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading task...</Text>
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Task Details</Text>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.text}>{name}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Total Time Spent:</Text>
          <Text style={styles.text}>{formatTime(tspent || 0)}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.text}>{date ? format(date) : "—"}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Completion Date:</Text>
          <Text style={styles.text}>
            {completionDate ? format(completionDate) : compdate ? format(compdate) : "—"}
          </Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Marked as Done:</Text>
          <Text style={styles.text}>{completedAt ? format(completedAt) : "—"}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.label}>Photos:</Text>
          {photos.length > 0 ? (
            <View style={styles.photosContainer}>
              {photos.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.photo}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noPhotos}>No photos available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937", // Dark background
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
    backgroundColor: "#2D3748", // Card background color
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
    color: "#E2E8F0", // Light gray text for labels
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    color: "#CBD5E0", // Lighter gray text
    fontSize: 16,
    marginTop: 5,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  noPhotos: {
    color: "#A0AEC0", // Medium gray for no photos
  },
});

export default TaskDetail;
