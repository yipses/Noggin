# Noggin

A daily brain games app for iOS and Android: open the app, do today's training (a few minutes), see your score, keep your noggin happy. Built with React Native and Expo.

**Start here:** [`CLAUDE.md`](CLAUDE.md) (hard rules and priorities), then [`docs/design.md`](docs/design.md) (source of truth for product decisions), [`docs/screens.md`](docs/screens.md), [`docs/noggin-character.md`](docs/noggin-character.md), and [`design/tokens.json`](design/tokens.json).

## Run it

Needs Node 20 or newer.

```bash
npm install
```

```bash
npx expo start
```

Then open it in Expo Go on a phone (scan the QR code), or press `a` for an Android emulator, `i` for the iOS simulator, `w` for the web.

```bash
npm test
```

```bash
npm run typecheck
```

Prototype tools (fill a sample week, start over) are on the **Me** tab in development builds.

## What's built

Prototype priorities from `CLAUDE.md`, in order:

1. **Scoring module**: `src/core/scoring.ts` and `src/core/norms.ts`. Drill score = 50 + 10 per SD; Noggin Score = average of the day's drill scores; placeholder norms from design.md.
2. **Two drills**: Quick Sums and Highs and Lows (`src/core/drills/`, screens in `src/features/drills/`). Intro, untimed practice, play with pen circle and strike marks, drill done.
3. **Daily test flow and home screen**: first launch (meet, name, birth year, first test), the daily test (first completed test per day counts, day ends at 4am), results, and the home screen in its before, after, and reunion states. Also the happiness meter with preview and gifts, a monthly calendar, and a Drills tab for training.

Not built yet: the other three score drills, Closet contents, gifts' contents, weekly tasks, ads, purchases, reminders, sharing cards (share is plain text for now). See section 15 of `docs/design.md` for the choices made while building.

## Layout

```
src/
  core/        Plain TypeScript, no UI: scoring, norms, drill generation, days, progress, happiness, copy
  services/    Storage, haptics, sharing, ads, purchases, notifications behind small interfaces
  state/       App state and persistence
  ui/          Paper, grid-snapped rules, pen marks, noggin, meter, buttons, theme from tokens.json
  features/    Drill screens
  app/         Screens (Expo Router)
design/        Tokens, the noggin's drawing code and SVGs
docs/          Design doc, screen specs, character, drill reference
scripts/       gen_noggin.py: regenerates the noggin art from design/noggin/noggin.py
```

## Fonts

The app ships Latin subsets of its fonts in `assets/fonts/` (about 0.5 MB instead of 26 MB). To rebuild them after changing which characters are needed:

```bash
pip install fonttools
```

```bash
npm run fonts
```

## Changing the noggin

Never redraw it. Edit presets in `design/noggin/noggin.py` following `docs/noggin-character.md`, then:

```bash
npm run gen:noggin
```
