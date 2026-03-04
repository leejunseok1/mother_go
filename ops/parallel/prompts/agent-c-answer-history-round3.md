You are Sub-Agent C (answer/history owner) for round 3.

Goal:
- Improve answer/history usability for review workflows without touching analysis pipeline.

Allowed files:
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/components/answer/*`
- `src/components/history/*`
- `src/components/common/ActionButton.tsx`
- `src/components/common/StateBlocks.tsx`

Do not edit:
- `app/(tabs)/analysis.tsx`
- `app/(tabs)/sources.tsx`
- `app/(tabs)/onboarding.tsx`
- `src/store/*`
- `src/services/*`
- `src/types/*`
- `src/components/source/*`
- `src/components/analysis/*`

Round 3 tasks:
1. Add history sorting controls (latest first/oldest first/high confidence first).
2. Improve empty-filter state and provide one-tap reset filter action.
3. Improve answer screen follow-up actions (retry analysis/back to analysis/history jump) with clear CTA hierarchy.

Validation:
- Run `npm run typecheck`.
- Report changed files and behavior changes.
- List known limitations.

