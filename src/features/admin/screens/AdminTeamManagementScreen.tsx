import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";

// Type definitions
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  lastActive?: string;
  isAdmin?: boolean;
}

const TeamManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<string>("Field Agent");
  const [newMemberAdmin, setNewMemberAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use empty list with proper type
  const [TEAM_MEMBERS, setTeamMembers] = useState<TeamMember[]>([]);

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "No new notifications");
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      Alert.alert("Error", "Name and email are required");
      return;
    }

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      phone: newMemberPhone,
      role: newMemberRole,
      status: "active",
      isAdmin: newMemberAdmin,
      lastActive: new Date().toLocaleDateString(),
    };

    setTeamMembers((prevMembers) => [...prevMembers, newMember]);

    Alert.alert("Success", `Invitation sent to ${newMemberEmail}`);

    // Reset form
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPhone("");
    setNewMemberRole("Field Agent");
    setNewMemberAdmin(false);
    setAddMemberModalVisible(false);
  };

  const AddMemberButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => setAddMemberModalVisible(true)}
    >
      <Ionicons name="person-add" size={24} color="#F09737" />
    </TouchableOpacity>
  );

  const filteredMembers = TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }: { item: TeamMember }) => (
    <TouchableOpacity style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </Text>
        </View>

        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName}>{item.name}</Text>
            <View
              style={[
                styles.statusIndicator,
                item.status === "active"
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            />
          </View>
          <Text style={styles.memberRole}>{item.role}</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.memberDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={16} color="#aaa" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        {item.phone && (
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={16} color="#aaa" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        )}
        {item.lastActive && (
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#aaa" />
            <Text style={styles.detailText}>
              Last active: {item.lastActive}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={18} color="#F09737" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
          <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={60} color="#333" />
      <Text style={styles.emptyText}>No team members yet</Text>
      <Text style={styles.emptySubtext}>
        Add team members to start collaborating
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title="Team Management"
          rightComponent={<AddMemberButton />}
        />
      </SafeAreaView>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search team members..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {TEAM_MEMBERS.length > 0 ? (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.membersList}
        />
      ) : (
        <EmptyState />
      )}

      <Modal
        visible={addMemberModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddMemberModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddMemberModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Full Name*</Text>
              <TextInput
                style={styles.input}
                value={newMemberName}
                onChangeText={setNewMemberName}
                placeholder="Enter full name"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Email Address*</Text>
              <TextInput
                style={styles.input}
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                placeholder="Enter email address"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newMemberPhone}
                onChangeText={setNewMemberPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleSelector}>
                {["Team Lead", "Field Agent", "Support Staff"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      newMemberRole === role && styles.selectedRoleOption,
                    ]}
                    onPress={() => setNewMemberRole(role)}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        newMemberRole === role && styles.selectedRoleOptionText,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>Admin Privileges</Text>
                <Switch
                  value={newMemberAdmin}
                  onValueChange={setNewMemberAdmin}
                  trackColor={{ false: "#333", true: "#F09737" }}
                  thumbColor={newMemberAdmin ? "#fff" : "#f4f3f4"}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddMember}
              >
                <Text style={styles.submitButtonText}>Send Invitation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
    marginLeft: 8,
  },
  membersList: {
    padding: 16,
    paddingBottom: 100,
  },
  memberCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  memberHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F09737",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: "#4BB543",
  },
  inactiveStatus: {
    backgroundColor: "#aaa",
  },
  memberRole: {
    color: "#aaa",
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  memberDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    color: "#bbb",
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionButtonText: {
    color: "#F09737",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 4,
  },
  dangerButton: {
    marginLeft: 8,
  },
  dangerButtonText: {
    color: "#ff6b6b",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    paddingBottom: 16,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  roleSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#222",
  },
  selectedRoleOption: {
    backgroundColor: "#F09737",
  },
  roleOptionText: {
    color: "#fff",
    fontSize: 14,
  },
  selectedRoleOptionText: {
    color: "#000",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#F09737",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    padding: 8,
  },
});

export default TeamManagementScreen;
