import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
        subtitle="Review the final answer, risk notice, and evidence before taking your next step."
      />

      {answerStatus === "loading" ? <LoadingBlock label="Generating answer..." /> : null}

      {answerStatus === "error" ? (
        <>
          <ErrorBlock
            message={lastError ?? "An error occurred while generating the answer."}
            onRetry={() => {
              router.push("/analysis");
            }}
          />

          <View style={styles.followUpCard}>
            <Text style={styles.followUpTitle}>Recovery actions</Text>
            <ActionButton label="Back To Analysis" onPress={() => router.push("/analysis")} />
            <Pressable onPress={() => router.push("/history")} style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Open History Instead</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {showEmpty ? (
        <EmptyBlock
          title="No answer has been generated yet"
          description="Run an analysis scenario first. The final answer appears here once streaming is complete."
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

          <View style={styles.followUpCard}>
            <Text style={styles.followUpTitle}>What do you want to do next?</Text>
            <Text style={styles.followUpDesc}>
              Retry analysis after reviewing this answer, or jump to your history to compare previous decisions.
            </Text>
            <ActionButton label="Retry Analysis" onPress={() => router.push("/analysis")} />
            <View style={styles.linkRow}>
              <Pressable onPress={() => router.push("/analysis")} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Back To Analysis</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/history")} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Open History</Text>
              </Pressable>
            </View>
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
  followUpCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.32)",
    backgroundColor: "rgba(59,130,246,0.1)",
    padding: spacing.md,
    gap: spacing.sm,
  },
  followUpTitle: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "800",
  },
  followUpDesc: {
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  linkRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  linkButton: {
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.45)",
    backgroundColor: "rgba(59,130,246,0.18)",
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkButtonText: {
    color: "#DBEAFE",
    fontSize: 12,
    fontWeight: "700",
  },
});

