import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type IconName =
  | 'home'
  | 'leads'
  | 'pipeline'
  | 'followups'
  | 'more'
  | 'plus'
  | 'search'
  | 'back'
  | 'chevronRight'
  | 'person'
  | 'storefront'
  | 'document'
  | 'team'
  | 'integrations'
  | 'analytics'
  | 'subscription'
  | 'help'
  | 'trash'
  | 'check'
  | 'calendar'
  | 'note'
  | 'sparkles'
  | 'copy'
  | 'settings'
  | 'close';

/**
 * One icon name per meaning, mapped to a Material glyph. The font ships with
 * the app, so the same glyph renders on iOS, Android and web.
 */
const glyphs: Record<IconName, keyof typeof MaterialIcons.glyphMap> = {
  home: 'home',
  leads: 'list',
  pipeline: 'view-kanban',
  followups: 'schedule',
  more: 'more-horiz',
  plus: 'add',
  search: 'search',
  back: 'chevron-left',
  chevronRight: 'chevron-right',
  person: 'person',
  storefront: 'storefront',
  document: 'description',
  team: 'group',
  integrations: 'sync',
  analytics: 'bar-chart',
  subscription: 'credit-card',
  help: 'help-outline',
  trash: 'delete',
  check: 'check',
  calendar: 'calendar-today',
  note: 'edit-note',
  sparkles: 'auto-awesome',
  copy: 'content-copy',
  settings: 'settings',
  close: 'close',
};

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color: string }) {
  return <MaterialIcons name={glyphs[name]} size={size} color={color} />;
}
