import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/features/auth/context/AuthContext";
import * as Location from "expo-location";
import MapboxGL from "@rnmapbox/maps";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";

// Configure Mapbox
MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);

// Empty team members array - would be populated from Firebase
const TEAM_MEMBERS = [];

const AdminMapScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  // Map and location state
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Mission and team state
  const [activeMission, setActiveMission] = useState(null);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

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

  const handleStartTeamMission = () => {
    setShowTeamModal(true);
  };

  const renderTeamMember = (member: any) => {
    if (!member.coordinate) return null;

    return (
      <MapboxGL.PointAnnotation
        key={member.id}
        id={`team-${member.id}`}
        coordinate={member.coordinate}
      >
        <View style={styles.teamMemberMarker}>
          <Text style={styles.teamMemberInitial}>{member.name.charAt(0)}</Text>
        </View>
      </MapboxGL.PointAnnotation>
    );
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
          title="Admin Map"
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

          {/* Render team members */}
          {teamMembers.map(renderTeamMember)}
        </MapboxGL.MapView>

        {/* Admin Map controls */}
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
              onPress={handleStartTeamMission}
            >
              <Text style={styles.startMissionText}>Start Team Mission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Team Selection Modal */}
      <Modal
        visible={showTeamModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTeamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team Members</Text>
              <TouchableOpacity onPress={() => setShowTeamModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {teamMembers.length > 0 ? (
              <View style={styles.teamMembersList}>
                {teamMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.teamMemberItem,
                      selectedTeamMembers.includes(member.id) &&
                        styles.selectedTeamMember,
                    ]}
                    onPress={() => {
                      if (selectedTeamMembers.includes(member.id)) {
                        setSelectedTeamMembers(
                          selectedTeamMembers.filter((id) => id !== member.id)
                        );
                      } else {
                        setSelectedTeamMembers([
                          ...selectedTeamMembers,
                          member.id,
                        ]);
                      }
                    }}
                  >
                    <View style={styles.teamMemberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberInitial}>
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                    {selectedTeamMembers.includes(member.id) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#F09737"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyTeamContainer}>
                <Text style={styles.emptyTeamText}>
                  No team members available
                </Text>
                <Text style={styles.emptyTeamSubtext}>
                  Add team members in the Team Management screen
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                Alert.alert(
                  "Feature",
                  "Team mission feature will be available soon"
                );
                setShowTeamModal(false);
              }}
              disabled={selectedTeamMembers.length === 0}
            >
              <Text style={styles.startButtonText}>Start Mission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  teamMemberMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0074d9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  teamMemberInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  teamMembersList: {
    maxHeight: 300,
  },
  teamMemberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  selectedTeamMember: {
    backgroundColor: "rgba(240, 151, 55, 0.1)",
  },
  teamMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F09737",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  memberName: {
    color: "#fff",
    fontSize: 16,
  },
  emptyTeamContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyTeamText: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  emptyTeamSubtext: {
    color: "#777",
    textAlign: "center",
    fontSize: 14,
  },
  startButton: {
    backgroundColor: "#F09737",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  startButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AdminMapScreen;
