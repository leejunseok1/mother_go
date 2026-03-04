import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/common/Screen";
import { ActionButton } from "@/components/common/ActionButton";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DecisionHistoryList } from "@/components/history/DecisionHistoryList";
import { useHistoryQuery, useSourcesQuery } from "@/services/queries";
import { colors, radius, spacing } from "@/theme/tokens";

export default function HistoryScreen() {
  const router = useRouter();
  const historyQuery = useHistoryQuery();
  const sourcesQuery = useSourcesQuery();

  useEffect(() => {
    if (historyQuery.isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [historyQuery.isError]);

  const history = historyQuery.data ?? [];
  const sources = sourcesQuery.data ?? [];

  return (
    <Screen>
      <SectionTitle
        title="History & Confidence"
        subtitle="Inspect previous recommendations, confidence levels, and which sources were used for each decision."
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Session summary</Text>
        <Text style={styles.summaryText}>History items: {history.length}</Text>
        <Text style={styles.summaryText}>Available sources: {sources.length}</Text>
      </View>

      {historyQuery.isLoading || sourcesQuery.isLoading ? <LoadingBlock label="Loading history..." /> : null}

      {historyQuery.isError ? (
        <ErrorBlock
          message={historyQuery.error instanceof Error ? historyQuery.error.message : "Failed to fetch history."}
          onRetry={() => historyQuery.refetch()}
        />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError && history.length === 0 ? (
        <EmptyBlock
          title="No decision history yet"
          description="Run your first analysis. Completed answers will be recorded here with confidence metrics."
          action={<ActionButton label="Start Analysis" onPress={() => router.push("/analysis")} />}
        />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError && history.length > 0 ? (
        <DecisionHistoryList items={history} sources={sources} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.28)",
    backgroundColor: "rgba(148,163,184,0.08)",
    padding: spacing.md,
    gap: 4,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});