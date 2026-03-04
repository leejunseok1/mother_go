import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/common/Screen";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataSourceGrid } from "@/components/source/DataSourceGrid";
import { SourceDetailBottomSheet } from "@/components/source/SourceDetailBottomSheet";
import { useSourcesQuery } from "@/services/queries";
import { DataSource, DataSourceId } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

export default function SourcesScreen() {
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();
  const [activeSourceId, setActiveSourceId] = useState<DataSourceId | null>(null);
  const [sheetSource, setSheetSource] = useState<DataSource | null>(null);

  useEffect(() => {
    if (isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [isError]);

  const sources = data ?? [];
  const stats = useMemo(
    () => ({
      total: sources.length,
      connected: sources.filter((source) => source.status === "connected").length,
      simulated: sources.filter((source) => source.status === "simulated").length,
      errors: sources.filter((source) => source.status === "error").length,
    }),
    [sources],
  );

  return (
    <Screen>
      <SectionTitle
        title="Data Source Hub"
        subtitle="Open each source card to inspect fields, connection quality, and example records before running cross-analysis."
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Connection Snapshot</Text>
        <View style={styles.statRow}>
          <StatChip label="Total" value={stats.total} tone="neutral" />
          <StatChip label="Connected" value={stats.connected} tone="good" />
          <StatChip label="Simulated" value={stats.simulated} tone="neutral" />
          <StatChip label="Errors" value={stats.errors} tone="bad" />
        </View>
        <Text style={styles.infoDesc}>
          Tip: Check stale/error sources first, then run analysis with the highest quality mix.
        </Text>
      </View>

      {isLoading ? <LoadingBlock label="Loading data sources..." /> : null}

      {isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "Failed to fetch source data."}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && sources.length === 0 ? (
        <EmptyBlock
          title="No available sources"
          description="Check your BFF response or mock data setup and retry."
        />
      ) : null}

      {!isLoading && !isError && sources.length > 0 ? (
        <DataSourceGrid
          sources={sources}
          activeSourceId={activeSourceId}
          onPressSource={(sourceId) => {
            setActiveSourceId((prev) => (prev === sourceId ? null : sourceId));
            const found = sources.find((source) => source.id === sourceId) ?? null;
            setSheetSource(found);
          }}
        />
      ) : null}

      <SourceDetailBottomSheet
        visible={sheetSource !== null}
        source={sheetSource}
        onClose={() => setSheetSource(null)}
      />
    </Screen>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "neutral" | "bad";
}) {
  const palette = {
    good: {
      bg: "rgba(74,222,128,0.15)",
      border: "rgba(74,222,128,0.42)",
      text: "#86EFAC",
    },
    neutral: {
      bg: "rgba(148,163,184,0.16)",
      border: "rgba(148,163,184,0.4)",
      text: "#CBD5E1",
    },
    bad: {
      bg: "rgba(239,68,68,0.15)",
      border: "rgba(239,68,68,0.42)",
      text: "#FCA5A5",
    },
  }[tone];

  return (
    <View style={[styles.chip, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={[styles.chipText, { color: palette.text }]}>
        {label}: {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  infoTitle: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  infoDesc: {
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "700",
  },
});