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
  TouchableOpacity,
  Modal,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { CreateOrganizationScreenNavigationProp } from "@/types/navigation";

// Import custom components
import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthHeader from "@/features/auth/components/AuthHeader";
import LinkText from "@/features/auth/components/LinkText";

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
  const [showTypeModal, setShowTypeModal] = useState(false);

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
    // Clear previous errors
    setOrganizationNameError("");

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
            onPress: () => {
              // Navigation will be handled automatically by AppNavigator
              // when user state is updated
            },
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
            <AuthHeader
              title="Create Organization"
              subtitle="Set up your team workspace"
            />

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

            {/* Organization Type Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Type</Text>
              <TouchableOpacity
                style={styles.typeSelector}
                onPress={() => setShowTypeModal(true)}
              >
                <Text style={styles.typeSelectorText}>{organizationType}</Text>
              </TouchableOpacity>
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
              <LinkText
                text="Join"
                onPress={() => navigation.navigate("JoinOrganization")}
                style={styles.joinLinkText}
              />
            </View>
          </View>
        </ScrollView>

        {/* Organization Type Selection Modal */}
        <Modal
          visible={showTypeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Organization Type</Text>

              {organizationTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    type === organizationType && styles.selectedTypeOption,
                  ]}
                  onPress={() => {
                    setOrganizationType(type);
                    setShowTypeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === organizationType &&
                        styles.selectedTypeOptionText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTypeModal(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    borderRadius: 25,
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
  typeSelector: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 12,
    height: 45,
    justifyContent: "center",
  },
  typeSelectorText: {
    color: "#333",
    fontSize: 16,
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
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTypeOption: {
    backgroundColor: "#F09737",
  },
  typeOptionText: {
    color: "white",
    fontSize: 16,
  },
  selectedTypeOptionText: {
    color: "black",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  closeButtonText: {
    color: "#F09737",
    fontSize: 16,
  },
});

export default CreateOrganizationScreen;
