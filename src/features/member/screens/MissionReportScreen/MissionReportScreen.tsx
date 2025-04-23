import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";

// Define TypeScript interfaces
interface MissionMetrics {
  distanceCovered: string;
  duration: string;
  pinsDropped: number;
}

interface MissionReport {
  id: string;
  title: string;
  date: string;
  status: string;
  summary: string;
  metrics: MissionMetrics;
}

// Sample data
const MISSION_REPORTS: MissionReport[] = [
  {
    id: "1",
    title: "Downtown Search Operation",
    date: "Apr 18, 2025",
    status: "Completed",
    summary: "Successfully searched 4 blocks with 2 team members",
    metrics: {
      distanceCovered: "2.3 miles",
      duration: "3 hours",
      pinsDropped: 7,
    },
  },
  {
    id: "2",
    title: "River Patrol",
    date: "Apr 15, 2025",
    status: "Completed",
    summary: "Patrolled 3 miles of riverbank checking for flooding conditions",
    metrics: {
      distanceCovered: "3.1 miles",
      duration: "4 hours",
      pinsDropped: 5,
    },
  },
];

const MissionReportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Recent", "Completed", "Ongoing"];

  const renderReport = ({ item }: { item: MissionReport }) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "Completed"
              ? styles.completedBadge
              : styles.ongoingBadge,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.reportDate}>{item.date}</Text>
      <Text style={styles.reportSummary}>{item.summary}</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <FontAwesome name="map-marker" size={16} color="#F09737" />
          <Text style={styles.metricText}>{item.metrics.distanceCovered}</Text>
        </View>
        <View style={styles.metricItem}>
          <FontAwesome name="clock-o" size={16} color="#F09737" />
          <Text style={styles.metricText}>{item.metrics.duration}</Text>
        </View>
        <View style={styles.metricItem}>
          <FontAwesome name="map-pin" size={16} color="#F09737" />
          <Text style={styles.metricText}>{item.metrics.pinsDropped} pins</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#F09737" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Mission Reports" />
      </SafeAreaView>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {MISSION_REPORTS.length > 0 ? (
        <FlatList
          data={MISSION_REPORTS}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reportsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="file-text-o" size={60} color="#333" />
          <Text style={styles.emptyText}>No mission reports yet</Text>
          <Text style={styles.emptySubtext}>
            Reports will appear here after missions are completed
          </Text>
        </View>
      )}
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
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#111",
  },
  activeFilterButton: {
    backgroundColor: "#F09737",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  },
  activeFilterText: {
    color: "#000",
    fontWeight: "bold",
  },
  reportsList: {
    padding: 16,
    paddingBottom: 100, // Extra padding for the floating tab bar
  },
  reportCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: "#4BB543",
  },
  ongoingBadge: {
    backgroundColor: "#3498db",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  reportDate: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 8,
  },
  reportSummary: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricText: {
    color: "#bbb",
    fontSize: 12,
    marginLeft: 4,
  },
  viewDetailsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  viewDetailsText: {
    color: "#F09737",
    fontWeight: "bold",
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    marginTop: 10,
  },
  emptySubtext: {
    color: "#444",
    textAlign: "center",
    marginTop: 5,
  },
});

export default MissionReportScreen;
