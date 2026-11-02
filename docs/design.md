# Noggin: Design Doc

Living design doc for Noggin, a mobile daily brain games app inspired by Nintendo's Brain Age. The single source of truth for product decisions. Companions: `docs/noggin-character.md` (the character and how to iterate on it), `docs/screens.md` (final screen specs), `docs/drills.md` (50 drill concepts), `design/tokens.json`.

**Legend.** Under each heading, **Decided** lists Derek's decisions and **Proposed** lists Claude's suggestions not yet confirmed. *(Research)* marks findings.

---

## 1. Concept

**Decided**
- Remake the spirit of Brain Age for mobile: a short, simple, daily brain workout, as a **solo daily ritual**.
- Why this genre: low cost software with a modest visual bar that reached a huge non gamer audience, and something AI can help one person produce at quality.
- Strategy: price so low nobody can beat it, and win a loyal global player base.
- AI is an internal production advantage (speed, content, localization). Never a player facing feature, never mentioned to players.
- Codename **Noggin**. Store name candidates: *Noggin: Daily Brain Games* or *Noggin: Train Your Brain*. Slogan: **Grow Your Noggin**.

**Proposed**
- Defensibility comes from what accumulates: score history, localization with regional pricing, a clear brand, and a shareable daily score.

## 2. Audience, tone, and constraints

**Decided**
- For everyone. Harmless, easy, good for you. Not gym like or effortful.
- **No scientific or health claims.** Never claim cognitive, health, or anti ageing benefits. *(Research: the FTC fined Lumosity in 2016 over such claims.)* Copy says "keep your noggin **happy**," never "healthy."
- UI copy never uses em dashes or en dashes. Hyphens in compound words are fine.

**Proposed**
- No Nintendo IP: no "Brain Age," "Brain Training," Dr. Kawashima, Big Brain Academy, or their drill names, and nothing too close (for example "Mind Years"). Every drill gets an original name.
- Build original versions of research tasks; don't copy items or names from clinical batteries.
- Trademark search on "Noggin" (Nickelodeon has used it) and on the character design.
- Players under 13 trigger children's privacy rules on ads and data. Needs a plan before launch; the birth year question doubles as the age check.
- *(Research)* Brain Age skewed adult: over two thirds of Brain Age 2 buyers were over 25.

## 3. First launch and daily loop

**Decided**
- **First launch:** meet your noggin, **name it**, learn in simple words that this app helps keep it happy, give your **birth year**, take a quick test, get your first score.
- **Daily:** come back, take **one score test a day**, make your noggin happy, see your score change. A daily habit, almost like a Tamagotchi.
- Keep Brain Age's split: a daily score test plus optional training drills.

**Proposed**
- Ask birth year "so we can compare your score with people your age."
- No account or sign up before the first score. Keep the intro to a few screens.
- Untimed instructions before each drill, so the first score reflects the drill, not learning the controls.
- The first score is a warm moment: "this is your starting point," never a grade.
- Only the first test attempt each day counts, so players can't retake for a better number.
- Fresh content daily (new problems, mazes, symbol keys) so players improve at the skill, not at memorizing.
- Daily loop: open the app, the noggin greets you, take the test (about 5 minutes), see your score and the noggin react, then optional training, weekly tasks, and a bonus game.
- The day ends around 4am local time, so late night play counts for the right day.
- Daily scores bounce with sleep and distraction. Headline trend is a 7 day average or weekly best.

## 4. Noggin Score

**Decided**
- **50 is average**, and the score climbs with practice.
- Long term the score is **age adjusted** (compared with players your age). For the prototype, everyone shares one curve.
- Rationale: Brain Age's number worked because it was personal and instantly readable. Percentiles aren't widely understood; a number with a clear middle is.
- **Drill score = 50 + 10 per standard deviation** from that drill's average. Average is 50, one SD better is 60, two better is 70.
- **Noggin Score = the average of the day's drill scores.** Players see each drill score too.
- The score is a **secondary** metric to the noggin's happiness, but it sits right beside the noggin on the home screen.

**Proposed**
- Compare log time for timed drills (times are skewed by slow outliers).
- Players must tap the right answer to advance, so errors cost time and timed drills score on speed alone.
- Averaging pulls the Noggin Score toward 50; a 70 overall is much rarer than a 70 on one drill. Stretch the overall score if it feels squished.
- Consider 100 as a soft ceiling with diminishing gains.
- Build age norms from players' first week of scores, since practice inflates scores quickly.
- A raw number travels better than letter grades, which vary by country.

**Placeholder norms** (editable constants, replace with playtest data)

