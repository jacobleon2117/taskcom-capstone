import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "@/features/auth/screens/LoginScreen/LoginScreen";
import SignupScreen from "@/features/auth/screens/SignupScreen/SignupScreen";
import ForgotPasswordScreen from "@/features/auth/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import CreateOrganizationScreen from "@/features/auth/screens/OrgCreationScreen/OrgCreationScreen";
import JoinOrganizationScreen from "@/features/auth/screens/OrgJoinScreen/JoinOrgScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="CreateOrganization"
        component={CreateOrganizationScreen}
      />
      <Stack.Screen
        name="JoinOrganization"
        component={JoinOrganizationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
