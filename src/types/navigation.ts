// src/types/navigation.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  CreateOrganization: undefined;
  JoinOrganization: undefined;
};

// Tab Navigator Types
export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Missions: undefined;
  Team: undefined;
  Profile: undefined;
};

// Member Stack Types
export type MemberStackParamList = {
  MemberTabs: undefined;
  Messages: undefined;
  // Add other member-specific screens here
};

// Admin Stack Types
export type AdminStackParamList = {
  AdminTabs: undefined;
  Messages: undefined;
  // Add other admin-specific screens here
};

// Auth Navigation Props
export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Login">;
export type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Signup">;
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, "ForgotPassword">;
export type CreateOrganizationScreenNavigationProp = StackNavigationProp<AuthStackParamList, "CreateOrganization">;
export type JoinOrganizationScreenNavigationProp = StackNavigationProp<AuthStackParamList, "JoinOrganization">;

// For screens that can be accessed from multiple navigators
export type MessageScreenNavigationProp = CompositeNavigationProp
  StackNavigationProp<MemberStackParamList, "Messages">,
  StackNavigationProp<AdminStackParamList, "Messages">
>;

// Tab screen navigation props
export type HomeScreenNavigationProp = CompositeNavigationProp
  BottomTabNavigationProp<MainTabParamList, "Home">,
  CompositeNavigationProp
    StackNavigationProp<MemberStackParamList>,
    StackNavigationProp<AdminStackParamList>
  >
>;

export type MapScreenNavigationProp = CompositeNavigationProp
  BottomTabNavigationProp<MainTabParamList, "Map">,
  CompositeNavigationProp
    StackNavigationProp<MemberStackParamList>,
    StackNavigationProp<AdminStackParamList>
  >
>;

export type MissionsScreenNavigationProp = CompositeNavigationProp
  BottomTabNavigationProp<MainTabParamList, "Missions">,
  CompositeNavigationProp
    StackNavigationProp<MemberStackParamList>,
    StackNavigationProp<AdminStackParamList>
  >
>;

export type TeamScreenNavigationProp = CompositeNavigationProp
  BottomTabNavigationProp<MainTabParamList, "Team">,
  StackNavigationProp<AdminStackParamList>
>;

export type ProfileScreenNavigationProp = CompositeNavigationProp
  BottomTabNavigationProp<MainTabParamList, "Profile">,
  CompositeNavigationProp
    StackNavigationProp<MemberStackParamList>,
    StackNavigationProp<AdminStackParamList>
  >
>;