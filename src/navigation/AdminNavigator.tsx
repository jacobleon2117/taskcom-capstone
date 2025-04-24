// src/navigation/AdminNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import HomeScreen from "@/features/dashboard/screens/HomeScreen";
import MapScreen from "@/features/admin/screens/AdminMapScreen";
import ScheduleScreen from "@/features/member/screens/MemberScheduleScreen";
import MessagesScreen from "@/features/dashboard/screens/MessagesScreen";
import MissionReportScreen from "@/features/member/screens/MissionReportScreen/MissionReportScreen";
import ProfileScreen from "@/features/dashboard/screens/ProfileScreen";
import TeamManagementScreen from "@/features/admin/screens/AdminTeamManagementScreen";

const Tab = createBottomTabNavigator();

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#333",
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "#F09737",
        tabBarInactiveTintColor: "#fff",
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <FontAwesome name="home" size={size} color={color} />;
          } else if (route.name === "Schedule") {
            return <FontAwesome name="calendar" size={size} color={color} />;
          } else if (route.name === "Messages") {
            return <FontAwesome name="comments" size={size} color={color} />;
          } else if (route.name === "Map") {
            return <FontAwesome name="map" size={size} color={color} />;
          } else if (route.name === "MissionReports") {
            return <FontAwesome name="file-text-o" size={size} color={color} />;
          } else if (route.name === "Profile") {
            return <FontAwesome name="user" size={size} color={color} />;
          } else if (route.name === "Team") {
            return <FontAwesome name="users" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen
        name="MissionReports"
        component={MissionReportScreen}
        options={{ title: "Mission Reports" }}
      />
      <Tab.Screen
        name="Team"
        component={TeamManagementScreen}
        options={{ title: "Team" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