| Drill | Raw metric | Mean | SD | Basis |
|---|---|---|---|---|
| Calculations × 20 | Seconds for 20 problems | 30s | 9s | Estimate, about 1.5s per problem with 4 choices |
| Stroop | Seconds for 20 trials | 24s | 6s | Keyboard trials take about 1 to 1.5s |
| Connect Maze | Seconds for 25 targets | 45s | 15s | Trail Making B: ages 18 to 24 average about 49s on paper; tapping is faster |
| Symbol Match | Correct in 90s | 48 | 12 | Online touch Digit Symbol median 48, ages 18 to 80 |
| High Number | Seconds for 20 screens | 24s | 6s | Estimate, no norms for this format |

Calculations and High Number have no good published norms; replace them first, even with 10 playtesters.

## 5. Drills

**Decided:** the initial score drills. Each stays at one fixed difficulty so scores compare day to day.

| Drill | How it plays | Scored on |
|---|---|---|
| Calculations × 20 | 20 arithmetic problems, each with **4 answer choices** in a 2×2 grid | Seconds |
| Stroop | A colour word in a different ink colour; tap the ink colour | Seconds for 20 |
| Connect Maze | Tap targets in alternating order (A, 1, B, 2...) | Seconds for 25 |
| Symbol Match | A key pairs digits with symbols; tap the match for each digit | Correct in 90s |
| High Number | Numbers of different sizes; the instruction switches between "tap the highest" and "tap the lowest" | Seconds for 20 |

High Number takes inspiration from Big Brain Academy's harder balloon drill, but stays one tap per screen; full ordering would duplicate Connect Maze's tapping in sequence.

**Decided (drill screens)**
- Working names: **Quick Sums** (Calculations × 20) and **Highs and Lows** (High Number). Still placeholders until final naming.
- Your taps are drawn in **your pen**: a correct pick gets circled, a wrong pick gets struck through, and Quick Sums writes your answer on a printed answer line.

**Proposed**
- No visible timer. Time is still measured for scoring; a progress bar gives a sense of pace. Test whether players miss seeing their speed.
- The answer writing on each question must be very quick, or it slows a 20 question drill.
- Rotate gentle wrong answer lines ("Almost!") so they don't feel repetitive.
- Calculations distractors must be plausible (off by one, off by ten, a neighbouring times table fact), with varied last digits.
- High Number could add negatives at a fixed level; harder variants go to training.
- Stroop's colour words need translating, and its colours must be colourblind safe (no red and green pair). Connect Maze could swap letters for a colour or shape alternation to become language free.
- Training drill candidates: N back, Task Switching, Matrix Puzzles, Object Location, Visual Search, Go / No Go, everyday tasks like making change. Matrix puzzles suit AI assisted content.
- Prefer tap input; voice and handwriting are awkward on phones.

## 6. The noggin: companion and progression

**Decided**
- Every player has **their own noggin**, the heart of the app. A default noggin is the brand face (store, icon, marketing); each player's is personalized on top.
- Personality: a **puppy, not a coach**. Unconditional love. It can be a little sad when you're away, but never blames you or guilts you. Contrast: Duolingo's owl.
- The noggin's mood follows **engagement**, never performance.
- **Two numbers:** the Noggin Score (how well you do) and **Happiness** (how often you show up).
- **Happiness is a continuous love meter**, not discrete slots, so it feels like a feeling rather than a timer.
  - Playing fills it. When it's full, you get a **gift**, and the meter drops back part way, so a loyal player is always close to the next gift.
  - Different actions fill different amounts: the daily test the most, training a little, weekly tasks a bigger boost.
  - A **faint preview** shows how much the next action would add, to motivate.
  - It drains while you're away. A little sadness is fine.
  - **Reunion bonus:** coming back to an empty meter gives an instant boost before you play ("You're back! I missed you!").
- Gifts are **always earned, never sold.** Contents: outfits, badges, seasonal collectibles, backgrounds, colour schemes, face touches.
- **Weekly tasks** give bonus happiness.
- The **calendar** moves off the home screen, one tap away, shown as a **monthly running total** (for example "18 days in October").
- Colour based on what you're good at was set aside: it ties the pet to the score and reads as a label.

