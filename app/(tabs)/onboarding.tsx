import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/common/Screen";
import { ActionButton } from "@/components/common/ActionButton";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataConnectStatusCard } from "@/components/source/DataConnectStatusCard";
import { useSourcesQuery } from "@/services/queries";
import { colors, spacing, typography } from "@/theme/tokens";

export default function OnboardingScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();

  useEffect(() => {
    if (isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [isError]);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>DATA ARCHITECTURE</Text>
        <Text style={styles.title}>든든 AI는 어떻게 답변하는가</Text>
        <Text style={styles.desc}>
          단일 데이터가 아닌 6개 데이터를 교차 분석해서 답변합니다. 이게 일반 AI와 든든의 핵심 차이입니다.
        </Text>
      </View>

      <SectionTitle
        title="온보딩 / 연결 상태"
        subtitle="실연동 2개(transaction, market) + 시뮬레이션 4개로 MVP를 실행합니다."
      />

      {isLoading ? <LoadingBlock label="연결 상태를 불러오는 중..." /> : null}

      {isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "연결 상태 조회에 실패했습니다."}
          onRetry={() => {
            refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyBlock
          title="연결된 데이터가 없습니다"
          description="최소 1개 데이터 소스를 연결하면 교차 분석을 시작할 수 있습니다."
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? <DataConnectStatusCard sources={data} /> : null}

      <View style={styles.buttonRow}>
        <ActionButton label="데이터 소스 보기" onPress={() => router.push("/sources")} />
        <ActionButton label="교차분석 시작" onPress={() => router.push("/analysis")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.sm,
    gap: 8,
  },
  kicker: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.4,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: typography.hero,
    lineHeight: 38,
  },
  desc: {
    color: colors.textMuted,
    lineHeight: 22,
    fontSize: 14,
  },
  buttonRow: {
    gap: spacing.sm,
  },
});
