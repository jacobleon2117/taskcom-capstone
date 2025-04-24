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
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";
import NotificationButton from "@/components/ui/NotificationButton";
import { useAuth } from "@/features/auth/context/AuthContext";

// Type definitions
interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
}

interface Shift {
  id: string;
  date: number;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MemberScheduleScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      // Mock shift data for demonstration
      const mockShifts: Shift[] = [
        {
          id: "1",
          date: new Date().getDate(),
          title: "Morning Patrol",
          startTime: "08:00 AM",
          endTime: "12:00 PM",
          location: "Downtown Area",
        },
      ];
      setShifts(mockShifts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

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

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "No new notifications");
  };

  const renderShiftItem = ({ item }: { item: Shift }) => (
    <TouchableOpacity
      style={styles.shiftItem}
      onPress={() =>
        Alert.alert("Shift Details", `${item.title} at ${item.location}`)
      }
    >
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

  const EmptyShifts = () => (
    <View style={styles.emptyShifts}>
      <FontAwesome name="calendar-o" size={50} color="#333" />
      <Text style={styles.emptyText}>No shifts scheduled</Text>
      <Text style={styles.emptySubtext}>
        Your upcoming shifts will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          title="Schedule"
          showBackButton={false}
          rightComponent={
            <NotificationButton onPress={handleNotificationPress} />
          }
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
        <Text style={styles.shiftsTitle}>Upcoming Shifts</Text>

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
  },
});

export default MemberScheduleScreen;
