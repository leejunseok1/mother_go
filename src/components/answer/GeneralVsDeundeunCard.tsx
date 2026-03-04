import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

export function GeneralVsDeundeunCard() {
  return (
    <View style={styles.grid}>
      <View style={[styles.card, styles.generalCard]}>
        <Text style={styles.generalTitle}>Generic AI output</Text>
        <Text style={styles.question}>"Should I sell this stock now?"</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.generalQuote}>
            "It depends on your risk profile and market conditions. Consider consulting a financial advisor."
          </Text>
          <Text style={styles.generalHint}>- broad guidance, low personal context</Text>
        </View>
      </View>

      <View style={[styles.card, styles.deundeunCard]}>
        <Text style={styles.deundeunTitle}>Deundeun AI output</Text>
        <Text style={styles.question}>"Should I sell this stock now?"</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.deundeunQuote}>
            "Hold for now. Your gain is positive, and selling today may increase your premium burden."
          </Text>
          <Text style={styles.deundeunHint}>- source-crossed, context-aware recommendation</Text>
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