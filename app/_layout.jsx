import { Stack } from "expo-router";
import './global.css'
export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="components/AddTask" options={{ title: "Add Task", headerShown: false}} />
    <Stack.Screen name="components/EditTask" options={{ title: "Edit Task", headerShown: false }} />
    <Stack.Screen name="edit-profile" options={{ title: "Edit Profile", headerShown: false }} />
    <Stack.Screen name="components/TaskDetail" options={{ title: "Task Detail", headerShown: false }} />
  </Stack>;
}
