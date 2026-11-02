# Noggin

A mobile daily brain games app inspired by Nintendo's Brain Age. Solo daily ritual: open the app, do today's training (about 5 minutes), see your score, keep your noggin happy. Every player has their own noggin, a companion character whose happiness follows how often they show up.

Owner: Derek. The prototype is being built here in Claude Code.

## Read first
- `docs/design.md`: product decisions (Decided vs. Proposed). Source of truth.
- `docs/screens.md`: final screen specs. Images in `design/screens/`.
- `docs/noggin-character.md`: the character, its rules, and how to iterate on it.
- `docs/drills.md`: drill concepts. `design/tokens.json`: colours, fonts, grid.

## Hard rules
- No scientific or health claims anywhere. The noggin is kept **happy**, never "healthy." One exception, Derek's call: the onboarding line says the noggin gets "a little smarter" (design.md section 16). Don't add more.
- UI copy never uses em dashes or en dashes. Hyphens in compound words are fine.
- No Nintendo names or IP (Brain Age, Brain Training, Dr. Kawashima, Big Brain Academy, their drill names). Drills get original names.
- Never show the player a negative number or guilt them. The noggin can miss you; it never blames you.
- What's the player's is handwritten in their pen (their name, scores, days, answers); everything the app says is printed.
- The player gives their own name; the noggin is always "Your noggin" (design.md section 16).
- Printed elements on the paper snap to the 20 pt dot grid.
- Character changes follow `docs/noggin-character.md`; generate the noggin from `design/noggin/noggin.py` rather than redrawing.

## Stack and architecture
- React Native with Expo; iOS and Android (Android matters).
- Drill generation, scoring, norms, and progression in plain modules with no UI.
- Offline first, all content bundled, no server needed to play.
- Storage, ads, purchases, haptics, notifications, sharing behind small interfaces.
- Phone first: portrait, thumb reach, safe areas. Test on a cheap older Android phone.

## Prototype priorities
1. Scoring module (drill score = 50 + 10 per SD; Noggin Score = average of drill scores; placeholder norms in design.md).
2. Two drills: Quick Sums and Highs and Lows (see screens.md).
3. The daily test flow and home screen.
Style polish comes after these work.

## Working agreements
- Keep `docs/design.md` updated whenever a decision changes.
- Ask Derek before changing anything under Decided.

## Commands
- `npx expo start` to run, `npm test` for the core module tests, `npm run typecheck`.
- `npm run gen:noggin` regenerates `src/ui/noggin/nogginArt.ts` from `design/noggin/noggin.py`.
- Core game logic lives in `src/core` (no React imports). UI copy lives in `src/core/copy.ts`; tests check it has no em or en dashes.
