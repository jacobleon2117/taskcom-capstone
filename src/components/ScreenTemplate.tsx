import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import CustomHeader from "@/components/CustomHeader";
// Import other necessary components

const ScreenTemplate: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title="Screen Title"
          // Provide a rightComponent if needed
          // rightComponent={<NotificationButton />}
        />
      </SafeAreaView>

      {/* Main content of the screen */}
      <View style={styles.content}>{/* Screen content goes here */}</View>
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
  content: {
    flex: 1,
    padding: 16,
  },
});

export default ScreenTemplate;