**Proposed**
- How far the meter drops after a gift is the pacing dial: dropping a little means near daily gifts, dropping to empty means one every few days. Tune in playtesting.
- Gifts need **rarity tiers** so opening one stays exciting, and no duplicates.
- Seasonal items should come back later rather than vanish forever, to avoid guilt driven fear of missing out.
- Weekly tasks: 2 or 3 a week, about engagement ("try a new drill"), never performance.
- The faint preview shows only the next action's gain, glows the gift if it would fill the meter, and uses a pattern as well as colour.
- Avoid a consecutive streak counter; a streak resetting to zero is the most guilt inducing mechanic in habit apps.
- *(Derek's idea, not yet decided)* **Pen colours as unlockables.** Visible every day on everything handwritten, cheap to make, and personal on share cards. Pen types could be rarities (ballpoint, gel, fountain, a rare shimmer). Avoid true red (reads as a teacher's correction). Every pen must stay readable on the paper. Paper types (grid, lined, dotted, kraft) could follow the same logic.
- **Daily mood:** the noggin starts each day sleepy and wakes up when you play.
- The noggin cheers whatever the score. Sadness is always about missing you, never about failing.
- Share cards show the player's own noggin, so every share looks personal.
- *(Research)* Random rewards that are never purchasable avoid loot box regulations aimed at paid rewards.

## 7. The noggin: character design

**Decided**
- Locked design **D2**: a small, soft creature whose outline reads as a brain, four soft lobes with short grooves in the three valleys, paws resting in front. Flat vector, premium Japanese line work, warm charcoal outline, mustard body, calm flat mouth, one matte highlight, no blush by default (blush is a cosmetic).
- Full spec, palette, the rules we learned, and how to iterate: `docs/noggin-character.md`. Drawing code and SVGs: `design/noggin/`.

## 8. Home screen

**Decided** (full spec in `docs/screens.md`)
- Three bands: a calendar tile and profile at the top, the noggin in the middle, the happiness meter and main button at the bottom in thumb reach, then a tab bar.
- The noggin speaks in a short speech bubble ("Good morning!"). No headline text.
- The **Noggin Score** sits on a taped note beside the noggin, with a **weekly trend** ("+2 this week"). If the score dipped, the note shows something positive instead ("trained 2 days this week"). Never a negative number.
- **Happiness** is shown as icons only: a heart, the meter, and a gift at the end. No label.
- The **calendar** is a small desk calendar tile: the month, the number of days trained, "trained."
- The main button reads **"Today's training."**
- Your noggin's **name** is handwritten on a printed name line under it.
- Weekly tasks are removed from the home screen for now.

**Proposed**
- Tab bar: Today, Drills, Closet (outfits and gifts), Me. Not yet discussed in depth.

## 9. Monetization

**Decided**
- Free to play with light ads, plus a low price to remove ads or add more content.
- Cosmetics are never sold (section 6).

**Proposed**
- No forced ads between drills. Better: one ad at the end of the daily session, menu banners, or rewarded ads for bonus drills.
- One "own it forever" unlock for ad removal and extra content is the clearest message.
- *(Research)* Ad revenue concentrates in North America, Western Europe, Japan, and Australia, so a global audience helps reach more than revenue.
- Retention is the key revenue feature, since daily ad revenue per player is tiny.

## 10. App visual direction

**Decided**
- The app's look follows the character: flat vector, premium Japanese line work, mustard and warm charcoal.
- **A light notebook theme:** warm paper with a faint dot grid, small monospace labels, a few thin ink doodles, a highlighter swipe on key words. A seasoning, not the whole style; main type and buttons stay clean and rounded.
- **What's yours is handwritten; everything the app says is printed.** Your noggin's name, your scores, your days trained, and your taps are in your pen (blue ballpoint by default). Labels, buttons, and the noggin's speech are printed.
- **Printed elements snap to the 20 pt dot grid.** Lines run exactly through a row of dots and start and end on a dot, or the paper illusion breaks.
- Morning Paper was the starting direction and is retired in favour of the above.

**Proposed**
- Handwriting font: Klee One (calm, refined, and includes Japanese characters). Alternatives tried: Caveat (too loose), Patrick Hand, Gaegu, Yomogi.
- Handwriting only for short things like names and numbers; anything longer stays printed.
- Handwriting fonts often cover only Latin letters; plan a per script fallback for names typed in other languages.

## 11. Platform and technical approach

**Decided**
- Ship to the App Store and Google Play. React Native; Android matters.
- Prototype priorities: drills, the test, scoring. Style pass after.

