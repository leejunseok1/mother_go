import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme/tokens";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ opacity: focused ? 1 : 0.6, fontSize: 16 }} accessibilityElementsHidden>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: "#0B0F1A",
          borderTopColor: "rgba(255,255,255,0.12)",
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
      initialRouteName="onboarding"
    >
      <Tabs.Screen
        name="onboarding"
        options={{
          title: "연결",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔗" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sources"
        options={{
          title: "소스",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧩" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "분석",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="answer"
        options={{
          title: "답변",
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "기록",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
