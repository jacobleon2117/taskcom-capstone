import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as Location from "expo-location";
import MapboxGL from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@/config/mapbox";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface MapViewProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  showUserLocation?: boolean;
  children?: React.ReactNode;
  style?: any;
  onRegionChange?: (region: any) => void;
  onUserLocationChange?: (location: any) => void;
}

const MapView: React.FC<MapViewProps> = ({
  initialRegion = {
    latitude: 36.2524,
    longitude: -95.7911,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  showUserLocation = true,
  children,
  style,
  onRegionChange,
  onUserLocationChange,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (showUserLocation) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        try {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          if (onUserLocationChange) {
            onUserLocationChange(location);
          }
        } catch (err) {
          setErrorMsg("Could not get current location");
        }
      }
    })();
  }, [showUserLocation]);

  const mapboxCoordinates = [initialRegion.longitude, initialRegion.latitude];

  return (
    <View style={[styles.container, style]}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={mapboxCoordinates} />
        {showUserLocation && location && (
          <MapboxGL.UserLocation visible={true} />
        )}
        {children}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapView;
