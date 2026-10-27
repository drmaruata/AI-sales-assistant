# UI redesign — reference-driven design

Date: 2026-10-27
Status: approved by the implementation request and the supplied reference board

## Intent

Bring the existing Expo app UI in line with the 22 supplied reference screens in
`image_reference/`, and make the reference's five-item tab bar real by adding the
missing Pipeline and More-hub screens. This is a visual and structural redesign of
the existing preview app. It is not a data-layer change: the app keeps using the
in-memory `PreviewLeadsProvider`.

## Goals

- One lavender / indigo visual language across every existing screen.
- Five live tabs: Home, Leads, Pipeline, Follow-ups, More.
- New Pipeline board and More hub, plus the hub destinations the reference shows.
- Restyle Home, Leads, Lead detail, Follow-ups, Draft reply, and the form screens.
- Keep accessibility: touch targets, roles, states, dynamic type.

## Non-goals

- No backend or Supabase wiring. Preview data stays in memory.
- No onboarding, business-type, splash, or subscription purchase flow logic.
- No new navigation library and no native tab bar (the reference tab bar is a
  floating pill, which NativeTabs cannot render).
- No AI provider calls.

## Constraints

- Expo SDK 58, React Native 0.88, Expo Router, TypeScript strict, React Compiler on.
- Gradients use `experimental_backgroundImage` (New Architecture), with a solid
  lavender fallback colour underneath.
- Icons: SF Symbols on iOS via `expo-symbols`, Material Icons on Android via
  `@expo/vector-icons`. No emoji glyph icons.
- Tokens stay in `src/theme/index.ts`. No hex values in screens.

## Approaches considered

1. **Restyle primitives only.** Cheapest, but cannot produce the floating tab bar
   or the reference's two new screens.
2. **Adopt NativeTabs.** Best platform fit, but the native bar cannot be a floating
   lavender pill and would visibly diverge from the supplied references.
3. **Chosen: token + primitive rewrite, JS Tabs with a custom tab bar, new
   screens.** Keeps one source of truth, matches the references, and touches each
   screen only where its layout differs.

## Design

### Tokens

- Canvas: lavender gradient `#EDE8FE → #F7F3FD → #E9E3FB`.
- Surface: frosted white `rgba(255, 255, 255, 0.72)` with a hairline light border.
- Accent: indigo `#4F46E5`; accent soft `#E7E5FF`.
- Text: `#16161D`; secondary `#6B6B7B`.
- Status: danger `#D92D20`, warning `#B45309`, success `#0F7A4D`, plus soft tints.
- Radius: `sm 10`, `md 16`, `lg 22`, `xl 28`, `pill 9999`.
- Type ramp: display 34/800, title 28/800, heading 18/700, body 15/400,
  label 13/600, caption 12/400.
- Avatar tints: lavender, mint, peach, sky. Chosen deterministically from the name.

### Components (`src/components`)

`Icon`, and in `sales-ui.tsx`: gradient `SalesScreen`, `PageHeading`, `Card`,
`Chip`, `StageBadge` with status dot, tinted `LeadAvatar`, card-style `LeadRow`,
compact `MetricCard`, pill `ActionButton`, `SectionHeading`, `EmptyState`.

### Navigation

`Tabs` with a custom floating pill bar. Visible: `index`, `leads`, `pipeline`,
`follow-ups`, `more`. `add` and `settings` stay as routes but leave the bar; add is
reached from the `+` button on Leads and Pipeline.

### New screens

- `pipeline.tsx`: horizontally scrolling stage columns with lead cards and counts.
- `more.tsx`: the reference settings/hub list with tinted leading icons.
- `analytics.tsx`, `ai-templates.tsx`, `team.tsx`, `integrations.tsx`,
  `subscription.tsx`, `help.tsx`: preview screens using the shared primitives and
  synthetic data.

## Risks

- CSS gradients need the New Architecture. A solid fallback colour keeps the screen
  usable if the gradient is unsupported.
- `expo-symbols` renders only on iOS; Android is covered by Material Icons.
