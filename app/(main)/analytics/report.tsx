import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Portal, Modal, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { analyticsExportService } from "../../../src/services/analyticsExportService";
import { AnalyticsReport } from "../../../src/components/analytics/AnalyticsReport";
import * as Sharing from "expo-sharing";

export default function ReportScreen() {
  const { timeRange } = useLocalSearchParams<{
    timeRange: "week" | "month" | "year";
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadReport();
  }, [timeRange]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsExportService.generateReport(timeRange);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await analyticsExportService.exportToCSV(timeRange);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      // Implementation for sharing report
    }
  };

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => router.back()}
        contentContainerStyle={styles.modalContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <AnalyticsReport
            data={reportData}
            onExport={handleExport}
            onShare={handleShare}
          />
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    padding: 16,
    maxHeight: "90%",
  },
});
