import { useEffect, useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  const [filter, setFilter] = useState<"all" | "hold" | "adjust">("all");

  useEffect(() => {
    if (historyQuery.isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [historyQuery.isError]);

  const history = historyQuery.data ?? [];
  const sources = sourcesQuery.data ?? [];

  const filteredHistory = useMemo(() => {
    if (filter === "all") {
      return history;
    }

    return history.filter((item) => {
      const action = item.recommendedAction.toLowerCase();
      if (filter === "hold") {
        return action.includes("보유") || action.includes("hold");
      }
      return action.includes("조정") || action.includes("adjust");
    });
  }, [filter, history]);

  const confidenceSummary = useMemo(() => {
    if (history.length === 0) {
      return { avg: 0, high: 0 };
    }
    const total = history.reduce((sum, item) => sum + item.confidence, 0);
    const high = history.filter((item) => item.confidence >= 0.8).length;
    return { avg: Math.round((total / history.length) * 100), high };
  }, [history]);

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
        <Text style={styles.summaryText}>Avg confidence: {confidenceSummary.avg}%</Text>
        <Text style={styles.summaryText}>High confidence (80%+): {confidenceSummary.high}</Text>
      </View>

      {history.length > 0 ? (
        <View style={styles.filterRow}>
          <FilterChip label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterChip label="Hold" active={filter === "hold"} onPress={() => setFilter("hold")} />
          <FilterChip label="Adjust" active={filter === "adjust"} onPress={() => setFilter("adjust")} />
        </View>
      ) : null}

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
        <>
          {filteredHistory.length === 0 ? (
            <EmptyBlock
              title="No items in this filter"
              description="Try another recommendation filter or refresh history."
              action={
                <ActionButton
                  label="Refresh History"
                  onPress={() => {
                    historyQuery.refetch();
                    sourcesQuery.refetch();
                  }}
                />
              }
            />
          ) : (
            <DecisionHistoryList items={filteredHistory} sources={sources} />
          )}
        </>
      ) : null}
    </Screen>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        active ? styles.filterChipActive : undefined,
      ]}
    >
      <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : undefined]}>{label}</Text>
    </Pressable>
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
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
    backgroundColor: "rgba(148,163,184,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    borderColor: "rgba(74,222,128,0.45)",
    backgroundColor: "rgba(74,222,128,0.14)",
  },
  filterChipText: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 12,
  },
  filterChipTextActive: {
    color: colors.success,
  },
});
