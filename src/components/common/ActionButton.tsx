import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing } from "@/theme/tokens";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function ActionButton({ label, onPress, style, disabled = false }: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={async () => {
        await Haptics.selectionAsync();
        onPress();
      }}
      style={style}
    >
      <LinearGradient
        colors={disabled ? [colors.textMuted, colors.textMuted] : ["#1E7D4A", "#2EB569"]}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
