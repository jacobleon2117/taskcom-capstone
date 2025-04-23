import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Auth Screens
import AuthNavigator from "./AuthNavigator";

// Custom Components
import CustomTabBar from "@/components/CustomTabBar";

// Member Screens
import HomeScreen from "@/features/dashboard/screens/HomeScreen/HomeScreen";
import MapScreen from "@/features/member/screens/MapScreen/MapScreen";
import MissionReportScreen from "@/features/member/screens/MissionReportScreen/MissionReportScreen";
import ProfileScreen from "@/features/profile/screens/ProfileScreen/ProfileScreen";

// Admin Screens
import TeamScreen from "@/features/admin/screens/TeamManagementScreen/TeamManagementScreen";
// import SettingsScreen from "@/features/auth/admin/screens/SettingsScreen";

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Member Tab Navigator
const MemberTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Missions" component={MissionReportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Missions" component={MissionReportScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
    </Tab.Navigator>
  );
};

// Main stack with conditional rendering based on auth state
const AppNavigatorContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Not authenticated - show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === "admin" ? (
          // User is admin - show admin screens
          <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
        ) : (
          // User is member - show member screens
          <Stack.Screen name="MemberTabs" component={MemberTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrap main component with AuthProvider
const AppNavigator: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigatorContent />
    </AuthProvider>
  );
};

export default AppNavigator;
