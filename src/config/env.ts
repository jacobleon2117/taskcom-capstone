// src/config/env.ts
import Constants from "expo-constants";

// Extract environment variables from expo-constants
export const ENV = {
  // Firebase Configuration
  FIREBASE_CONFIG: {
    apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID,
    measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID,
  },

  // Mapbox Configuration
  MAPBOX: {
    accessToken: Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN,
    downloadToken: Constants.expoConfig?.extra?.MAPBOX_DOWNLOAD_TOKEN,
  },

  // App Environment
  APP_ENV: Constants.expoConfig?.extra?.APP_ENV || "development",

  // Utility to check if in development mode
  isDevelopment: () => Constants.expoConfig?.extra?.APP_ENV === "development",
};

// Validation function to ensure all critical env variables are set
export const validateEnvironmentVariables = () => {
  const requiredVars = [
    ENV.FIREBASE_CONFIG.apiKey,
    ENV.FIREBASE_CONFIG.projectId,
    ENV.MAPBOX.accessToken,
  ];

  const missingVars = requiredVars.filter((varValue) => !varValue);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars);
    throw new Error(`Missing required environment variables`);
  }
};
