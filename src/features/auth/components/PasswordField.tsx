import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have expo/vector-icons installed

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "Password",
  value,
  onChangeText,
  error,
  placeholder = "Enter your password",
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="oneTimeCode" // This prevents iOS from suggesting passwords
        />

        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.iconContainer}
        >
          <Ionicons
            name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="rgba(0, 0, 0, 0.7)"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
  },
  input: {
    flex: 1,
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
  iconContainer: {
    padding: 10,
  },
});

export default PasswordField;