**Proposed**
- React Native with Expo for iOS, Android, and web from one codebase. *(Research: Apple's Guideline 4.2 rejects apps that feel like a wrapped website.)*
- Keep drill generation, scoring, norms, and progression logic in plain modules with no UI.
- Offline first, all content bundled, no server needed to play.
- Storage, ads, purchases, haptics, notifications, and sharing behind small interfaces.
- Phone first: portrait, thumb reach, safe areas. Test early on a cheap older Android phone.
- At release: haptics, a daily reminder from the noggin, a home screen widget.
- PokeLearning (https://yipses.github.io/pokeLearning/) has adaptive math generation and speed and accuracy scoring that may be reusable; not yet reviewed.

## 12. Brain Age reference

*(Research)*
- **Brain Age Check:** three short drills produce one number a day; only one result recorded per day.
- **Training:** a menu of drills, each with its own score and graph; first attempt per day counts. Mostly separate from the check drills.
- Daily calendar stamp; milestones unlock drills; Brain Age 2 added a reward minigame after the day's stamp. Missed days were just blank squares.
- Sessions ran about 5 to 15 minutes. Results used playful speed metaphors (bicycle, jet, rocket).
- The number was never validated; it fell mostly through practice. Its genius was the arc: start a little humbled, then improve reliably.
- *(Claude's read)* Check drills mirror classic cognitive tests (Stroop, Trail Making, Digit Symbol) at fixed difficulty; training drills are playful, adaptive, and everyday.

## 13. Open questions

- Grades or tiers on top of the score; whether 100 is a soft ceiling
- Real norms, then age bands
- All five score drills daily, or rotate 3 of 5
- Original drill names and language free versions; training drill lineup
- Love meter pacing: fill amounts, drain speed, where it drops after a gift, reunion bonus size
- Gift contents, rarity tiers, and weekly task list
- Expression sheet, poses, alternate colourways
- Final drill names; tab bar and navigation
- Pen colours and paper types as unlockables
- Bonus game concept
- Ad placement, unlock price, regional pricing
- Plan for players under 13

## 14. Workflow

**Decided**
- Build in Claude Code, with the GitHub repo as the single home for code and docs.

**Proposed**
- Update this doc whenever a decision changes, so every session starts from the current picture.

## 15. Prototype build notes

Choices Claude made while building the first prototype. All are **Proposed**: nothing under Decided was changed. Each lives in a plain module as an editable constant.

**Proposed**
- **Daily test (prototype):** Quick Sums then Highs and Lows (`src/core/drills/index.ts`, `DAILY_TEST`). Screens read "drill 1 of 2" until more drills are built.
- **Only completed tests count.** Closing a test part way records nothing, so the player can start again that day. The first *completed* test is the one that counts. Revisit if players quit to dodge a slow run.
- **Timing excludes feedback.** Drill time is the sum of each item's solve time (shown to right tap). The short "Nice!" pause and pen animation between items aren't counted, so polish never costs score.
- **Scoring:** linear z score as Decided. Log time is implemented and one constant away (`TIME_SCALE` in `src/core/scoring.ts`). Scores floor at 0, no ceiling yet. The Noggin Score averages unrounded drill scores, then rounds once.
- **Quick Sums content:** a mix of addition (3 to 19 plus 2 to 9), subtraction (answers 2 to 15), and times tables (2 to 9). Distractors come from off by one or two, off by ten, and neighbouring times table facts, with every choice ending in a different digit.
- **Highs and Lows content:** five distinct numbers from 1 to 9 per screen; 70% of screens print the target among the smallest; never more than 3 of the same instruction in a row.
- **Fresh content daily:** content is seeded from the day key, so it changes every day but is identical on retries within a day. Training runs use a new seed every time.
- **Practice first:** 5 untimed items, then back to the intro.
- **Happiness pacing (starting values, tune in playtests):** daily test +0.35, training +0.08, weekly task +0.5 (not built); meter drops to 0.4 after a gift; drains 0.15 per day after a 30 hour grace; reunion boost 0.25; new noggins start at 0.2.
- **Weekly trend:** latest score compared with the latest score from a week or more earlier (or the first score, early on). Up shows "+N this week"; otherwise "trained N days this week"; with no days this week it shows "your last score" rather than a zero.
- **Drill done note:** "+N last time" against the previous daily test; otherwise "nicely done", or "first time!" on the first run.
- **Placeholder names for unbuilt drills** on the Drills tab: Ink Spot (Stroop), Dot to Dot (Connect Maze), Secret Code (Symbol Match). Not final.
- **Character asset pipeline:** `scripts/gen_noggin.py` runs `design/noggin/noggin.py` unchanged and writes `src/ui/noggin/nogginArt.ts`, slimming paths about 10x so cheap phones render it fast. Pixel diff against the shipped SVGs is under 0.2% (anti-aliasing only).
- **Printed lines snap to the dot grid at runtime:** `GridRule` measures its own window position and draws its stroke on the nearest dot row, starting and ending on dots.
- **Fonts are Latin subsets** (`assets/fonts/`, built by `scripts/subset_fonts.py`). The full Klee One and M PLUS Rounded 1c files include complete Japanese sets and came to about 26 MB, which made the web preview stall on phones and would bloat the app. Subsets total about 0.5 MB. Names typed in other scripts (including Japanese) show in the system font for now; a proper per script fallback is still to plan (section 10).
