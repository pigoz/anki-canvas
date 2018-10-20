import { hex, spectrum } from '../src/colors';

test('basic', () => {
  const t = (idx: number) => hex(spectrum(idx, 3, 1, 1));
  expect(t(0)).toBe('#ff0000');
  expect(t(1)).toBe('#00ff00');
  expect(t(2)).toBe('#0000ff');
});

// test fixtures from
// https://github.com/cayennes/kanji-colorize
test('realistic - あ (3 strokes)', () => {
  const result = ['#bf0909', '#09bf09', '#0909bf'];

  result.forEach((val, idx) => {
    const t = (a: number, b: string) => `${a}-${b}`;
    expect(t(idx, hex(spectrum(idx, result.length)))).toBe(t(idx, val));
  });
});

test('realistic - 漢 (13 strokes)', () => {
  const result = [
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
  ];

  result.forEach((val, idx) => {
    const t = (a: number, b: string) => `${a}-${b}`;
    expect(t(idx, hex(spectrum(idx, result.length)))).toBe(t(idx, val));
  });
});
