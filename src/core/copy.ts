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

export const AFTER_TEST = 'That felt great!';
export const REUNION = "You're back! I missed you!";
export const FIRST_MEET = 'Hello! I’m your noggin.';

export const RIGHT = ['Nice!', 'Yes!', 'Got it!', 'Nice!'];
export const ALMOST = ['Almost!', 'So close!', 'Try another!', 'Nearly!'];
export const DRILL_DONE = ['So quick!', 'Lovely!', 'That was fun!', 'Great work!'];

export function rightLine(rng: Rng): string {
  return pick(rng, RIGHT);
}

/** Rotate gentle wrong-answer lines so they don't feel repetitive. */
export function almostLine(count: number): string {
  return ALMOST[count % ALMOST.length];
}

export function drillDoneLine(rng: Rng): string {
  return pick(rng, DRILL_DONE);
}

/** Guard used by tests: UI copy must never contain em or en dashes. */
export const FORBIDDEN_DASHES = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']');
