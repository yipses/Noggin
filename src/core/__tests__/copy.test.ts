import fs from 'fs';
import path from 'path';
import { ALMOST, AFTER_TEST, DRILL_DONE, FIRST_MEET, FORBIDDEN_DASHES, GREETING, REUNION, RIGHT } from '../copy';

const SRC = path.join(__dirname, '..', '..');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: fs.Dirent) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : sourceFiles(p);
    return /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

describe('copy rules', () => {
  const lines = [...ALMOST, ...RIGHT, ...DRILL_DONE, AFTER_TEST, REUNION, FIRST_MEET, ...Object.values(GREETING)];

  it('the noggin never uses em or en dashes', () => {
    for (const l of lines) expect(l).not.toMatch(FORBIDDEN_DASHES);
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
