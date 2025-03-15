import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for storing tasks
const TASKS_STORAGE_KEY = "tasks_data";

// Get all tasks
export const getTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Save tasks
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

// Add a new task
export const addTask = async (task) => {
  const tasks = await getTasks();
  tasks.push(task);
  await saveTasks(tasks);
};

// Update a task
export const updateTask = async (updatedTask) => {
  let tasks = await getTasks();
  tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
  await saveTasks(tasks);
};

// Delete a task
export const deleteTask = async (taskId) => {
  let tasks = await getTasks();
  tasks = tasks.filter((task) => task.id !== taskId);
  await saveTasks(tasks);
};
