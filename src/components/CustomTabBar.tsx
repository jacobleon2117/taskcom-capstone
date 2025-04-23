import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/features/auth/context/AuthContext";

// Get icon based on route name
const getIcon = (routeName: string, isFocused: boolean) => {
  const iconColor = isFocused ? "#F09737" : "#888";
  const iconSize = 24;

  switch (routeName) {
    case "Home":
      return <Ionicons name="home" size={iconSize} color={iconColor} />;
    case "Map":
      return <Ionicons name="map" size={iconSize} color={iconColor} />;
    case "Missions":
      return (
        <MaterialIcons name="assignment" size={iconSize} color={iconColor} />
      );
    case "Team":
      return <Ionicons name="people" size={iconSize} color={iconColor} />;
    case "Profile":
      return <Ionicons name="person" size={iconSize} color={iconColor} />;
    default:
      return <Ionicons name="apps" size={iconSize} color={iconColor} />;
  }
};

// Custom Tab Bar component
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Skip rendering tabs that are admin-only if user is not an admin
          if (route.name === "Team" && !isAdmin) {
            return null;
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
            >
              {getIcon(route.name, isFocused)}
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderRadius: 30,
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  tabLabelFocused: {
    color: "#F09737",
    fontWeight: "bold",
  },
});

export default CustomTabBar;
