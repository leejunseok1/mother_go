import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AnalysisResult } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

interface AnswerBubbleProps {
  result: AnalysisResult;
}

export function AnswerBubble({ result }: AnswerBubbleProps) {
  return (
    <View style={styles.row}>
      <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.avatar}>
        <Text style={styles.avatarText}>든</Text>
      </LinearGradient>
      <View style={styles.bubble}>
        <Text style={styles.answerText}>{result.answer}</Text>
        <View style={styles.noticeBox}>
          <Text style={styles.noticeLabel}>리스크 안내</Text>
          <Text style={styles.noticeText}>{result.riskNotice}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },
  bubble: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  answerText: {
    color: colors.textPrimary,
    lineHeight: 24,
    fontSize: 15,
  },
  noticeBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    backgroundColor: "rgba(245,158,11,0.10)",
    padding: spacing.sm,
    gap: 4,
  },
  noticeLabel: {
    color: "#FBBF24",
    fontWeight: "700",
    fontSize: 12,
  },
  noticeText: {
    color: "#FCD34D",
    fontSize: 12,
    lineHeight: 18,
  },
});
