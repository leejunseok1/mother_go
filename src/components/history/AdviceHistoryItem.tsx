import { StyleSheet, Text, View } from "react-native";
import { DataSource, HistoryItem } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";
import { ConfidenceBadge } from "@/components/history/ConfidenceBadge";

interface AdviceHistoryItemProps {
  item: HistoryItem;
  sources: DataSource[];
}

export function AdviceHistoryItem({ item, sources }: AdviceHistoryItemProps) {
  const date = new Date(item.askedAt).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.question}>{item.question}</Text>
        <ConfidenceBadge confidence={item.confidence} />
      </View>
      <Text style={styles.preview}>{item.answerPreview}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>권장: {item.recommendedAction}</Text>
        <Text style={styles.meta}>{date}</Text>
      </View>
      <View style={styles.badges}>
        {item.usedSources.map((sourceId) => {
          const source = sources.find((s) => s.id === sourceId);
          if (!source) {
            return null;
          }
          return (
            <Text key={`${item.id}-${source.id}`} style={styles.sourceBadge}>
              {source.icon} {source.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  question: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  sourceBadge: {
    color: colors.textSecondary,
    fontSize: 11,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
