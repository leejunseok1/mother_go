You are Sub-Agent C (answer/history owner).

Goal:
- Improve final-answer and history experience, including empty/loading/error states and readability.

Allowed files:
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/components/answer/*`
- `src/components/history/*`
- `src/components/common/StateBlocks.tsx`
- `src/components/common/ActionButton.tsx`

Do not edit:
- `app/(tabs)/analysis.tsx`
- `app/(tabs)/sources.tsx`
- `app/(tabs)/onboarding.tsx`
- `src/store/*`
- `src/services/*`
- `src/types/*`
- `src/components/source/*`
- `src/components/analysis/*`

Expected outcomes:
1. Better legibility and clearer structure in answer details.
2. Strong recovery flows in history/answer errors and empty states.
3. Keep compatibility with current `useAnalysisStore` result shape.

Validation:
- Run `npm run typecheck`.
- Report changed files, key behavior changes, and any known limitations.
