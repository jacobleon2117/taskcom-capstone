// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Import navigation types
import {
  AuthStackParamList,
  MainTabParamList,
  MemberStackParamList,
  AdminStackParamList,
} from "@/types/navigation";

// Auth Screens
import LoginScreen from "@/features/auth/screens/LoginScreen/LoginScreen";
import SignupScreen from "@/features/auth/screens/SignupScreen/SignupScreen";
import ForgotPasswordScreen from "@/features/auth/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import CreateOrganizationScreen from "@/features/auth/screens/OrgCreationScreen/OrgCreationScreen";
import JoinOrganizationScreen from "@/features/auth/screens/OrgJoinScreen/JoinOrgScreen";

// Custom Components
import CustomTabBar from "@/components/CustomTabBar";

// Member Screens
import HomeScreen from "@/features/dashboard/screens/HomeScreen";
import MemberMapScreen from "@/features/member/screens/MemberMapScreen";
import MemberMissionReportScreen from "@/features/member/screens/MemberMissionReportScreen";
import MemberScheduleScreen from "@/features/member/screens/MemberScheduleScreen";
import ProfileScreen from "@/features/dashboard/screens/ProfileScreen";
import MessagesScreen from "@/features/dashboard/screens/MessagesScreen";

// Admin Screens
import AdminMapScreen from "@/features/admin/screens/AdminMapScreen";
import AdminMissionReportScreen from "@/features/admin/screens/AdminMissionReportScreen";
import AdminScheduleScreen from "@/features/admin/screens/AdminScheduleScreen";
import TeamScreen from "@/features/admin/screens/AdminTeamManagementScreen";

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MemberStack = createStackNavigator<MemberStackParamList>();
const AdminStack = createStackNavigator<AdminStackParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        name="CreateOrganization"
        component={CreateOrganizationScreen}
      />
      <AuthStack.Screen
        name="JoinOrganization"
        component={JoinOrganizationScreen}
      />
    </AuthStack.Navigator>
  );
};

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
      <Tab.Screen name="Map" component={MemberMapScreen} />
      <Tab.Screen name="Schedule" component={MemberScheduleScreen} />
      <Tab.Screen name="Missions" component={MemberMissionReportScreen} />
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
      <Tab.Screen name="Map" component={AdminMapScreen} />
      <Tab.Screen name="Schedule" component={AdminScheduleScreen} />
      <Tab.Screen name="Missions" component={AdminMissionReportScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main stack with additional screens for members
const MemberStackNavigator = () => {
  return (
    <MemberStack.Navigator screenOptions={{ headerShown: false }}>
      <MemberStack.Screen name="MemberTabs" component={MemberTabNavigator} />
      <MemberStack.Screen name="Messages" component={MessagesScreen} />
      {/* Add other member-specific screens that need to be outside the tab navigator */}
    </MemberStack.Navigator>
  );
};

// Admin stack with additional screens
const AdminStackNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminTabs" component={AdminTabNavigator} />
      <AdminStack.Screen name="Messages" component={MessagesScreen} />
      {/* Add other admin-specific screens that need to be outside the tab navigator */}
    </AdminStack.Navigator>
  );
};

// Main app navigator with conditional rendering based on auth state
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
          <Stack.Screen name="AdminStack" component={AdminStackNavigator} />
        ) : (
          // User is member - show member screens
          <Stack.Screen name="MemberStack" component={MemberStackNavigator} />
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
