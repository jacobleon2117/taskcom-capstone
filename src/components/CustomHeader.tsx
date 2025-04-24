// src/components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  transparent?: boolean; // New prop for transparency
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
  transparent = false, // Default to false
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Don't show back button on the main tab screens
  const mainScreens = ["Home", "Map", "Missions", "Team", "Profile"];
  const isMainScreen = mainScreens.includes(route.name);
  const shouldShowBackButton =
    showBackButton && !isMainScreen && navigation.canGoBack();

  return (
    <View
      style={[styles.container, transparent && styles.transparentContainer]}
    >
      <View style={styles.leftContainer}>
        {shouldShowBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={[styles.title, transparent && styles.transparentTitle]}>
        {title}
      </Text>

      <View style={styles.rightContainer}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
  transparentContainer: {
    backgroundColor: "rgba(0,0,0,0.6)", // 60% transparent
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left", // Align left
  },
  transparentTitle: {
    color: "#fff", // Adjust color if needed
  },
  placeholder: {
    width: 24,
  },
});

export default CustomHeader;
