import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SHIFTS = [
  {
    id: "1",
    title: "Morning Shift",
    date: "Today",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    location: "Main Campus",
  },
  {
    id: "2",
    title: "Training Session",
    date: "Tomorrow",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    location: "Training Facility",
  },
  {
    id: "3",
    title: "Evening Patrol",
    date: "Wed, Apr 24",
    startTime: "06:00 PM",
    endTime: "10:00 PM",
    location: "East District",
  },
  {
    id: "4",
    title: "Team Meeting",
    date: "Fri, Apr 26",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    location: "Conference Room",
  },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState("");
  const [calendarDays, setCalendarDays] = useState<
    Array<{ date: number; isCurrentMonth: boolean }>
  >([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    setCurrentMonth(
      selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    );

    generateCalendarDays(selectedDate);

    setSelectedDay(new Date().getDate());
  }, []);

  const generateCalendarDays = (date: Date) => {
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

  const isToday = (day: number, isCurrentMonth: boolean) => {
    const today = new Date();
    return (
      isCurrentMonth &&
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

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
      <View style={styles.shiftActions}>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule</Text>
          <View style={styles.headerRight} />
        </View>
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
        <Text style={styles.shiftsTitle}>Upcoming Shifts</Text>
        <FlatList
          data={SHIFTS}
          renderItem={renderShiftItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shiftsList}
        />
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
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
  shiftActions: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: 6,
  },
});

export default ScheduleScreen;
