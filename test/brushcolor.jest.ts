import { spectrum, contrast } from '../src/brushcolor';

// test fixtures from
// https://github.com/cayennes/kanji-colorize
test('spectrum あ (3 strokes)', () => {
  testFixture(spectrum, ['#bf0909', '#09bf09', '#0909bf']);
});

test('spectrum 漢 (13 strokes)', () => {
  testFixture(spectrum, [
    '#bf0909',
    '#bf5d09',
    '#bfb109',
    '#79bf09',
    '#25bf09',
    '#09bf41',
    '#09bf95',
    '#0995bf',
    '#0941bf',
    '#2509bf',
    '#7909bf',
    '#bf09b1',
    '#bf095d',
  ]);
});

test('contrast あ (3 strokes)', () => {
  testFixture(contrast, ['#bf0909', '#093ebf', '#73bf09']);
});

test('contrast 漢 (13 strokes)', () => {
  testFixture(contrast, [
    '#bf0909',
    '#093ebf',
    '#73bf09',
    '#bf09a8',
    '#09bfa0',
    '#bf6b09',
    '#3609bf',
    '#11bf09',
    '#bf0946',
    '#097bbf',
    '#b0bf09',
    '#9909bf',
    '#09bf64',
  ]);
});

function testFixture(
  fn: (idx: number, count: number) => string,
  fixture: string[],
) {
  fixture.forEach((val, idx) => {
    const t = (a: number, b: string) => `${a}-${b}`;
    expect(t(idx, fn(idx, fixture.length))).toBe(t(idx, val));
  });
}
