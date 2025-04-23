import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/features/auth/context/AuthContext";
import { getMissionReportsForUser } from "@/services/firebase/missionService";

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

const MissionReportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [missionReports, setMissionReports] = useState<MissionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const filters = ["All", "Recent", "Completed", "Ongoing"];

  useEffect(() => {
    const fetchMissionReports = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          // This would be replaced with an actual API call to fetch mission reports
          // const reports = await getMissionReportsForUser(user.uid);
          // setMissionReports(reports);

          // For now, just set empty reports
          setMissionReports([]);
        } catch (error) {
          console.error("Error fetching mission reports:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMissionReports();
  }, [user]);

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

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="file-text-o" size={60} color="#333" />
      <Text style={styles.emptyText}>No mission reports yet</Text>
      <Text style={styles.emptySubtext}>
        Reports will appear here after missions are completed
      </Text>
    </View>
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F09737" />
        </View>
      ) : missionReports.length > 0 ? (
        <FlatList
          data={missionReports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reportsList}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};
