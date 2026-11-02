/**
 * Everything the noggin says. Rules: short, warm, never negative, no em or en
 * dashes, never "healthy". Sadness is only ever about missing you.
 */

import { Rng, pick } from './rng';
import { TimeOfDay } from './day';

export const GREETING: Record<TimeOfDay, string> = {
  morning: 'Good morning!',
  afternoon: 'Good afternoon!',
  evening: 'Good evening!',
  night: 'Hi there!',
};

/** Greeting with the player's name when we have it: "Good morning, Derek!" */
export function greeting(t: TimeOfDay, name?: string): string {
  const g = GREETING[t];
  const n = name?.trim();
  return n ? `${g.slice(0, -1)}, ${n}!` : g;
}

/**
 * "Derek's", "James's". Straight apostrophe: it is written in the pen font,
 * where the curly one is very wide. (English only; localization needs its own rule.)
 */
export function possessive(name: string): string {
  return `${name.trim()}'s`;
}

/**
 * Onboarding. "Smarter" is the one deliberate exception to the
 * no-benefit-claims rule (docs/design.md section 2).
 */
export const ONBOARD_INTRO = 'Every day you play, your noggin gets a little smarter.';
export const ASK_NAME = "What's your name?";

const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
/** "Two quick drills." for the first test intro; follows the real drill count. */
export function drillsLine(n: number): string {
  const w = COUNT_WORDS[n] ?? String(n);
  return `${w} quick ${n === 1 ? 'drill' : 'drills'}. Take your time with the instructions.`;
}

export const AFTER_TEST = 'That felt great!';
export const REUNION = "You're back! I missed you!";
export const FIRST_MEET = 'Hello! I’m your noggin.';

export const RIGHT = ['Nice!', 'Yes!', 'Got it!', 'Nice!'];
export const ALMOST = ['Almost!', 'So close!', 'Try another!', 'Nearly!'];
/** Drill done cheers. Speed praise only for an above average score; the rest suit any score. */
export const DRILL_DONE_FAST = ['So quick!', 'Speedy!'];
export const DRILL_DONE = ['Lovely!', 'That was fun!', 'Great work!', 'All done!'];

export function rightLine(rng: Rng): string {
  return pick(rng, RIGHT);
}

/** Rotate gentle wrong-answer lines so they don't feel repetitive. */
export function almostLine(count: number): string {
  return ALMOST[count % ALMOST.length];
}

export function drillDoneLine(rng: Rng, score: number): string {
  return pick(rng, score > 50 ? [...DRILL_DONE_FAST, ...DRILL_DONE] : DRILL_DONE);
}

/** Guard used by tests: UI copy must never contain em or en dashes. */
export const FORBIDDEN_DASHES = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']');
