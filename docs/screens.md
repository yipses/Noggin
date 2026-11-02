# Screens

Specs for the final mockups. Reference images are in `design/screens/`. Mockups are drawn at 390 × 844 pt (iPhone portrait). Colours, fonts, and grid values are in `design/tokens.json`.

## Shared layout rules

- **Paper:** warm off-white with a dot every 20 pt. Anything meant to look printed on the paper (rules, answer lines) runs exactly through a row of dots and starts and ends on a dot.
- **Printed vs. handwritten:** the app's text, labels, buttons, and the noggin's speech are printed. Anything that's the player's (noggin name, scores, days trained, answers, taps) is in the player's pen.
- **Ink:** warm charcoal for printed lines and text. Player pen: blue ballpoint by default (pen colour may become an unlockable).
- **Buttons:** primary is a charcoal pill with white text, 56 pt tall. Secondary is white with a charcoal outline. Every tap target is at least 44 pt.
- **Speech bubbles:** white, charcoal outline, rounded, with a small tail toward the noggin. A few words only.
- **Tone:** encouraging, never negative. No negative numbers shown to the player.

## Home

Three bands, top to bottom.

1. **Top bar.** Left: a small desk calendar tile (mustard header strip reading the month, e.g. "OCT"; below it the number of days trained this month in the player's pen; then "trained"). Tapping it opens the full calendar. Right: a round profile button.
2. **The noggin.** Centred and large, sitting on a soft ground shadow. A speech bubble above left. A taped note above right, slightly rotated, showing "noggin score", the score in the player's pen, and a weekly trend in green. The noggin's name is handwritten below it on a printed name line.
3. **Bottom.** The happiness row: a heart icon, the meter, and a gift icon at the end. The meter fill is mustard; a striped section previews what the next action adds; the gift lights up when the preview reaches it. Below that, the main action. Then a tab bar: Today, Drills, Closet, Me.

**States**

| | Before today's training | After | After, score dipped this week |
|---|---|---|---|
| Noggin | Calm | Happy, small sparkle doodles around it | Happy |
| Bubble | "Good morning!" | "That felt great!" | "That felt great!" |
| Score note | Yesterday's score, "+2 this week" | Today's score, "+4 this week" | Today's score, "trained 2 days this week" |
| Meter | About half full, preview shows today's training | Nearly full, preview reaches the gift | Same as After |
| Action | "Today's training" with "5 min" | Training, Bonus game, Share (icon) | Same as After |
| Calendar | 17 | 18 | 18 |

## Drill: Highs and Lows (High Number)

1. **Intro.** Close button. "drill 3 of 5" and the drill name. An example card: on the "highest" side, a large 3 beside a small 8 with the 8 circled in pen; on the "lowest" side, the reverse trick. The noggin's tip: "Ignore the size. Read the number!" Buttons: Start, Practice first (untimed).
2. **Playing.** Top: close button, a thin progress bar, "7/20". Instruction: "tap the" in small print, then **highest** or **lowest** in large bold type with a mustard highlighter swipe behind it, plus an up or down arrow so it reads without words. Five numbers in deliberately mismatched sizes sit directly on the paper. The noggin watches from the bottom left corner, lifted well clear of the bottom edge.
3. **Answered.** The tapped number is circled in the player's pen; the noggin says "Nice!"
4. **Drill done.** A happy noggin cheering (speed praise like "So quick!" only for an above average score), the drill score handwritten on a taped note with "+3 last time", and a Next drill button. No progress dots: the intro already says "drill 1 of 2".

## Drill: Quick Sums (Calculations × 20)

1. **Question.** Progress bar (12/20). The problem printed large (e.g. **7 × 8**) with a printed answer line below it, snapped to the dot grid. Four answer cards in a 2 × 2 grid in thumb reach: white, charcoal outline, a slight raised edge. The noggin watches from the left.
2. **Right answer.** The answer is handwritten on the answer line and the chosen card is circled in pen. The noggin: "Nice!" with happy eyes.
3. **Wrong answer.** The tapped card gets a quick pen strike-through and a slight tilt. The noggin: "Almost!" The question stays open until the right answer is tapped.

Distractor rules: plausible values (off by one or two, off by ten, a neighbouring times table fact), and every choice ends in a different digit.
