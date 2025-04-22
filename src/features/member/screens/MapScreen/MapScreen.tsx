// src/features/member/screens/MapScreen/MapScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MapView, Marker } from "../../../../components/ui/Map";
import * as Location from "expo-location";

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 36.2524,
    longitude: -95.7911,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });

  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const toggleLocationSharing = () => {
    setIsSharing(!isSharing);
    // Here you would implement the actual location sharing logic with your backend
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Location</Text>
        <TouchableOpacity
          style={[
            styles.shareButton,
            isSharing ? styles.sharingActive : styles.sharingInactive,
          ]}
          onPress={toggleLocationSharing}
        >
          <Ionicons
            name={isSharing ? "location" : "location-outline"}
            size={20}
            color={isSharing ? "white" : "#F09737"}
          />
          <Text
            style={[
              styles.shareButtonText,
              isSharing ? styles.sharingActiveText : styles.sharingInactiveText,
            ]}
          >
            {isSharing ? "Sharing" : "Share Location"}
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        initialRegion={region}
        showUserLocation={true}
        style={styles.map}
        onUserLocationChange={(location) => setUserLocation(location)}
      />

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current Location</Text>
          {userLocation ? (
            <>
              <Text style={styles.infoText}>
                Latitude: {userLocation.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.infoText}>
                Longitude: {userLocation.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.infoText}>
                Accuracy: ±{userLocation.coords.accuracy?.toFixed(1)}m
              </Text>
            </>
          ) : (
            <Text style={styles.noLocationText}>Waiting for location...</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Nearby Team Members</Text>
          <Text style={styles.noLocationText}>No team members nearby</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  sharingActive: {
    backgroundColor: "#F09737",
    borderColor: "#F09737",
  },
  sharingInactive: {
    backgroundColor: "transparent",
    borderColor: "#F09737",
  },
  shareButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  sharingActiveText: {
    color: "white",
  },
  sharingInactiveText: {
    color: "#F09737",
  },
  map: {
    height: "60%",
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noLocationText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});

export default MapScreen;
