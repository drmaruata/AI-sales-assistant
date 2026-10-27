import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { useTheme } from '@/components/ui';
import { radius, shadows, spacing } from '@/theme';

const tabIcons: Record<string, IconName> = {
  index: 'home',
  leads: 'leads',
  pipeline: 'pipeline',
  'follow-ups': 'followups',
  more: 'more',
};

/** Hidden routes highlight the visible tab they belong to. */
const tabAliases: Record<string, string> = {
  'lead/[id]': 'leads',
  'draft-reply': 'leads',
  analytics: 'more',
  'ai-templates': 'more',
  team: 'more',
  integrations: 'more',
  subscription: 'more',
  help: 'more',
  settings: 'more',
};

function FloatingTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { colors: theme } = useTheme();
  const focusedName = state.routes[state.index]?.name;
  const activeName = tabAliases[focusedName] ?? focusedName;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          bottom: insets.bottom + spacing.sm,
          backgroundColor: theme.tabBar,
          borderColor: theme.border,
          boxShadow: shadows.tabBar,
        },
      ]}
    >
      {state.routes.map((route) => {
        const icon = tabIcons[route.name];
        if (!icon) return null;

        const { options } = descriptors[route.key];
        const label = typeof options.title === 'string' ? options.title : route.name;
        const focused = route.name === activeName;
        const color = focused ? theme.accent : theme.textSecondary;

        function onPress() {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (route.name !== focusedName && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
            style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name={icon} size={22} color={color} />
            <Text numberOfLines={1} style={[styles.label, { color }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="leads" options={{ title: 'Leads' }} />
      <Tabs.Screen name="pipeline" options={{ title: 'Pipeline' }} />
      <Tabs.Screen name="follow-ups" options={{ title: 'Follow-ups' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
      <Tabs.Screen name="lead/[id]" options={{ title: 'Lead' }} />
      <Tabs.Screen name="draft-reply" options={{ title: 'Draft reply' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Tabs.Screen name="ai-templates" options={{ title: 'AI templates' }} />
      <Tabs.Screen name="team" options={{ title: 'Team' }} />
      <Tabs.Screen name="integrations" options={{ title: 'Integrations' }} />
      <Tabs.Screen name="subscription" options={{ title: 'Subscription' }} />
      <Tabs.Screen name="help" options={{ title: 'Help' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    elevation: 12,
  },
  item: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0,
  },
});
