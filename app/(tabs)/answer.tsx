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
  const { data } = useSourcesQuery();
  const { answerStatus, lastResult, lastError } = useAnalysisStore();
  const sources = data ?? [];
  const showEmpty = answerStatus === "idle" || (answerStatus === "done" && !lastResult);

  return (
    <Screen>
      <SectionTitle
        title="답변 상세"
        subtitle="최종 답변과 근거 데이터, 리스크 안내, 다음 행동까지 한 화면에서 확인합니다."
      />

      {answerStatus === "loading" ? <LoadingBlock label="답변 생성 중..." /> : null}

      {answerStatus === "error" ? (
        <ErrorBlock
          message={lastError ?? "답변 생성 중 오류가 발생했습니다."}
          onRetry={() => {
            router.push("/analysis");
          }}
        />
      ) : null}

      {showEmpty ? (
        <EmptyBlock
          title="아직 생성된 답변이 없습니다"
          description="분석 탭에서 질문을 선택해 교차 분석을 실행해주세요."
          action={<ActionButton label="분석하러 가기" onPress={() => router.push("/analysis")} />}
        />
      ) : null}

      {answerStatus === "done" && lastResult ? (
        <>
          <AnswerBubble result={lastResult} />
          <UsedSourceBadges sourceIds={lastResult.usedSources} sources={sources} />

          <View style={styles.nextActionCard}>
            <Text style={styles.nextActionTitle}>다음 행동 제안</Text>
            {lastResult.nextActions.map((action) => (
              <Text key={action} style={styles.nextActionItem}>
                • {action}
              </Text>
            ))}
          </View>

          <GeneralVsDeundeunCard />
          <KeyPointList />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
