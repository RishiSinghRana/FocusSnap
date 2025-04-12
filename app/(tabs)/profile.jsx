import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {  useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
  const defaultProfilePicture = require("../../assets/images/profile.png");
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileDataJson = await AsyncStorage.getItem("profileData");
      const profilePictureUri = await AsyncStorage.getItem("profilePicture");
      if (profileDataJson) {
        const profileData = JSON.parse(profileDataJson);
        setName(profileData.name || "");
        setBio(profileData.bio || "");
      }
      if (profilePictureUri) {
        setProfilePicture({ uri: profilePictureUri });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={profilePicture ? profilePicture : defaultProfilePicture} style={styles.profilePicture} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Selina Oliveira</Text>
          <Text style={styles.bio}>Content creator - Birth - 09/02, Works at ...</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>400</Text>
          <Text style={styles.statLabel}>followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>100</Text>
          <Text style={styles.statLabel}>following</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
         <TouchableOpacity style={styles.button} onPress={()=> router.push('/edit-profile')}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  buttonsContainer: { width: "100%" },
  button: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: { color: "white" },
  statNumber: { fontWeight: "bold" },
  statLabel: {},
});

export default Profile;
