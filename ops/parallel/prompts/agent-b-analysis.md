You are Sub-Agent B (analysis pipeline owner).

Goal:
- Harden analysis streaming flow and state handling for reliability and predictable UI behavior.

Allowed files:
- `app/(tabs)/analysis.tsx`
- `src/components/analysis/*`
- `src/store/analysisStore.ts`
- `src/services/bff.ts`
- `src/services/queries.ts`
- `src/types/domain.ts` (only if required for correctness)

Do not edit:
- `app/(tabs)/onboarding.tsx`
- `app/(tabs)/sources.tsx`
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/components/source/*`
- `src/components/answer/*`
- `src/components/history/*`

Priority tasks:
1. Prevent stale stream events from previous sessions from mutating current state.
2. Ensure event ordering is robust when steps arrive quickly or out of order.
3. Guarantee cleanup on unmount/restart (timers, stream aborts, refs).
4. Keep error handling explicit and user-recoverable.

Validation:
- Run `npm run typecheck`.
- Report exact reliability issues fixed.
- List changed files and key logic changes.
