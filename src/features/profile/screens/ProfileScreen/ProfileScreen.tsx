import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../../auth/context/AuthContext";
import CustomHeader from "@/components/CustomHeader";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by AppNavigator
          } catch (error) {
            Alert.alert("Logout Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const settingsItems = [
    { id: "notifications", icon: "bell", title: "Notifications" },
    { id: "location", icon: "location-arrow", title: "Location preferences" },
    { id: "accessibility", icon: "universal-access", title: "Accessibility" },
    { id: "language", icon: "globe", title: "Language and region" },
    { id: "darkMode", icon: "moon-o", title: "Dark mode" },
    { id: "help", icon: "question-circle", title: "Need help?" },
    { id: "logout", icon: "sign-out", title: "Log out" },
  ];

  const handleSettingPress = (id: string) => {
    if (id === "logout") {
      handleLogout();
    } else {
      // Handle other settings
      Alert.alert("Setting", `${id} setting will be implemented soon`);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Profile" showBackButton={false} />
      </SafeAreaView>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileInitials}>
              <Text style={styles.initialsText}>
                {user?.displayName
                  ?.split(" ")
                  .map((name) => name.charAt(0))
                  .join("") || "U"}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>
                {user?.displayName || "User"}
              </Text>
              <Text style={styles.profileRole}>{user?.role || "Member"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings and privacy</Text>

          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={() => handleSettingPress(item.id)}
            >
              <FontAwesome
                name={item.icon as any}
                size={20}
                color="#fff"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{item.title}</Text>
              {item.id === "logout" ? (
                <View style={styles.logoutIndicator} />
              ) : (
                <FontAwesome name="chevron-right" size={12} color="#aaa" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    backgroundColor: "#000",
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F09737",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  nameContainer: {
    marginLeft: 12,
  },
  profileName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileRole: {
    color: "#aaa",
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  settingIcon: {
    width: 24,
    marginRight: 16,
    textAlign: "center",
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  logoutIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F09737",
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProfileScreen;
