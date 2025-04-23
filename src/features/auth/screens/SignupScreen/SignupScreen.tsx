// src/features/auth/screens/SignupScreen/SignupScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SignupScreenNavigationProp } from "@/types/navigation";

import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import EmailField from "@/features/auth/components/EmailField";
import PasswordField from "@/features/auth/components/PasswordField";
import FullNameField from "@/features/auth/components/FullNameField";
import AuthButton from "@/features/auth/components/AuthButton";
import LinkText from "@/features/auth/components/LinkText";
import AuthHeader from "@/features/auth/components/AuthHeader";

import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
} from "@/utils/validation";

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { register, loading, error } = useAuth();

  const handleSignup = async () => {
    // Clear previous errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

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

    const confirmPasswordValidationError = validateConfirmPassword(
      password,
      confirmPassword
    );
    if (confirmPasswordValidationError) {
      setConfirmPasswordError(confirmPasswordValidationError);
      return;
    }

    try {
      await register(email, password, fullName);

      // Navigate to the CreateOrganization screen on successful registration
      navigation.navigate("CreateOrganization");
    } catch (err: any) {
      // Handle specific Firebase error codes
      if (err.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already Registered",
          "This email address is already in use. Would you like to login instead?",
          [
            {
              text: "Go to Login",
              onPress: () => navigation.navigate("Login"),
            },
            {
              text: "Try Again",
              style: "cancel",
            },
          ]
        );
      } else if (err.code === "auth/weak-password") {
        setPasswordError(
          "Password is too weak. Please use a stronger password."
        );
      } else if (err.code === "auth/invalid-email") {
        setEmailError("Invalid email address format.");
      } else if (err.code === "auth/network-request-failed") {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else {
        // Generic error handling for other errors
        Alert.alert(
          "Signup Failed",
          err.message || "An unexpected error occurred"
        );
      }
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
              title="Create Account"
              subtitle="Start your TaskCom journey"
            />

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
              placeholder="Confirm your password"
            />

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
