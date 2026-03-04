import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Screen } from "@/components/common/Screen";
import { ActionButton } from "@/components/common/ActionButton";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DecisionHistoryList } from "@/components/history/DecisionHistoryList";
import { useHistoryQuery, useSourcesQuery } from "@/services/queries";

export default function HistoryScreen() {
  const router = useRouter();
  const historyQuery = useHistoryQuery();
  const sourcesQuery = useSourcesQuery();

  useEffect(() => {
    if (historyQuery.isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [historyQuery.isError]);

  const history = historyQuery.data ?? [];
  const sources = sourcesQuery.data ?? [];

  return (
    <Screen>
      <SectionTitle
        title="기록 / 신뢰도"
        subtitle="과거 조언 이력, 사용된 데이터 소스, 신뢰도를 확인하고 다시 분석을 시작할 수 있습니다."
      />

      {historyQuery.isLoading || sourcesQuery.isLoading ? (
        <LoadingBlock label="기록 불러오는 중..." />
      ) : null}

      {historyQuery.isError ? (
        <ErrorBlock
          message={historyQuery.error instanceof Error ? historyQuery.error.message : "기록 조회 실패"}
          onRetry={() => historyQuery.refetch()}
        />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError && history.length === 0 ? (
        <EmptyBlock
          title="판단 기록이 없습니다"
          description="첫 질문을 분석하면 신뢰도 기록이 쌓입니다."
          action={<ActionButton label="첫 분석 시작" onPress={() => router.push("/analysis")} />}
        />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError && history.length > 0 ? (
        <DecisionHistoryList items={history} sources={sources} />
      ) : null}
    </Screen>
  );
}
