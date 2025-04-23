import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";

import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import AuthButton from "@/features/auth/components/AuthButton";

type OrgStackParamList = {
  CreateOrganization: undefined;
  JoinOrganization: undefined;
  Dashboard: undefined;
};

type JoinOrganizationScreenNavigationProp = StackNavigationProp<
  OrgStackParamList,
  "JoinOrganization"
>;

interface JoinOrganizationScreenProps {
  navigation: JoinOrganizationScreenNavigationProp;
}

const JoinOrganizationScreen: React.FC<JoinOrganizationScreenProps> = ({
  navigation,
}) => {
  const [organizationCode, setOrganizationCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const { joinOrg, loading, error } = useAuth();

  const validateOrganizationCode = (code: string) => {
    if (!code.trim()) {
      return "Organization code is required";
    }
    // Check if code is 6 characters long
    if (code.length !== 6) {
      return "Organization code must be 6 characters";
    }
    return "";
  };

  const handleJoinOrganization = async () => {
    // Validate organization code
    const validationError = validateOrganizationCode(organizationCode);
    if (validationError) {
      setCodeError(validationError);
      return;
    }

    try {
      // Join the organization
      await joinOrg(organizationCode);

      // Show success message
      Alert.alert(
        "Organization Joined",
        "You have successfully joined the organization!",
        [
          {
            text: "Continue to Dashboard",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        "Failed to Join Organization",
        error || "An unexpected error occurred"
      );
    }
  };

  return (
    <BackgroundGrid>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Join Organization</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code provided by your organization admin
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Code</Text>
              <TextInput
                style={[styles.input, codeError ? styles.inputError : null]}
                value={organizationCode}
                onChangeText={(text) => {
                  setOrganizationCode(text.toUpperCase());
                  setCodeError("");
                }}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#aaa"
                autoCapitalize="characters"
                maxLength={6}
              />
              {codeError ? (
                <Text style={styles.errorText}>{codeError}</Text>
              ) : null}
            </View>

            <AuthButton
              title="Join Organization"
              onPress={handleJoinOrganization}
              isLoading={loading}
            />

            <View style={styles.createContainer}>
              <Text style={styles.createText}>
                Need to create a new organization?{" "}
              </Text>
              <Text
                style={styles.createLinkText}
                onPress={() => navigation.navigate("CreateOrganization")}
              >
                Create
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGrid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: "#FF5252",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF5252",
    marginTop: 4,
  },
  createContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  createText: {
    color: "white",
  },
  createLinkText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default JoinOrganizationScreen;
