import { StyleSheet, Text, View } from "react-native";
import { DataSource } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

interface DataConnectStatusCardProps {
  sources: DataSource[];
}

export function DataConnectStatusCard({ sources }: DataConnectStatusCardProps) {
  const connected = sources.filter((s) => s.status === "connected").length;
  const simulated = sources.filter((s) => s.status === "simulated").length;
  const errored = sources.filter((s) => s.status === "error").length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>연결 상태 요약</Text>
      <Text style={styles.subtitle}>총 {sources.length}개 데이터 소스</Text>

      <View style={styles.row}>
        <StatusPill label="실연동" value={connected} tone="good" />
        <StatusPill label="시뮬" value={simulated} tone="neutral" />
        <StatusPill label="오류" value={errored} tone="bad" />
      </View>
    </View>
  );
}

function StatusPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "neutral" | "bad";
}) {
  const toneMap = {
    good: {
      bg: "rgba(74,222,128,0.15)",
      border: "rgba(74,222,128,0.4)",
      text: "#86EFAC",
    },
    neutral: {
      bg: "rgba(148,163,184,0.14)",
      border: "rgba(148,163,184,0.4)",
      text: "#CBD5E1",
    },
    bad: {
      bg: "rgba(239,68,68,0.15)",
      border: "rgba(239,68,68,0.4)",
      text: "#FCA5A5",
    },
  }[tone];

  return (
    <View style={[styles.pill, { backgroundColor: toneMap.bg, borderColor: toneMap.border }]}>
      <Text style={[styles.pillLabel, { color: toneMap.text }]}>
        {label} {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 18,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 4,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillLabel: {
    fontWeight: "700",
    fontSize: 12,
  },
});
