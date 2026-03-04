import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/common/Screen";
import { ActionButton } from "@/components/common/ActionButton";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { AnswerBubble } from "@/components/answer/AnswerBubble";
import { UsedSourceBadges } from "@/components/answer/UsedSourceBadges";
import { GeneralVsDeundeunCard } from "@/components/answer/GeneralVsDeundeunCard";
import { KeyPointList } from "@/components/answer/KeyPointList";
import { useAnalysisStore } from "@/store/analysisStore";
import { useSourcesQuery } from "@/services/queries";
import { colors, radius, spacing } from "@/theme/tokens";

export default function AnswerScreen() {
  const router = useRouter();
  const { data, refetch, isFetching } = useSourcesQuery();
  const { answerStatus, lastResult, lastError } = useAnalysisStore();
  const sources = data ?? [];
  const showEmpty = answerStatus === "idle" || (answerStatus === "done" && !lastResult);

  return (
    <Screen>
      <SectionTitle
        title="Answer Detail"
        subtitle="Review the final answer, risk notice, evidence sources, and next actions in one place."
      />

      {answerStatus === "loading" ? <LoadingBlock label="Generating answer..." /> : null}

      {answerStatus === "error" ? (
        <ErrorBlock
          message={lastError ?? "An error occurred while generating the answer."}
          onRetry={() => {
            router.push("/analysis");
          }}
        />
      ) : null}

      {showEmpty ? (
        <EmptyBlock
          title="No answer has been generated yet"
          description="Run an analysis scenario first. The final answer will appear here as soon as the stream is complete."
          action={<ActionButton label="Go To Analysis" onPress={() => router.push("/analysis")} />}
        />
      ) : null}

      {answerStatus === "done" && lastResult ? (
        <>
          <AnswerBubble result={lastResult} />
          <UsedSourceBadges sourceIds={lastResult.usedSources} sources={sources} />

          <View style={styles.utilityRow}>
            <ActionButton
              label={isFetching ? "Refreshing sources..." : "Refresh Sources"}
              disabled={isFetching}
              onPress={() => {
                refetch();
              }}
            />
          </View>

          <View style={styles.nextActionCard}>
            <Text style={styles.nextActionTitle}>Recommended next actions</Text>
            {lastResult.nextActions.map((action) => (
              <Text key={action} style={styles.nextActionItem}>
                - {action}
              </Text>
            ))}
          </View>

          <GeneralVsDeundeunCard />
          <KeyPointList />

          <View style={styles.footerButtons}>
            <ActionButton label="Run Another Analysis" onPress={() => router.push("/analysis")} />
            <ActionButton label="Open History" onPress={() => router.push("/history")} />
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  utilityRow: {
    gap: spacing.sm,
  },
  nextActionCard: {
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.35)",
    backgroundColor: "rgba(74,222,128,0.08)",
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 8,
  },
  nextActionTitle: {
    color: colors.success,
    fontWeight: "800",
    fontSize: 13,
  },
  nextActionItem: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  footerButtons: {
    gap: spacing.sm,
  },
});
