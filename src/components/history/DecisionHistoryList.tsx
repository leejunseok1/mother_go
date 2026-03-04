import { StyleSheet, Text, View } from "react-native";
import { DataSource, HistoryItem } from "@/types/domain";
import { AdviceHistoryItem } from "@/components/history/AdviceHistoryItem";
import { colors } from "@/theme/tokens";

interface DecisionHistoryListProps {
  items: HistoryItem[];
  sources: DataSource[];
}

export function DecisionHistoryList({ items, sources }: DecisionHistoryListProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Decision list ({items.length})</Text>
      {items.map((item) => (
        <AdviceHistoryItem key={item.id} item={item} sources={sources} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 14,
  },
});
