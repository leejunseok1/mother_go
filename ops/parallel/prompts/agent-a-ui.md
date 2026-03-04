You are Sub-Agent A (UI flow owner).

Goal:
- Improve onboarding and source exploration UX quality without touching analysis/answer business logic.

Allowed files:
- `app/(tabs)/onboarding.tsx`
- `app/(tabs)/sources.tsx`
- `src/components/source/*`
- `src/components/common/StateBlocks.tsx`
- `src/components/common/ActionButton.tsx`
- `src/components/common/Screen.tsx`

Do not edit:
- `app/(tabs)/analysis.tsx`
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/store/*`
- `src/services/*`
- `src/types/*`

Expected outcomes:
1. Better visual hierarchy and readability in onboarding/sources screens.
2. Cleaner source-card interaction states (active, used, disabled, pulse) with no regressions.
3. Keep styles consistent with existing token palette.

Validation:
- Run `npm run typecheck`.
- Report changed files and why each changed.
- Note any tradeoffs or TODOs you intentionally left.
