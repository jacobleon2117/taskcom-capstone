import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";

import BackgroundGrid from "../../components/auth/BackgroundGrid";
import EmailField from "../../components/auth/EmailField";
import PasswordField from "../../components/auth/PasswordField";
import FullNameField from "../../components/auth/FullNameField";
import AuthButton from "../../components/auth/AuthButton";
import LinkText from "../../components/auth/LinkText";

import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
} from "../../utils/validation";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Signup"
>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [organizationNameError, setOrganizationNameError] = useState("");

  const { register, loading, error } = useAuth();

  const handleSignup = async () => {
    // Validate full name
    const fullNameValidationError = validateFullName(fullName);
    if (fullNameValidationError) {
      setFullNameError(fullNameValidationError);
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (!organizationName.trim()) {
      setOrganizationNameError("Organization name is required");
      return;
    }

    try {
      const organizationCode = await register(
        email,
        password,
        fullName,
        organizationName
      );

      if (organizationCode) {
        Alert.alert(
          "Registration Successful",
          `Your organization code is: ${organizationCode}. Keep this code safe!`,
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    } catch (err) {
      Alert.alert("Signup Failed", error || "An unexpected error occurred");
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your TaskCom journey</Text>

            <FullNameField
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setFullNameError("");
              }}
              error={fullNameError}
            />

            <EmailField
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              error={emailError}
            />

            <PasswordField
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              error={passwordError}
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError("");
              }}
              error={confirmPasswordError}
            />

            <View style={styles.organizationContainer}>
              <Text style={styles.organizationLabel}>Organization Name</Text>
              <View style={styles.organizationInputContainer}>
                <TouchableOpacity
                  style={styles.organizationInput}
                  onPress={() => {}}
                >
                  <Text
                    style={[
                      styles.organizationInputText,
                      !organizationName && styles.placeholderText,
                    ]}
                  >
                    {organizationName || "Enter organization name"}
                  </Text>
                </TouchableOpacity>
                {organizationNameError ? (
                  <Text style={styles.errorText}>{organizationNameError}</Text>
                ) : null}
              </View>
            </View>

            <AuthButton
              title="Sign Up"
              onPress={handleSignup}
              isLoading={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <LinkText
                text="Login"
                onPress={() => navigation.navigate("Login")}
                style={styles.loginLinkText}
              />
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
  organizationContainer: {
    marginBottom: 16,
  },
  organizationLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  organizationInputContainer: {
    marginBottom: 8,
  },
  organizationInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  organizationInputText: {
    color: "black",
  },
  placeholderText: {
    color: "#888",
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 4,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "white",
  },
  loginLinkText: {
    fontWeight: "bold",
  },
});

export default SignupScreen;
