import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/common/Screen";
import { ActionButton } from "@/components/common/ActionButton";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataConnectStatusCard } from "@/components/source/DataConnectStatusCard";
import { useSourcesQuery } from "@/services/queries";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export default function OnboardingScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();

  useEffect(() => {
    if (isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [isError]);

  const sourceCount = data?.length ?? 0;
  const connectedCount = useMemo(
    () => (data ?? []).filter((item) => item.status === "connected").length,
    [data],
  );

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>DATA ARCHITECTURE</Text>
        <Text style={styles.title}>How Deundeun AI builds an answer</Text>
        <Text style={styles.desc}>
          Instead of relying on one signal, the system cross-checks six source domains and explains the reasoning path step by step.
        </Text>
      </View>

      <View style={styles.metricRow}>
        <MetricCard label="Sources" value={`${sourceCount}`} helper="Available now" />
        <MetricCard label="Connected" value={`${connectedCount}`} helper="Live links" />
      </View>

      <SectionTitle
        title="Onboarding / Source Readiness"
        subtitle="Start with connected + simulated sources, verify details, then move to cross-analysis."
      />

      {isLoading ? <LoadingBlock label="Checking source readiness..." /> : null}

      {isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "Failed to fetch readiness status."}
          onRetry={() => {
            refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyBlock
          title="No source connections available"
          description="Connect at least one source to begin cross-analysis."
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? <DataConnectStatusCard sources={data} /> : null}

      <View style={styles.flowCard}>
        <Text style={styles.flowTitle}>Suggested flow</Text>
        <Text style={styles.flowItem}>1. Review source detail cards</Text>
        <Text style={styles.flowItem}>2. Run analysis scenario</Text>
        <Text style={styles.flowItem}>3. Validate answer and history</Text>
      </View>

      <View style={styles.buttonRow}>
        <ActionButton label="Open Source Hub" onPress={() => router.push("/sources")} />
        <ActionButton label="Start Analysis" onPress={() => router.push("/analysis")} />
      </View>
    </Screen>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHelper}>{helper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.sm,
    gap: 8,
  },
  kicker: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.4,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: typography.hero,
    lineHeight: 38,
  },
  desc: {
    color: colors.textMuted,
    lineHeight: 22,
    fontSize: 14,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: spacing.md,
    gap: 3,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  metricHelper: {
    color: colors.textMuted,
    fontSize: 11,
  },
  flowCard: {
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.3)",
    borderRadius: radius.md,
    backgroundColor: "rgba(74,222,128,0.08)",
    padding: spacing.md,
    gap: 4,
  },
  flowTitle: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },
  flowItem: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  buttonRow: {
    gap: spacing.sm,
  },
});