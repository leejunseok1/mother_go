You are Sub-Agent A (UI flow owner) for round 3.

Goal:
- Improve onboarding/sources clarity and interaction polish with zero business-logic changes.

Allowed files:
- `app/(tabs)/onboarding.tsx`
- `app/(tabs)/sources.tsx`
- `src/components/source/*`
- `src/components/common/ActionButton.tsx`
- `src/components/common/StateBlocks.tsx`
- `src/components/common/Screen.tsx`

Do not edit:
- `app/(tabs)/analysis.tsx`
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/store/*`
- `src/services/*`
- `src/types/*`

Round 3 tasks:
1. Add source-status quick filters in sources UI (all/connected/simulated/error) with clear active state.
2. Improve source detail readability (field grouping and badges), keeping existing visual system.
3. Tighten accessibility labels/hints for source cards and filter controls.

Validation:
- Run `npm run typecheck`.
- Report changed files and why.
- Note any deferred UX ideas.

