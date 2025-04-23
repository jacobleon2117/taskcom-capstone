// src/features/auth/screens/LoginScreen/LoginScreen.tsx
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
import { LoginScreenNavigationProp } from "@/types/navigation";

import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import EmailField from "@/features/auth/components/EmailField";
import PasswordField from "@/features/auth/components/PasswordField";
import AuthButton from "@/features/auth/components/AuthButton";
import LinkText from "@/features/auth/components/LinkText";
import AuthHeader from "@/features/auth/components/AuthHeader";

import { validateEmail, validatePassword } from "@/utils/validation";

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, error, loading } = useAuth();

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

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

    try {
      await login(email, password);
    } catch (err) {
      Alert.alert("Login Failed", error || "An unexpected error occurred");
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
            <AuthHeader />

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

            <View style={styles.forgotPasswordContainer}>
              <LinkText
                text="Forgot Password?"
                onPress={() => navigation.navigate("ForgotPassword")}
              />
            </View>

            <AuthButton
              title="Login"
              onPress={handleLogin}
              isLoading={loading}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <LinkText
                text="Sign Up"
                onPress={() => navigation.navigate("Signup")}
                style={styles.signupLinkText}
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginVertical: 12,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "white",
  },
  signupLinkText: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
