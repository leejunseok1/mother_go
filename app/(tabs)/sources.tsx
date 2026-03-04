import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/common/Screen";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataSourceGrid } from "@/components/source/DataSourceGrid";
import { SourceDetailBottomSheet } from "@/components/source/SourceDetailBottomSheet";
import { useSourcesQuery } from "@/services/queries";
import { DataSource, DataSourceId, SourceStatus } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

type SourceFilter = "all" | SourceStatus;

export default function SourcesScreen() {
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();
  const [activeSourceId, setActiveSourceId] = useState<DataSourceId | null>(null);
  const [sheetSource, setSheetSource] = useState<DataSource | null>(null);
  const [filter, setFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    if (!isError) {
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  }, [isError]);

  const sources = data ?? [];
  const stats = useMemo(
    () => ({
      total: sources.length,
      connected: sources.filter((source) => source.status === "connected").length,
      stale: sources.filter((source) => source.status === "stale").length,
      simulated: sources.filter((source) => source.status === "simulated").length,
      errors: sources.filter((source) => source.status === "error").length,
    }),
    [sources],
  );

  const filteredSources = useMemo(() => {
    if (filter === "all") {
      return sources;
    }
    return sources.filter((source) => source.status === filter);
  }, [filter, sources]);

  useEffect(() => {
    if (activeSourceId && !filteredSources.some((source) => source.id === activeSourceId)) {
      setActiveSourceId(null);
    }
    if (sheetSource && !filteredSources.some((source) => source.id === sheetSource.id)) {
      setSheetSource(null);
    }
  }, [activeSourceId, filteredSources, sheetSource]);

  return (
    <Screen>
      <SectionTitle
        title="Data Source Hub"
        subtitle="Use status filters to isolate risky inputs before running cross-analysis."
      />

      <View style={styles.accessibilityNote}>
        <Text style={styles.accessibilityNoteText}>
          Accessibility: source cards announce status and mode, then whether details are expanded.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Connection Snapshot</Text>
        <View style={styles.statRow}>
          <StatChip label="Total" value={stats.total} tone="neutral" />
          <StatChip label="Connected" value={stats.connected} tone="good" />
          <StatChip label="Stale" value={stats.stale} tone="warn" />
          <StatChip label="Simulated" value={stats.simulated} tone="neutral" />
          <StatChip label="Errors" value={stats.errors} tone="bad" />
        </View>
        <Text style={styles.infoDesc}>
          Tip: Start with error and stale filters, then switch to connected to validate production-ready sources.
        </Text>
      </View>

      {sources.length > 0 ? (
        <View style={styles.filterRow}>
          <FilterChip label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterChip label="Connected" active={filter === "connected"} onPress={() => setFilter("connected")} />
          <FilterChip label="Stale" active={filter === "stale"} onPress={() => setFilter("stale")} />
          <FilterChip label="Simulated" active={filter === "simulated"} onPress={() => setFilter("simulated")} />
          <FilterChip label="Error" active={filter === "error"} onPress={() => setFilter("error")} />
        </View>
      ) : null}

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

      {!isLoading && !isError && sources.length > 0 && filteredSources.length === 0 ? (
        <EmptyBlock
          title="No sources in this filter"
          description="Choose another status filter to view source cards."
        />
      ) : null}

      {!isLoading && !isError && filteredSources.length > 0 ? (
        <DataSourceGrid
          sources={filteredSources}
          activeSourceId={activeSourceId}
          onPressSource={(sourceId) => {
            setActiveSourceId((prev) => (prev === sourceId ? null : sourceId));
            const found = filteredSources.find((source) => source.id === sourceId) ?? null;
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
      accessibilityRole="button"
      accessibilityLabel={`${label} source filter`}
      accessibilityHint="Double tap to apply this source status filter."
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.filterChip, active ? styles.filterChipActive : undefined]}
    >
      <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : undefined]}>{label}</Text>
    </Pressable>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "neutral" | "warn" | "bad";
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
    warn: {
      bg: "rgba(245,158,11,0.16)",
      border: "rgba(245,158,11,0.42)",
      text: "#FCD34D",
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
  accessibilityNote: {
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.35)",
    borderRadius: radius.md,
    backgroundColor: "rgba(59,130,246,0.1)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  accessibilityNoteText: {
    color: "#BFDBFE",
    fontSize: 12,
    lineHeight: 18,
  },
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.34)",
    backgroundColor: "rgba(148,163,184,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    borderColor: "rgba(74,222,128,0.42)",
    backgroundColor: "rgba(74,222,128,0.14)",
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: colors.success,
  },
});

