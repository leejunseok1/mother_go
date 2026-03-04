import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/common/Screen";
import { EmptyBlock, ErrorBlock, LoadingBlock, SectionTitle } from "@/components/common/StateBlocks";
import { DataSourceGrid } from "@/components/source/DataSourceGrid";
import { SourceDetailBottomSheet } from "@/components/source/SourceDetailBottomSheet";
import { useSourcesQuery } from "@/services/queries";
import { DataSource, DataSourceId } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

export default function SourcesScreen() {
  const { data, isLoading, isError, error, refetch } = useSourcesQuery();
  const [activeSourceId, setActiveSourceId] = useState<DataSourceId | null>(null);
  const [sheetSource, setSheetSource] = useState<DataSource | null>(null);

  useEffect(() => {
    if (isError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  }, [isError]);

  const sources = data ?? [];
  const connectedCount = useMemo(
    () => sources.filter((source) => source.status === "connected").length,
    [sources],
  );

  return (
    <Screen>
      <SectionTitle
        title="데이터 소스 허브"
        subtitle="카드를 탭하면 세부 항목이 펼쳐집니다. 현재 연결 상태와 활용 가능 범위를 확인하세요."
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>현재 활성 소스</Text>
        <Text style={styles.infoDesc}>
          총 {sources.length}개 중 {connectedCount}개 실연동
        </Text>
      </View>

      {isLoading ? <LoadingBlock label="데이터 소스 불러오는 중..." /> : null}

      {isError ? (
        <ErrorBlock
          message={error instanceof Error ? error.message : "데이터 소스 조회 실패"}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && sources.length === 0 ? (
        <EmptyBlock
          title="표시할 데이터 소스가 없습니다"
          description="BFF 응답 또는 시뮬레이션 데이터를 확인해주세요."
        />
      ) : null}

      {!isLoading && !isError && sources.length > 0 ? (
        <DataSourceGrid
          sources={sources}
          activeSourceId={activeSourceId}
          onPressSource={(sourceId) => {
            setActiveSourceId((prev) => (prev === sourceId ? null : sourceId));
            const found = sources.find((source) => source.id === sourceId) ?? null;
            setSheetSource(found);
          }}
        />
      ) : null}

      <SourceDetailBottomSheet
        visible={sheetSource !== null}
        source={sheetSource}
        onClose={() => setSheetSource(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "rgba(16,185,129,0.10)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  infoTitle: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  infoDesc: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
