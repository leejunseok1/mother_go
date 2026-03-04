import { StyleSheet, Text, View } from "react-native";
import { DataSource, HistoryItem } from "@/types/domain";
import { AdviceHistoryItem } from "@/components/history/AdviceHistoryItem";
import { colors } from "@/theme/tokens";

interface DecisionHistoryListProps {
  items: HistoryItem[];
  sources: DataSource[];
}

export function DecisionHistoryList({ items, sources }: DecisionHistoryListProps) {
  const sortedItems = [...items].sort(
    (left, right) => new Date(right.askedAt).getTime() - new Date(left.askedAt).getTime(),
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Recent decisions ({items.length})</Text>
      {sortedItems.map((item) => (
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
