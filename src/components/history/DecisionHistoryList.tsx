import { StyleSheet, View } from "react-native";
import { DataSource, HistoryItem } from "@/types/domain";
import { AdviceHistoryItem } from "@/components/history/AdviceHistoryItem";

interface DecisionHistoryListProps {
  items: HistoryItem[];
  sources: DataSource[];
}

export function DecisionHistoryList({ items, sources }: DecisionHistoryListProps) {
  return (
    <View style={styles.wrapper}>
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
});
