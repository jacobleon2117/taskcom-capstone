import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Don't show back button on the home screen
  const isHomeScreen = route.name === "Home";
  const shouldShowBackButton =
    showBackButton && !isHomeScreen && navigation.canGoBack();

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>{title}</Text>

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
    textAlign: "center",
  },
  placeholder: {
    width: 24,
  },
});

export default CustomHeader;
