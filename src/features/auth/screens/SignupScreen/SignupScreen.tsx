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
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";

import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import EmailField from "@/features/auth/components/EmailField";
import PasswordField from "@/features/auth/components/PasswordField";
import FullNameField from "@/features/auth/components/FullNameField";
import AuthButton from "@/features/auth/components/AuthButton";
import LinkText from "@/features/auth/components/LinkText";

import {
  validateEmail,
  validatePassword,
  validateFullName,
} from "@/utils/validation";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  CreateOrganization: undefined;
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

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { register, loading, error } = useAuth();

  // In your SignupScreen.tsx file, add this improved error handling:

  const handleSignup = async () => {
    // Your existing validation code...
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

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      await register(email, password, fullName);

      // Navigate to the CreateOrganization screen
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
