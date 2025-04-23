import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/features/auth/context/AuthContext";
import * as Location from "expo-location";
import MapboxGL from "@rnmapbox/maps";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";

// Configure Mapbox
MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);

const MemberMapScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  // Map and location state
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Mission state
  const [activeMission, setActiveMission] = useState(null);

  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permissions are required for this app to work properly."
        );
        setLoadingLocation(false);
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation([position.coords.longitude, position.coords.latitude]);
      } catch (error) {
        Alert.alert("Error", "Failed to get location");
        console.error("Location error:", error);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const handleNotificationPress = () => {
    // Handle notification press
  };

  // Render loading state
  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F09737" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title="Map"
          showBackButton={false}
          rightComponent={
            <NotificationButton onPress={handleNotificationPress} />
          }
        />
      </SafeAreaView>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Dark}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            followUserLocation={followUserLocation}
            followUserMode={MapboxGL.UserTrackingModes.Follow}
            animationDuration={500}
            defaultSettings={{
              centerCoordinate: location || [-74.006, 40.7128], // Default to NYC
              zoomLevel: 14,
            }}
          />

          <MapboxGL.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            androidRenderMode="compass"
          />
        </MapboxGL.MapView>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setFollowUserLocation(!followUserLocation)}
          >
            <MaterialIcons
              name={followUserLocation ? "location-on" : "location-off"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {location && !activeMission && (
            <TouchableOpacity
              style={[styles.mapButton, styles.startMissionButton]}
              onPress={() =>
                Alert.alert(
                  "Feature",
                  "Start mission feature will be available soon"
                )
              }
            >
              <Text style={styles.startMissionText}>Start Mission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: "absolute",
    right: 16,
    bottom: 100, // Above the bottom tab bar
    alignItems: "center",
  },
  mapButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  startMissionButton: {
    width: "auto",
    paddingHorizontal: 16,
    backgroundColor: "#F09737",
  },
  startMissionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MemberMapScreen;
