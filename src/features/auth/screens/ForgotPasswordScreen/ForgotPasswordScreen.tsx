// src/features/auth/screens/ForgotPasswordScreen/ForgotPasswordScreen.tsx
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
import { ForgotPasswordScreenNavigationProp } from "@/types/navigation";

import BackgroundGrid from "@/features/auth/components/BackgroundGrid";
import EmailField from "@/features/auth/components/EmailField";
import AuthButton from "@/features/auth/components/AuthButton";
import LinkText from "@/features/auth/components/LinkText";
import AuthHeader from "@/features/auth/components/AuthHeader";
import ResetPasswordSuccess from "@/features/auth/components/ResetPasswordSuccess";

import { validateEmail } from "@/utils/validation";

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword, loading, error } = useAuth();

  const handleResetPassword = async () => {
    setEmailError("");

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (err) {
      Alert.alert(
        "Password Reset Failed",
        error || "An unexpected error occurred"
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  if (isEmailSent) {
    return (
      <BackgroundGrid>
        <View style={styles.container}>
          <View style={styles.content}>
            <ResetPasswordSuccess
              email={email}
              onBackToLogin={handleBackToLogin}
            />
          </View>
        </View>
      </BackgroundGrid>
    );
  }

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
              title="Reset Password"
              subtitle="Enter the email address associated with your account"
            />

            <EmailField
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              error={emailError}
            />

            <AuthButton
              title="Send Reset Link"
              onPress={handleResetPassword}
              isLoading={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
              <LinkText
                text="Login"
                onPress={handleBackToLogin}
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
    justifyContent: "center",
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

export default ForgotPasswordScreen;
