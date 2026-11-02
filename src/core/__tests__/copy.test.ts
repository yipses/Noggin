import fs from 'fs';
import path from 'path';
import { ALMOST, AFTER_TEST, ASK_NAME, DRILL_DONE, FIRST_MEET, FORBIDDEN_DASHES, GREETING, ONBOARD_INTRO, REUNION, RIGHT, drillsLine, greeting } from '../copy';

const SRC = path.join(__dirname, '..', '..');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: fs.Dirent) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : sourceFiles(p);
    return /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

describe('copy rules', () => {
  const lines = [...ALMOST, ...RIGHT, ...DRILL_DONE, AFTER_TEST, REUNION, FIRST_MEET, ONBOARD_INTRO, ASK_NAME, drillsLine(2), greeting('morning', 'Derek'), ...Object.values(GREETING)];

  it('the noggin never uses em or en dashes', () => {
    for (const l of lines) expect(l).not.toMatch(FORBIDDEN_DASHES);
  });

  it('greets by name when there is one', () => {
    expect(greeting('morning', 'Derek')).toBe('Good morning, Derek!');
    expect(greeting('night', 'Ana')).toBe('Hi there, Ana!');
    expect(greeting('morning', '')).toBe('Good morning!');
    expect(greeting('evening')).toBe('Good evening!');
  });

  it('the first test intro follows the real drill count', () => {
    expect(drillsLine(2)).toMatch(/^Two quick drills\./);
    expect(drillsLine(5)).toMatch(/^Five quick drills\./);
    expect(drillsLine(1)).toMatch(/^One quick drill\./);
  });

  it('no source file contains an em or en dash', () => {
    for (const f of sourceFiles(SRC)) {
      expect({ file: path.relative(SRC, f), dash: FORBIDDEN_DASHES.test(fs.readFileSync(f, 'utf8')) }).toEqual({ file: path.relative(SRC, f), dash: false });
    }
  });

  it('never says healthy, and no Nintendo names', () => {
    const banned = /\bhealthy\b|brain age|brain training|kawashima|big brain academy/i;
    for (const f of sourceFiles(SRC)) {
      const text = fs.readFileSync(f, 'utf8').replace(/^\s*(\/\/|\*|\/\*).*$/gm, '');
      expect({ file: path.relative(SRC, f), banned: banned.test(text) }).toEqual({ file: path.relative(SRC, f), banned: false });
    }
  });
});
