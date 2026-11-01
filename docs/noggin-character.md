# Noggin, the character

The noggin is the heart of the app: every player has their own. This doc holds the locked design, the rules we learned getting there, and how to iterate from here. The design exploration itself is not kept; only what it taught us.

Files: `design/noggin/noggin.py` (drawing code), `design/noggin/noggin-calm.svg`, `noggin-happy.svg`, `noggin-sleepy.svg`.

## Who it is

- A small, soft creature whose **outline reads as a brain**, sitting with its paws in front like a pet waiting for you.
- Personality: **a puppy, not a coach.** Unconditional love, calm, happy to see you, a little sad when you're away, never blames you.
- Target feel: a **premium Japanese collectible character**, the kind adults buy (references: Smiski, designer vinyl blind box figures, Headspace's character for flat simplicity). Charming for kids, never too cute for adults.
- **Gender neutral by default.** Sweeter touches are cosmetics the player chooses.

## Locked design: D2

**Style.** Flat 2D vector. No 3D, gradients, or texture. One flat shading band and one flat highlight are the only lighting.

**Shape.** Wide and soft, slightly wider than tall, rounded base. Four soft lobes across the top, two per side, with a faint dip in the middle. Dips between lobes are rounded, never sharp.

**Grooves.** One short groove at each of the three valleys between lobes (left, centre, right); the centre one is shortest. Each starts exactly in the valley and runs along the natural split between the two lobes.

**Line work.** One continuous contour in warm charcoal. Thinner on top, heavier along the bottom (about 1% and 2.5% of body width). Grooves and paw curls are brush strokes: thick at the outline, tapering to a point inside.

**Paws.** Part of the silhouette, not stuck on. The outline flows into each paw on the outer side, wraps under it, rises up the inner side, and curls over the top of the paw before tapering into the body. Paws are planted fairly wide.

**Face.** Two small dark oval eyes, wide apart, in the lower half. A small, calm, flat mouth. No eyebrows, no blush by default.

**Lighting.** One matte highlight on the upper left lobe, a lighter tint of the body (never white). A flat shading band along the bottom, deeper toward the lower right.

**Palette (mustard, default)**

| Role | Hex |
|---|---|
| Body | #EDBE5A |
| Contour, grooves, paw curls | #4A3D36 |
| Shading band | #D9A640 |
| Highlight | #F6D88E |
| Eyes and mouth | #2E2622 |
| Ground shadow | #D9D2C8 at about 60% |

**Expressions so far:** calm (dot eyes, flat mouth, the default), happy (upturned closed eyes, small smile), sleepy (closed downturned eyes, flat mouth).

## Rules we learned

Each of these came from a version that failed. Check every new iteration against them.

1. **Lines start only in the valleys between lobes.** A line starting on top of a lobe reads as **hair**.
2. **Nothing in the zone above the eyes.** Any line there reads as a **brow**, and the noggin looks worried or scared.
3. **Lines must sit on the body,** anchored to the real outline. Placing them by eye left some floating off the edge.
4. **Few lobes, few lines.** Many even lobes with lines converging on one point read as a **seashell**. Many detailed folds read as an anatomical brain (**Krang**).
5. **No split down the front.** A cleft facing the viewer reads as a **peach or a butt**. A centre groove stays short and only at the top.
6. **Low lobes, rounded dips.** Tall, even bumps with sharp dips read as a **crown**.
7. **People read a brain from its silhouette and its side profile,** not from detail. Keep the outline doing the work.
8. **Pink plus folds reads as flesh.** Off-pink colours keep it a character, not an organ.
9. **Pastels, pink blush, a shy pose, a sparkle highlight, and thin tinted lines read feminine.** The default avoids them; players can add them as cosmetics.
10. **Paws drawn as closed circles look stuck on.** The continuous, curling paw line is what makes them feel attached.
11. **Test at app icon size.** If the silhouette doesn't read as a cute brain small, it doesn't work.

## Process lessons

- **Hand built vector beat AI image generators.** Generators either copied a reference exactly or drifted off the shape, and the word "brain" in a prompt adds detailed folds every time. Use them only for polish or exploration, with the vector as a low to medium strength reference.
- **Change one thing per variation** and compare side by side. That's how we found which cues mattered (blush and line colour were the biggest levers for the feminine read).
- **Measure, don't eyeball.** Grooves landed correctly only once they were anchored to the computed valleys of the outline.

## How to iterate

Start from `design/noggin/noggin.py`, not a blank page. The `D2` preset holds every locked parameter; new work should add presets, not edit D2.

| What you want | Where to change it |
|---|---|
| New expression | Add to `EXPRESSIONS` (eyes: open, happy, sleepy; mouth: flat, smile). New eye or mouth shapes go in `art()`. |
| New colourway | Add to `PALETTES` with a full set: body, contour, shade, highlight, blush, eye. Never just swap the body colour. |
| Blush cosmetic | `blush=True` |
| Lobe shape | `shape` (bumps per side, depths, notch). Re-anchor grooves to the new valleys afterwards. |
| Line weight | `cw` (top, bottom) |
| Paw curl | `crease` (how far it curls), `curl_w` (its weight) |

**Next character work:** an expression sheet (happy, sad and waiting, overjoyed reunion, proud), a standing or excited pose, alternate colourways as player choices (explored: butter, lilac, mint, sky, candy pink, mochi, teal), face touch cosmetics (blush tones, freckles, a sparkle, alternate mouths), and the sprout returning as a hat style outfit. Asymmetry should come from pose and expression (a tilt, a wave, a wink), never the base design.

**Before launch:** run a trademark search on the final character design, not just the name.
