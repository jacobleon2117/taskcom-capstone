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
import { Picker } from "@react-native-picker/picker";

// Import custom components
import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import AuthButton from "@/features/auth/components/AuthButton";

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  CreateOrganization: undefined;
  JoinOrganization: undefined;
  Dashboard: undefined;
};

type CreateOrganizationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateOrganization"
>;

interface CreateOrganizationScreenProps {
  navigation: CreateOrganizationScreenNavigationProp;
}

// Organization type options
const organizationTypes = [
  "Business",
  "Non-profit",
  "Educational",
  "Healthcare",
  "Technology",
  "Other",
];

const CreateOrganizationScreen = ({
  navigation,
}: CreateOrganizationScreenProps) => {
  // State management
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState(
    organizationTypes[0]
  );
  const [organizationNameError, setOrganizationNameError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Get auth context
  const { createOrganization, loading, error } = useAuth();

  // Validate organization name
  const validateOrganizationName = (name: string): string => {
    if (!name.trim()) {
      return "Organization name is required";
    }
    if (name.length < 3) {
      return "Organization name must be at least 3 characters";
    }
    return "";
  };

  // Handle organization creation
  const handleCreateOrganization = async () => {
    // Validate organization name
    const nameError = validateOrganizationName(organizationName);
    if (nameError) {
      setOrganizationNameError(nameError);
      return;
    }

    try {
      // Create the organization and get the generated code
      const orgCode = await createOrganization(organizationName);
      setGeneratedCode(orgCode);

      // Show success message with the code
      Alert.alert(
        "Organization Created",
        `Your organization "${organizationName}" has been created successfully! Your organization code is: ${orgCode}`,
        [
          {
            text: "Continue to Dashboard",
            onPress: () => navigation.navigate("Dashboard"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        "Organization Creation Failed",
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
            <Text style={styles.title}>Create Organization</Text>
            <Text style={styles.subtitle}>Set up your team workspace</Text>

            {/* Organization Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Name</Text>
              <TextInput
                style={[
                  styles.input,
                  organizationNameError ? styles.inputError : null,
                ]}
                value={organizationName}
                onChangeText={(text) => {
                  setOrganizationName(text);
                  setOrganizationNameError("");
                }}
                placeholder="Enter organization name"
                placeholderTextColor="#aaa"
              />
              {organizationNameError ? (
                <Text style={styles.errorText}>{organizationNameError}</Text>
              ) : null}
            </View>

            {/* Organization Type Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={organizationType}
                  onValueChange={(itemValue: string) =>
                    setOrganizationType(itemValue)
                  }
                  style={styles.picker}
                >
                  {organizationTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Generated Code Display */}
            {generatedCode ? (
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Your Organization Code:</Text>
                <Text style={styles.codeText}>{generatedCode}</Text>
                <Text style={styles.codeHelpText}>
                  Share this code with your team members so they can join your
                  organization.
                </Text>
              </View>
            ) : null}

            {/* Create Organization Button */}
            <AuthButton
              title="Create Organization"
              onPress={handleCreateOrganization}
              isLoading={loading}
            />

            {/* Join Organization Link */}
            <View style={styles.joinContainer}>
              <Text style={styles.joinText}>
                Want to join an existing organization?{" "}
              </Text>
              <Text
                style={styles.joinLinkText}
                onPress={() => navigation.navigate("JoinOrganization")}
              >
                Join
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGrid>
  );
};

// Styles
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
    marginBottom: 16,
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
  },
  inputError: {
    borderColor: "#FF5252",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF5252",
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
  },
  codeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  codeLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  codeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 8,
  },
  codeHelpText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  joinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  joinText: {
    color: "white",
  },
  joinLinkText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateOrganizationScreen;
