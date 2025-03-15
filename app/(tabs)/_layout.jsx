import { View, Text, ImageBackground } from 'react-native'
import homeIcon from "../../assets/images/home.png";
import profileIcon from "../../assets/images/profile.png";
import calendarIcon from "../../assets/images/calendar.png";
import settingsIcon from "../../assets/images/settings.png";
import detailsIcon from "../../assets/images/details.png";
import historyIcon from "../../assets/images/history.png"


import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index"
        options={{title: 'Home', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={homeIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name="Profile"
        options={{title: 'Profile', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={profileIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name="Calendar"
        options={{title: 'Calendar', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={calendarIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name="Settings"
        options={{title: 'Settings', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={settingsIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name="TaskDetail"
        options={{title: 'Details', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={detailsIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name="TaskHistory"
        options={{title: 'History', 
        headerShown: false,
        tabBarIcon :({ focused }) => (
          <>
            <ImageBackground 
            source={historyIcon} className='w-7 h-7 mt-2 mr-1'/>
          </>
        )
        }} />

        <Tabs.Screen name = "AddTask"
        options={{headerShown: false,
        tabBarButton: () => null
        }} />
    </Tabs>
  )
}

export default _layout