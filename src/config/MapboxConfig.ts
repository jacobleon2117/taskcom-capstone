import MapboxGL from "@rnmapbox/maps";

// Import access token
const MAPBOX_PUBLIC_TOKEN =
  "pk.eyJ1Ijoiamxlb24yMTE3IiwiYSI6ImNtOXN0YWtocjA0N3cybW9oYnExNnB2aHoifQ.0RI26cYK0g0ln_mDf558vA";

// Configure Mapbox
export const initializeMapbox = () => {
  // Set the access token
  MapboxGL.setAccessToken(MAPBOX_PUBLIC_TOKEN);

  // Additional configuration
  MapboxGL.setTelemetryEnabled(false);

  console.log("Mapbox initialized with access token");
};

export default {
  initializeMapbox,
};
