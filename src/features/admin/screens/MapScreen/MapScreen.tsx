// src/features/admin/screens/MapScreen/MapScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MapView, Marker } from "../../../../components/ui/Map";
import * as Location from "expo-location";

// Sample team location data
const TEAM_LOCATIONS = [
  {
    id: "1",
    name: "John Doe",
    latitude: 36.2594,
    longitude: -95.7889,
    role: "Field Agent",
  },
  {
    id: "2",
    name: "Jane Smith",
    latitude: 36.2534,
    longitude: -95.795,
    role: "Team Lead",
  },
  {
    id: "3",
    name: "Mike Johnson",
    latitude: 36.2484,
    longitude: -95.7851,
    role: "Support Staff",
  },
];

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 36.2524,
    longitude: -95.7911,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleRegionChange = (newRegion: any) => {
    setRegion(newRegion);
  };

  const handleUserLocationChange = (location: Location.LocationObject) => {
    setUserLocation(location);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Locations</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#F09737" />
        </TouchableOpacity>
      </View>

      <MapView
        initialRegion={region}
        showUserLocation={true}
        style={styles.map}
        onRegionChange={handleRegionChange}
        onUserLocationChange={handleUserLocationChange}
      >
        {TEAM_LOCATIONS.map((member) => (
          <Marker
            key={member.id}
            coordinate={{
              latitude: member.latitude,
              longitude: member.longitude,
            }}
            title={member.name}
            description={member.role}
          />
        ))}
      </MapView>

      <View style={styles.teamListContainer}>
        <Text style={styles.teamListTitle}>Team Members</Text>
        {TEAM_LOCATIONS.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={[
              styles.teamMemberItem,
              selectedMember === member.id && styles.selectedMember,
            ]}
            onPress={() => setSelectedMember(member.id)}
          >
            <View style={styles.memberIndicator} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))}
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
  refreshButton: {
    padding: 8,
  },
  map: {
    height: "60%",
  },
  teamListContainer: {
    padding: 16,
    flex: 1,
  },
  teamListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  teamMemberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedMember: {
    backgroundColor: "#f9f9f9",
  },
  memberIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
  },
});

export default MapScreen;
