import { StyleSheet, View } from "react-native";
import { DataSource, DataSourceId } from "@/types/domain";
import { DataSourceCard } from "@/components/source/DataSourceCard";

interface DataSourceGridProps {
  sources: DataSource[];
  activeSourceId: DataSourceId | null;
  usedSourceIds?: DataSourceId[];
  pulseSourceId?: DataSourceId | null;
  onPressSource: (sourceId: DataSourceId) => void;
}

export function DataSourceGrid({
  sources,
  activeSourceId,
  usedSourceIds = [],
  pulseSourceId = null,
  onPressSource,
}: DataSourceGridProps) {
  const rows: DataSource[][] = [];
  for (let i = 0; i < sources.length; i += 2) {
    rows.push(sources.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View style={styles.row} key={`row-${rowIndex}`}>
          {row.map((source) => (
            <DataSourceCard
              key={source.id}
              source={source}
              isActive={activeSourceId === source.id}
              isUsed={usedSourceIds.includes(source.id)}
              pulseEnabled={pulseSourceId === source.id}
              onPress={() => onPressSource(source.id)}
            />
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
});
