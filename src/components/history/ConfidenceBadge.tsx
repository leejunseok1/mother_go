import { StyleSheet, Text, View } from "react-native";
import { radius } from "@/theme/tokens";

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const tone = pct >= 80 ? "high" : pct >= 65 ? "mid" : "low";
  const toneMap = {
    high: {
      bg: "rgba(74,222,128,0.16)",
      border: "rgba(74,222,128,0.35)",
      text: "#86EFAC",
    },
    mid: {
      bg: "rgba(245,158,11,0.16)",
      border: "rgba(245,158,11,0.35)",
      text: "#FCD34D",
    },
    low: {
      bg: "rgba(239,68,68,0.16)",
      border: "rgba(239,68,68,0.35)",
      text: "#FCA5A5",
    },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneMap.bg, borderColor: toneMap.border }]}>
      <Text style={[styles.text, { color: toneMap.text }]}>Confidence {pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
  },
});