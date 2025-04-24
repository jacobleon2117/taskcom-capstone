import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/features/auth/context/AuthContext";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const firstName = user?.displayName?.split(" ")[0] || "User";

  const handleNotificationPress = () => {
    setNotificationsVisible(true);
  };

  const WelcomeHeader = () => (
    <View style={styles.welcomeHeader}>
      <View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{firstName}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title=""
          showBackButton={false}
          rightComponent={
            <NotificationButton onPress={handleNotificationPress} />
          }
        />
        <WelcomeHeader />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.smallCard]}
            onPress={() => navigation.navigate("Messages")}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome
                  name="comments"
                  size={22}
                  color="white"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Recent Messages</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.largeCard]}
            onPress={() => navigation.navigate("Schedule")}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconTextRow}>
                <FontAwesome
                  name="clock-o"
                  size={22}
                  color="white"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Upcoming Shifts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
            <View style={styles.cardEmptySpace} />
          </TouchableOpacity>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="walk"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Distance</Text>
              <Text style={styles.actionButtonValue}>--</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="stairs"
                size={24}
                color="white"
                style={styles.actionButtonIcon}
              />
              <Text style={styles.actionButtonLabel}>Stairs</Text>
              <Text style={styles.actionButtonValue}>--</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    backgroundColor: "#000",
  },
  welcomeHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollContent: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    width: "100%",
  },
  smallCard: {
    height: 150,
    marginBottom: 24,
  },
  largeCard: {
    height: 250,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardEmptySpace: {
    flex: 1,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    width: "48%",
    aspectRatio: 1.2,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  actionButtonIcon: {
    marginBottom: 12,
  },
  actionButtonLabel: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtonValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 100,
  },
});

export default HomeScreen;
