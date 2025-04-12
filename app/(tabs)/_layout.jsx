import React from 'react';
import { Image } from 'react-native';
import { Tabs } from 'expo-router';

import homeIcon from '../../assets/images/home.png';
import profileIcon from '../../assets/images/profile.png';
import settingIcon from '../../assets/images/settings.png';
// Add any other icons as needed

const _layout = () => {
  const iconStyle = {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginTop: 5,
  };

  return (
    <Tabs screenOptions={{ tabBarShowLabel: true, headerShown: true }}>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image source={homeIcon} style={iconStyle} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image source={profileIcon} style={iconStyle} />
          ),
        }}
      />


      {/* Settings Tab (at the end) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Image source={settingIcon} style={iconStyle} />
          ),
        }}
      />
    </Tabs>
  )
};

export default _layout;
