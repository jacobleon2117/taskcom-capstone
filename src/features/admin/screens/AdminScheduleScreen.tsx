import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";
import { useAuth } from "@/features/auth/context/AuthContext";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AdminScheduleScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState("");
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [newShiftTitle, setNewShiftTitle] = useState("");
  const [newShiftStartTime, setNewShiftStartTime] = useState("");
  const [newShiftEndTime, setNewShiftEndTime] = useState("");
  const [newShiftLocation, setNewShiftLocation] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Empty team members array - would be populated from Firebase
  const TEAM_MEMBERS = [];

  useEffect(() => {
    setCurrentMonth(
      selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    );

    generateCalendarDays(selectedDate);
    setSelectedDay(new Date().getDate());

    // Simulate loading shifts
    const timer = setTimeout(() => {
      setShifts([]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: prevMonthLastDate - firstDay + i + 1,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
    setCurrentMonth(
      newDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
    generateCalendarDays(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
    setCurrentMonth(
      newDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
    generateCalendarDays(newDate);
  };

  const isToday = (day, isCurrentMonth) => {
    const today = new Date();
    return (
      isCurrentMonth &&
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const handleNotificationPress = () => {
    // Handle notification press
  };

  const handleAddShift = () => {
    // Reset form values
    setNewShiftTitle("");
    setNewShiftStartTime("");
    setNewShiftEndTime("");
    setNewShiftLocation("");
    setSelectedTeamMembers([]);

    // Show modal
    setShowAddShiftModal(true);
  };

  const handleSelectTeamMembers = () => {
    setShowTeamModal(true);
  };

  const handleCreateShift = () => {
    // Validate form fields
    if (
      !newShiftTitle ||
      !newShiftStartTime ||
      !newShiftEndTime ||
      !newShiftLocation
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (selectedTeamMembers.length === 0) {
      Alert.alert("Error", "Please select at least one team member");
      return;
    }

    // Create shift (would save to Firebase)
    Alert.alert("Success", "Shift created successfully");
    setShowAddShiftModal(false);
  };

  const AddShiftButton = () => (
    <TouchableOpacity style={styles.addButton} onPress={handleAddShift}>
      <Ionicons name="add-circle" size={24} color="#F09737" />
    </TouchableOpacity>
  );

  const renderShiftItem = ({ item }) => (
    <TouchableOpacity style={styles.shiftItem}>
      <View style={styles.shiftDateContainer}>
        <Text style={styles.shiftDate}>{item.date}</Text>
      </View>
      <View style={styles.shiftDetails}>
        <Text style={styles.shiftTitle}>{item.title}</Text>
        <Text style={styles.shiftTime}>
          {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.shiftLocation}>{item.location}</Text>
      </View>
      <View style={styles.adminActions}>
        <TouchableOpacity style={styles.adminAction}>
          <Ionicons name="create-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.adminAction}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyShifts = () => (
    <View style={styles.emptyShifts}>
      <FontAwesome name="calendar-o" size={50} color="#333" />
      <Text style={styles.emptyText}>No shifts scheduled</Text>
      <Text style={styles.emptySubtext}>
        Create shifts and assign them to your team members
      </Text>
      <TouchableOpacity
        style={styles.createShiftButton}
        onPress={handleAddShift}
      >
        <Text style={styles.createShiftText}>Create Shift</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title="Schedule"
          showBackButton={false}
          rightComponent={<AddShiftButton />}
        />
      </SafeAreaView>

      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysOfWeek}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Text key={index} style={styles.dayOfWeekText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !day.isCurrentMonth && styles.adjacentMonthDay,
                isToday(day.date, day.isCurrentMonth) && styles.todayCell,
                selectedDay === day.date &&
                  day.isCurrentMonth &&
                  styles.selectedDayCell,
              ]}
              onPress={() => day.isCurrentMonth && setSelectedDay(day.date)}
              disabled={!day.isCurrentMonth}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.adjacentMonthDayText,
                  isToday(day.date, day.isCurrentMonth) && styles.todayText,
                  selectedDay === day.date &&
                    day.isCurrentMonth &&
                    styles.selectedDayText,
                ]}
              >
                {day.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.shiftsContainer}>
        <Text style={styles.shiftsTitle}>Scheduled Shifts</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F09737" />
          </View>
        ) : shifts.length > 0 ? (
          <FlatList
            data={shifts}
            renderItem={renderShiftItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.shiftsList}
          />
        ) : (
          <EmptyShifts />
        )}
      </View>

      {/* Add Shift Modal */}
      <Modal
        visible={showAddShiftModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddShiftModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Shift</Text>
              <TouchableOpacity onPress={() => setShowAddShiftModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shift Title</Text>
              <TextInput
                style={styles.input}
                value={newShiftTitle}
                onChangeText={setNewShiftTitle}
                placeholder="Enter shift title"
                placeholderTextColor="#777"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={newShiftStartTime}
                  onChangeText={setNewShiftStartTime}
                  placeholder="09:00 AM"
                  placeholderTextColor="#777"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={newShiftEndTime}
                  onChangeText={setNewShiftEndTime}
                  placeholder="05:00 PM"
                  placeholderTextColor="#777"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={newShiftLocation}
                onChangeText={setNewShiftLocation}
                placeholder="Enter location"
                placeholderTextColor="#777"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Team Members</Text>
              <TouchableOpacity
                style={styles.teamSelectButton}
                onPress={handleSelectTeamMembers}
              >
                <Text style={styles.teamSelectText}>
                  {selectedTeamMembers.length > 0
                    ? `${selectedTeamMembers.length} members selected`
                    : "Select team members"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#F09737" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateShift}
            >
              <Text style={styles.createButtonText}>Create Shift</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Team Members Selection Modal */}
      <Modal
        visible={showTeamModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTeamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team Members</Text>
              <TouchableOpacity onPress={() => setShowTeamModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {TEAM_MEMBERS.length > 0 ? (
              <FlatList
                data={TEAM_MEMBERS}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.teamMemberItem,
                      selectedTeamMembers.includes(item.id) &&
                        styles.selectedTeamMember,
                    ]}
                    onPress={() => {
                      if (selectedTeamMembers.includes(item.id)) {
                        setSelectedTeamMembers(
                          selectedTeamMembers.filter((id) => id !== item.id)
                        );
                      } else {
                        setSelectedTeamMembers([
                          ...selectedTeamMembers,
                          item.id,
                        ]);
                      }
                    }}
                  >
                    <View style={styles.teamMemberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberInitial}>
                          {item.name.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.memberName}>{item.name}</Text>
                    </View>
                    {selectedTeamMembers.includes(item.id) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#F09737"
                      />
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={styles.teamMembersList}
              />
            ) : (
              <View style={styles.emptyTeamContainer}>
                <Text style={styles.emptyTeamText}>
                  No team members available
                </Text>
                <Text style={styles.emptyTeamSubtext}>
                  Add team members in the Team Management screen
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowTeamModal(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm Selection</Text>
            </TouchableOpacity>
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
  calendarContainer: {
    backgroundColor: "#111",
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  daysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayOfWeekText: {
    color: "#aaa",
    textAlign: "center",
    width: "14.28%",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  adjacentMonthDay: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#F09737",
    borderRadius: 20,
  },
  selectedDayCell: {
    backgroundColor: "#F09737",
    borderRadius: 20,
  },
  dayText: {
    color: "#fff",
  },
  adjacentMonthDayText: {
    color: "#555",
  },
  todayText: {
    color: "#F09737",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#000",
    fontWeight: "bold",
  },
  shiftsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  shiftsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shiftsList: {
    paddingBottom: 100,
  },
  shiftItem: {
    backgroundColor: "#111",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  shiftDateContainer: {
    backgroundColor: "#F09737",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  shiftDate: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  shiftDetails: {
    padding: 12,
    paddingRight: 50,
  },
  shiftTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  shiftTime: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
  },
  shiftLocation: {
    color: "#999",
    fontSize: 12,
  },
  adminActions: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -12,
    flexDirection: "row",
  },
  adminAction: {
    marginHorizontal: 4,
  },
  emptyShifts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    color: "#444",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  createShiftButton: {
    backgroundColor: "#F09737",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createShiftText: {
    color: "#000",
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
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
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "white",
  },
  teamSelectButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamSelectText: {
    color: "#ddd",
  },
  createButton: {
    backgroundColor: "#F09737",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  teamMembersList: {
    maxHeight: 300,
  },
  teamMemberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  selectedTeamMember: {
    backgroundColor: "rgba(240, 151, 55, 0.1)",
  },
  teamMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F09737",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  memberName: {
    color: "#fff",
    fontSize: 14,
  },
  emptyTeamContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyTeamText: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  emptyTeamSubtext: {
    color: "#777",
    textAlign: "center",
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: "#F09737",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  confirmButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AdminScheduleScreen;
