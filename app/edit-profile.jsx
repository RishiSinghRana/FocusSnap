import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select'; // Assuming you have this installed

const EditProfile = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileDataJson = await AsyncStorage.getItem('profileData');
      const profilePictureUri = await AsyncStorage.getItem('profilePicture');
      if (profileDataJson) {
        const profileData = JSON.parse(profileDataJson);
        setName(profileData.name || "");
        setUsername(profileData.username || "");
        setBio(profileData.bio || "");
        setGender(profileData.gender || "");
      }
      if (profilePictureUri) {
        setProfilePicture({uri : profilePictureUri});
      }else {
        setProfilePicture(require('../assets/images/profile.png'));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleChangeProfilePicture = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option:',
      [
        {
          text: "Choose from gallery",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
              return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) {
              setProfilePicture({ uri: result.assets[0].uri });
            }
          }
        },
        {
          text: 'Remove profile picture',
          onPress: () => {
            setProfilePicture(null);
            Alert.alert('Removed', 'Profile picture removed');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  

  const handleSave = async () => {
    try {
      const profileData = { name, username, bio, gender };
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      if(profilePicture){
        if(typeof profilePicture != 'string'){
          await AsyncStorage.setItem('profilePicture', profilePicture.uri);
        }else {
          await AsyncStorage.setItem('profilePicture', profilePicture);
        }
      }
      Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Could not save profile data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={handleChangeProfilePicture} style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={profilePicture} style={styles.profilePicture} />
          ) : (
          <View style={styles.placeholderPicture}>
            <Text>No Image</Text>
          </View>
        )}
        <Text style={styles.changePictureText}>Change profile picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Username:</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Bio:</Text>
      <TextInput style={styles.input} value={bio} onChangeText={setBio} multiline />

      <Text style={styles.label}>Gender:</Text>
      <RNPickerSelect
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select a gender', value: null }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePictureText: {
    marginTop: 5,
    color: 'blue',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text doesn't overlap the icon
    marginBottom: 10
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text doesn't overlap the icon
    marginBottom: 10
  },
});

export default EditProfile;