import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

export function GeneralVsDeundeunCard() {
  return (
    <View style={styles.grid}>
      <View style={[styles.card, styles.generalCard]}>
        <Text style={styles.generalTitle}>❌ 일반 AI (ChatGPT 등)</Text>
        <Text style={styles.question}>“삼성전자 팔아야 해?”</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.generalQuote}>
            “투자 결정은 개인의 상황에 따라 다릅니다. 삼성전자는 반도체 업황에 따라...”
          </Text>
          <Text style={styles.generalHint}>→ 내 상황을 모르는 일반론</Text>
        </View>
      </View>

      <View style={[styles.card, styles.deundeunCard]}>
        <Text style={styles.deundeunTitle}>✅ 든든 AI</Text>
        <Text style={styles.question}>“삼성전자 팔아야 해?”</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.deundeunQuote}>
            “지금은 안 파시는 게 좋겠어요. +7.6%이고, 팔면{" "}
            <Text style={styles.warning}>건보료가 올라가요</Text>”
          </Text>
          <Text style={styles.deundeunHint}>→ 내 데이터 4개를 교차 분석한 맞춤 답변</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: 8,
  },
  generalCard: {
    backgroundColor: "rgba(239,68,68,0.07)",
    borderColor: "rgba(239,68,68,0.22)",
  },
  deundeunCard: {
    backgroundColor: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.22)",
  },
  generalTitle: {
    color: colors.danger,
    fontWeight: "800",
    fontSize: 12,
  },
  deundeunTitle: {
    color: colors.success,
    fontWeight: "800",
    fontSize: 12,
  },
  question: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  quoteBox: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: 8,
  },
  generalQuote: {
    color: colors.textSecondary,
    lineHeight: 18,
    fontSize: 13,
  },
  deundeunQuote: {
    color: colors.textPrimary,
    lineHeight: 18,
    fontSize: 13,
  },
  warning: {
    color: colors.warning,
    fontWeight: "800",
  },
  generalHint: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: "italic",
  },
  deundeunHint: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "700",
  },
});
