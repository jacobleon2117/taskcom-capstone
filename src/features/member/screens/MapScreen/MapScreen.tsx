import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/features/auth/context/AuthContext";
import * as Location from "expo-location";
import MapboxGL from "@rnmapbox/maps";
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// Configure Mapbox
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// Type definitions
interface Pin {
  id: string;
  coordinate: [number, number]; // [longitude, latitude]
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  type: "observation" | "alert" | "point-of-interest";
}

interface TeamMember {
  id: string;
  name: string;
  coordinate?: [number, number]; // Optional in case location isn't available
  online: boolean;
  lastUpdated: Date;
}

interface Mission {
  id: string;
  title: string;
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  teamMembers: string[]; // User IDs
  createdBy: string; // User ID of admin or self
  pins: Pin[];
  type: "team" | "individual" | "training";
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Map and location state
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Mission state
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  // UI state
  const [showPinModal, setShowPinModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [newPin, setNewPin] = useState<Partial<Pin>>({
    title: "",
    description: "",
    type: "observation",
  });
  const [newMission, setNewMission] = useState<Partial<Mission>>({
    title: "",
    type: "individual",
  });

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

        // Set up location subscription
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10, // Update if moved 10 meters
            timeInterval: 5000, // Update every 5 seconds
          },
          (location) => {
            setLocation([location.coords.longitude, location.coords.latitude]);

            // Update user location in the database if mission is active
            if (activeMission?.isActive) {
              updateUserLocation([
                location.coords.longitude,
                location.coords.latitude,
              ]);
            }
          }
        );
      } catch (error) {
        Alert.alert("Error", "Failed to get location");
        console.error("Location error:", error);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // Fetch team members (if admin) and active mission (if any)
  useEffect(() => {
    if (isAdmin) {
      fetchTeamMembers();
    }
    fetchActiveMission();
  }, [isAdmin]);

  // Mock functions - replace these with actual Firebase calls
  const fetchTeamMembers = async () => {
    // Fetch team members from Firestore
    // This is a mock implementation
    setTeamMembers([
      {
        id: "1",
        name: "John Doe",
        coordinate: [-74.006, 40.7128], // New York
        online: true,
        lastUpdated: new Date(),
      },
      {
        id: "2",
        name: "Jane Smith",
        coordinate: [-74.0061, 40.713],
        online: true,
        lastUpdated: new Date(),
      },
    ]);
  };

  const fetchActiveMission = async () => {
    // Fetch active mission from Firestore
    // This is a mock implementation
    // In a real app, you'd query for active missions for this user
  };

  const updateUserLocation = async (coordinates: [number, number]) => {
    // Update user location in Firestore
    // This is where you'd update the user's location in the database
    console.log("Updating user location:", coordinates);
  };

  const startMission = async () => {
    if (!newMission.title) {
      Alert.alert("Error", "Please enter a mission title");
      return;
    }

    // For admin checking team members
    if (
      isAdmin &&
      newMission.type === "team" &&
      selectedTeamMembers.length === 0
    ) {
      Alert.alert("Error", "Please select at least one team member");
      return;
    }

    const missionData: Mission = {
      id: Date.now().toString(), // Use a proper UUID in production
      title: newMission.title || "Untitled Mission",
      startedAt: new Date(),
      isActive: true,
      teamMembers:
        isAdmin && newMission.type === "team"
          ? selectedTeamMembers
          : [user?.uid || ""],
      createdBy: user?.uid || "",
      pins: [],
      type: newMission.type as "team" | "individual" | "training",
    };

    // Save to Firestore
    // This is where you'd create the mission in the database

    // Update local state
    setActiveMission(missionData);
    setShowMissionModal(false);

    // Clear form
    setNewMission({
      title: "",
      type: "individual",
    });

    Alert.alert("Success", `${missionData.title} mission started!`);
  };

  const endMission = async () => {
    if (!activeMission) return;

    // Confirm with user
    Alert.alert(
      "End Mission",
      "Are you sure you want to end this mission? A mission report will be generated.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Mission",
          style: "destructive",
          onPress: async () => {
            // Update mission in Firestore
            // This is where you'd update the mission in the database

            // Generate mission report
            // This is where you'd create a mission report

            // Update local state
            setActiveMission(null);
            setPins([]);

            // Navigate to mission report
            navigation.navigate("MissionReport" as never);
          },
        },
      ]
    );
  };

  const addPin = async () => {
    if (!location) {
      Alert.alert("Error", "Cannot add pin: Location not available");
      return;
    }

    if (!newPin.title) {
      Alert.alert("Error", "Please enter a pin title");
      return;
    }

    const pin: Pin = {
      id: Date.now().toString(), // Use a proper UUID in production
      coordinate: location,
      title: newPin.title || "Untitled Pin",
      description: newPin.description || "",
      createdBy: user?.uid || "",
      createdAt: new Date(),
      type: newPin.type as "observation" | "alert" | "point-of-interest",
    };

    // Save to Firestore
    // This is where you'd add the pin to the database

    // Update local state
    setPins([...pins, pin]);
    setShowPinModal(false);

    // Clear form
    setNewPin({
      title: "",
      description: "",
      type: "observation",
    });
  };

  const renderPin = (pin: Pin) => {
    const pinColor =
      pin.type === "alert"
        ? "#ff4136"
        : pin.type === "observation"
        ? "#ffdc00"
        : "#0074d9"; // point-of-interest

    return (
      <MapboxGL.PointAnnotation
        key={pin.id}
        id={pin.id}
        coordinate={pin.coordinate}
        onSelected={() => setSelectedPin(pin)}
      >
        <View style={[styles.pinContainer, { backgroundColor: pinColor }]}>
          <FontAwesome
            name={
              pin.type === "alert"
                ? "warning"
                : pin.type === "observation"
                ? "eye"
                : "map-marker"
            }
            size={16}
            color="#fff"
          />
        </View>
      </MapboxGL.PointAnnotation>
    );
  };

  const renderTeamMember = (member: TeamMember) => {
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeMission ? activeMission.title : "Map"}
        </Text>
        {activeMission && (
          <TouchableOpacity
            style={styles.endMissionButton}
            onPress={endMission}
          >
            <Text style={styles.endMissionText}>End Mission</Text>
          </TouchableOpacity>
        )}
      </View>

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

          {/* Render pins */}
          {pins.map(renderPin)}

          {/* Render team members */}
          {isAdmin && teamMembers.map(renderTeamMember)}
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
              onPress={() => setShowMissionModal(true)}
            >
              <Text style={styles.startMissionText}>Start Mission</Text>
            </TouchableOpacity>
          )}

          {activeMission && (
            <TouchableOpacity
              style={[styles.mapButton, styles.addPinButton]}
              onPress={() => setShowPinModal(true)}
            >
              <MaterialIcons name="add-location" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Pin info panel */}
        {selectedPin && (
          <View style={styles.pinInfoPanel}>
            <View style={styles.pinInfoHeader}>
              <Text style={styles.pinInfoTitle}>{selectedPin.title}</Text>
              <TouchableOpacity onPress={() => setSelectedPin(null)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.pinInfoType}>
              {selectedPin.type.toUpperCase()}
            </Text>
            <Text style={styles.pinInfoDescription}>
              {selectedPin.description}
            </Text>
            <Text style={styles.pinInfoMeta}>
              Created {new Date(selectedPin.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>

      {/* Add Pin Modal */}
      <Modal visible={showPinModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pin</Text>
              <TouchableOpacity onPress={() => setShowPinModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Pin Title"
              placeholderTextColor="#aaa"
              value={newPin.title}
              onChangeText={(text) => setNewPin({ ...newPin, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              value={newPin.description}
              onChangeText={(text) =>
                setNewPin({ ...newPin, description: text })
              }
            />

            <Text style={styles.selectLabel}>Pin Type</Text>
            <View style={styles.pinTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.pinTypeButton,
                  newPin.type === "observation" && styles.activePinType,
                ]}
                onPress={() => setNewPin({ ...newPin, type: "observation" })}
              >
                <FontAwesome
                  name="eye"
                  size={16}
                  color={newPin.type === "observation" ? "#000" : "#fff"}
                />
                <Text
                  style={[
                    styles.pinTypeText,
                    newPin.type === "observation" && styles.activePinTypeText,
                  ]}
                >
                  Observation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pinTypeButton,
                  newPin.type === "alert" && styles.activePinType,
                  newPin.type === "alert" && { backgroundColor: "#ff4136" },
                ]}
                onPress={() => setNewPin({ ...newPin, type: "alert" })}
              >
                <FontAwesome
                  name="warning"
                  size={16}
                  color={newPin.type === "alert" ? "#000" : "#fff"}
                />
                <Text
                  style={[
                    styles.pinTypeText,
                    newPin.type === "alert" && styles.activePinTypeText,
                  ]}
                >
                  Alert
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pinTypeButton,
                  newPin.type === "point-of-interest" && styles.activePinType,
                  newPin.type === "point-of-interest" && {
                    backgroundColor: "#0074d9",
                  },
                ]}
                onPress={() =>
                  setNewPin({ ...newPin, type: "point-of-interest" })
                }
              >
                <FontAwesome
                  name="map-marker"
                  size={16}
                  color={newPin.type === "point-of-interest" ? "#000" : "#fff"}
                />
                <Text
                  style={[
                    styles.pinTypeText,
                    newPin.type === "point-of-interest" &&
                      styles.activePinTypeText,
                  ]}
                >
                  POI
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={addPin}>
              <Text style={styles.actionButtonText}>Add Pin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Start Mission Modal */}
      <Modal
        visible={showMissionModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Start New Mission</Text>
              <TouchableOpacity onPress={() => setShowMissionModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Mission Title"
              placeholderTextColor="#aaa"
              value={newMission.title}
              onChangeText={(text) =>
                setNewMission({ ...newMission, title: text })
              }
            />

            <Text style={styles.selectLabel}>Mission Type</Text>
            <View style={styles.missionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.missionTypeButton,
                  newMission.type === "individual" && styles.activeMissionType,
                ]}
                onPress={() =>
                  setNewMission({ ...newMission, type: "individual" })
                }
              >
                <FontAwesome
                  name="user"
                  size={16}
                  color={newMission.type === "individual" ? "#000" : "#fff"}
                />
                <Text
                  style={[
                    styles.missionTypeText,
                    newMission.type === "individual" &&
                      styles.activeMissionTypeText,
                  ]}
                >
                  Individual
                </Text>
              </TouchableOpacity>

              {isAdmin && (
                <TouchableOpacity
                  style={[
                    styles.missionTypeButton,
                    newMission.type === "team" && styles.activeMissionType,
                  ]}
                  onPress={() => {
                    setNewMission({ ...newMission, type: "team" });
                    if (teamMembers.length > 0) {
                      setShowTeamModal(true);
                    }
                  }}
                >
                  <FontAwesome
                    name="users"
                    size={16}
                    color={newMission.type === "team" ? "#000" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.missionTypeText,
                      newMission.type === "team" &&
                        styles.activeMissionTypeText,
                    ]}
                  >
                    Team
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.missionTypeButton,
                  newMission.type === "training" && styles.activeMissionType,
                ]}
                onPress={() =>
                  setNewMission({ ...newMission, type: "training" })
                }
              >
                <FontAwesome
                  name="graduation-cap"
                  size={16}
                  color={newMission.type === "training" ? "#000" : "#fff"}
                />
                <Text
                  style={[
                    styles.missionTypeText,
                    newMission.type === "training" &&
                      styles.activeMissionTypeText,
                  ]}
                >
                  Training
                </Text>
              </TouchableOpacity>
            </View>

            {isAdmin &&
              newMission.type === "team" &&
              selectedTeamMembers.length > 0 && (
                <View style={styles.selectedTeamContainer}>
                  <Text style={styles.selectedTeamLabel}>
                    Selected Team Members:
                  </Text>
                  <View style={styles.selectedMemberList}>
                    {selectedTeamMembers.map((memberId) => {
                      const member = teamMembers.find((m) => m.id === memberId);
                      return (
                        <View key={memberId} style={styles.selectedMemberChip}>
                          <Text style={styles.selectedMemberName}>
                            {member?.name || "Unknown"}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    style={styles.editTeamButton}
                    onPress={() => setShowTeamModal(true)}
                  >
                    <Text style={styles.editTeamText}>Edit Team</Text>
                  </TouchableOpacity>
                </View>
              )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={startMission}
            >
              <Text style={styles.actionButtonText}>Start Mission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Team Selection Modal */}
      {isAdmin && (
        <Modal visible={showTeamModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Team Members</Text>
                <TouchableOpacity onPress={() => setShowTeamModal(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.teamList}>
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
                      <View style={styles.teamMemberAvatar}>
                        <Text style={styles.teamMemberAvatarText}>
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.teamMemberName}>{member.name}</Text>
                        <Text style={styles.teamMemberStatus}>
                          {member.online ? "Online" : "Offline"}
                        </Text>
                      </View>
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
              </ScrollView>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowTeamModal(false)}
              >
                <Text style={styles.actionButtonText}>Confirm Selection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

// Continuing the styles from the previous implementation
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  endMissionButton: {
    backgroundColor: "#ff4136",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  endMissionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
  addPinButton: {
    backgroundColor: "#0074d9",
  },
  pinContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F09737",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
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
  pinInfoPanel: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderRadius: 8,
    padding: 16,
  },
  pinInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pinInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  pinInfoType: {
    color: "#F09737",
    fontSize: 12,
    marginBottom: 8,
  },
  pinInfoDescription: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 12,
  },
  pinInfoMeta: {
    color: "#aaa",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  pinTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  pinTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activePinType: {
    backgroundColor: "#F09737",
  },
  pinTypeText: {
    color: "#fff",
    marginLeft: 4,
  },
  activePinTypeText: {
    color: "#000",
    fontWeight: "bold",
  },
  missionTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  missionTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeMissionType: {
    backgroundColor: "#F09737",
  },
  missionTypeText: {
    color: "#fff",
    marginLeft: 4,
  },
  activeMissionTypeText: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedTeamContainer: {
    marginBottom: 16,
  },
  selectedTeamLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  selectedMemberList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedMemberChip: {
    backgroundColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedMemberName: {
    color: "#fff",
    fontSize: 12,
  },
  editTeamButton: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  editTeamText: {
    color: "#F09737",
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: "#F09737",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  actionButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  teamList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  teamMemberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
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
  teamMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  teamMemberAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  teamMemberName: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  teamMemberStatus: {
    color: "#aaa",
    fontSize: 12,
  },
});

export default MapScreen;
