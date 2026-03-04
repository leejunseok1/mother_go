import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

const ITEMS = [
  {
    num: "01",
    title: "단일 데이터로는 틀린 답변",
    desc: "주식 데이터만 보면 팔아도 되지만, 세금/건보료까지 보면 지금 매도는 손해일 수 있습니다.",
    color: "#3B82F6",
  },
  {
    num: "02",
    title: "상황을 아는 조언",
    desc: "은퇴 시점, 금융소득 누적, 퇴직금 운용 상태를 함께 보고 맥락화된 조언을 제공합니다.",
    color: "#8B5CF6",
  },
  {
    num: "03",
    title: "신뢰 근거 제시",
    desc: "과거 유사 상황의 조언 결과와 신뢰도를 함께 제시해 의사결정 근거를 명확히 합니다.",
    color: "#10B981",
  },
];

export function KeyPointList() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🔑 핵심: 왜 교차 분석이 중요한가</Text>
      {ITEMS.map((item) => (
        <View key={item.num} style={styles.row}>
          <View
            style={[
              styles.number,
              {
                borderColor: withAlpha(item.color, "55"),
                backgroundColor: withAlpha(item.color, "20"),
              },
            ]}
          >
            <Text style={[styles.numberText, { color: item.color }]}>{item.num}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  number: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  numberText: {
    fontWeight: "800",
    fontSize: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  itemDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
