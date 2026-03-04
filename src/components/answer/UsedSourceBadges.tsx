import { StyleSheet, Text, View } from "react-native";
import { DataSource, DataSourceId } from "@/types/domain";
import { radius } from "@/theme/tokens";
import { withAlpha } from "@/lib/color";

interface UsedSourceBadgesProps {
  sourceIds: DataSourceId[];
  sources: DataSource[];
}

export function UsedSourceBadges({ sourceIds, sources }: UsedSourceBadgesProps) {
  return (
    <View style={styles.wrapper}>
      {sourceIds.map((sourceId) => {
        const source = sources.find((item) => item.id === sourceId);
        if (!source) {
          return null;
        }
        return (
          <View
            key={source.id}
            style={[
              styles.badge,
              {
                backgroundColor: withAlpha(source.color, "20"),
                borderColor: withAlpha(source.color, "44"),
              },
            ]}
          >
            <Text style={[styles.label, { color: source.color }]}>
              {source.icon} {source.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});
