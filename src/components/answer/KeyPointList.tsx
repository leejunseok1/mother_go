import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

const ITEMS = [
  {
    num: "01",
    title: "Single-source answers are fragile",
    desc: "Stock-only logic can miss tax and premium effects. Cross-checking prevents misleading one-dimensional advice.",
    color: "#3B82F6",
  },
  {
    num: "02",
    title: "Context-aware guidance",
    desc: "Retirement horizon, current income mix, and account allocation shift the best action even for the same market view.",
    color: "#8B5CF6",
  },
  {
    num: "03",
    title: "Confidence with evidence",
    desc: "Recommendation quality increases when historical outcomes and source provenance are visible with the answer.",
    color: "#10B981",
  },
];

export function KeyPointList() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Why cross-analysis matters</Text>
      {ITEMS.map((item) => (
        <View key={item.num} style={styles.row}>
          <View
            style={[
              styles.number,
              {
                borderColor: withAlpha(item.color, "55"),
                backgroundColor: withAlpha(item.color, "20"),
              },
            ]}
          >
            <Text style={[styles.numberText, { color: item.color }]}>{item.num}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  number: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  numberText: {
    fontWeight: "800",
    fontSize: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  itemDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});