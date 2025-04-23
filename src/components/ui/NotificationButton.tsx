// src/components/ui/NotificationButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotificationButtonProps {
  onPress: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="notifications-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default NotificationButton;
