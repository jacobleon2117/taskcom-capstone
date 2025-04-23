import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox, Platform } from "react-native";
import MapboxGL from "@rnmapbox/maps";

// Import environment configuration
import { ENV } from "@/config/env";

// Import our AppNavigator
import AppNavigator from "./src/navigation/AppNavigator";

// Ignore specific logs
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native",
  "AsyncStorage has been extracted from react-native",
  "Mapbox GL is running without access token",
]);

// Initialize Mapbox configuration
const initializeMapbox = async () => {
  try {
    // Set access token from environment variable
    const mapboxToken = ENV.MAPBOX.accessToken;

    if (!mapboxToken) {
      console.warn("Mapbox public token is not set in environment variables");
      return;
    }

    // Configure Mapbox
    MapboxGL.setAccessToken(mapboxToken);

    // Disable telemetry
    MapboxGL.setTelemetryEnabled(false);

    // Request location permissions on Android
    if (Platform.OS === "android") {
      await MapboxGL.requestAndroidLocationPermissions();
    }

    console.log("Mapbox initialized successfully");
  } catch (error) {
    console.error("Error initializing Mapbox:", error);
  }
};

export default function App() {
  // Initialize Mapbox when the app starts
  useEffect(() => {
    initializeMapbox();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
