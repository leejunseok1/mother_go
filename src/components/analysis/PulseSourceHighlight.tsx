import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/tokens";

interface PulseSourceHighlightProps {
  label?: string;
}

export function PulseSourceHighlight({
  label = "점멸 중인 카드는 현재 AI가 참고하는 데이터입니다.",
}: PulseSourceHighlightProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.dot} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.success,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
