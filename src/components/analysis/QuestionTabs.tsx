import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { CrossExample } from "@/types/domain";
import { colors, radius, spacing } from "@/theme/tokens";

interface QuestionTabsProps {
  examples: CrossExample[];
  activeIndex: number;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export function QuestionTabs({ examples, activeIndex, disabled = false, onSelect }: QuestionTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {examples.map((example, index) => {
        const active = index === activeIndex;
        return (
          <Pressable
            key={example.id}
            onPress={async () => {
              if (disabled) {
                return;
              }
              await Haptics.selectionAsync();
              onSelect(index);
            }}
            style={[
              styles.tab,
              active ? styles.activeTab : undefined,
              disabled ? styles.disabledTab : undefined,
            ]}
          >
            <Text style={styles.emoji}>{example.emoji}</Text>
            <Text style={[styles.label, active ? styles.activeLabel : undefined]}>{example.question}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  activeTab: {
    borderColor: "rgba(74,222,128,0.4)",
    backgroundColor: "rgba(30,90,63,0.6)",
  },
  disabledTab: {
    opacity: 0.65,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    color: colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
  },
  activeLabel: {
    color: colors.success,
  },
});
