You are Sub-Agent B (analysis pipeline owner) for round 3.

Goal:
- Harden streaming behavior and clean up user-facing analysis states/messages.

Allowed files:
- `app/(tabs)/analysis.tsx`
- `src/components/analysis/*`
- `src/store/analysisStore.ts`
- `src/services/bff.ts`
- `src/services/queries.ts`
- `src/types/domain.ts` (only if required)

Do not edit:
- `app/(tabs)/onboarding.tsx`
- `app/(tabs)/sources.tsx`
- `app/(tabs)/answer.tsx`
- `app/(tabs)/history.tsx`
- `src/components/source/*`
- `src/components/answer/*`
- `src/components/history/*`

Round 3 tasks:
1. Normalize corrupted/garbled analysis screen copy into clean, consistent labels.
2. Add stream state guard so rapid question switching cannot leave stale timeout/error UI.
3. Ensure timeout lifecycle resets on relevant progress events and never fires after final answer.

Validation:
- Run `npm run typecheck`.
- Report exact reliability fixes and changed files.
- Mention any edge cases not covered.

