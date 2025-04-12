import AsyncStorage from "@react-native-async-storage/async-storage";

const storage_keys = {
  TASKS: "tasks_data",
  USER_SETTINGS: "user_settings",
  TIMER_STATE: "timer_state",
  USER_PROFILE: "userProfile",
};

export const getTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(storage_keys.TASKS);
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(storage_keys.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

export const addTask = async (task) => {
  const tasks = await getTasks();
  tasks.push(task);
  await saveTasks(tasks);
};

export const updateTask = async (updatedTask) => {
  let tasks = await getTasks();
  tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
  await saveTasks(tasks);
};

export const deleteTask = async (taskId) => {
  let tasks = await getTasks();
  tasks = tasks.filter((task) => task.id !== taskId);
  await saveTasks(tasks);
};

export const getProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(storage_keys.USER_PROFILE);
    return jsonValue !== null ? JSON.parse(jsonValue) : {};
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {};
  }
};

export const saveProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(storage_keys.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};
