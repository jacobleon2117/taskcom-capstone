// src/components/ui/Map/Marker.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Marker as RNMarker } from "react-native-maps";
import MapboxGL from "@rnmapbox/maps";

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Marker: React.FC<MarkerProps> = ({
  coordinate,
  title,
  description,
  children,
}) => {
  const mapboxCoordinates = [coordinate.longitude, coordinate.latitude];

  return (
    <MapboxGL.PointAnnotation
      id={`point-${coordinate.latitude}-${coordinate.longitude}`}
      coordinate={mapboxCoordinates}
      title={title}
    >
      {children || <View style={styles.defaultMarker} />}
    </MapboxGL.PointAnnotation>
  );
};

const styles = StyleSheet.create({
  defaultMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default Marker;
