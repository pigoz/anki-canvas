import { expect, test } from 'bun:test';
import { isCJK, parseElementContent } from '../src/kanji';

test('isCJK matches CJK unified ideographs', () => {
  expect(isCJK('漢')).toBe(true);
  expect(isCJK('字')).toBe(true);
  expect(isCJK('愛')).toBe(true);
});

test('isCJK matches CJK extension A', () => {
  expect(isCJK(String.fromCodePoint(0x3400))).toBe(true);
  expect(isCJK(String.fromCodePoint(0x4dbf))).toBe(true);
});

test('isCJK rejects non-CJK', () => {
  expect(isCJK('a')).toBe(false);
  expect(isCJK('1')).toBe(false);
  expect(isCJK(' ')).toBe(false);
  expect(isCJK('あ')).toBe(false); // hiragana
  expect(isCJK('ア')).toBe(false); // katakana
  expect(isCJK('')).toBe(false);
});

function fieldEl(text: string): HTMLElement {
  const el = document.createElement('div');
  el.textContent = text;
  return el;
}

test('parseElementContent returns [] for null element', () => {
  expect(parseElementContent(null, { onlyCJK: true })).toEqual([]);
});

test('parseElementContent filters to CJK when onlyCJK is true', () => {
  expect(parseElementContent(fieldEl('漢字'), { onlyCJK: true })).toEqual(['漢', '字']);
  expect(parseElementContent(fieldEl('漢 字'), { onlyCJK: true })).toEqual(['漢', '字']);
  expect(parseElementContent(fieldEl('日本語'), { onlyCJK: true })).toEqual([
    '日',
    '本',
    '語',
  ]);
  expect(parseElementContent(fieldEl('ねこ'), { onlyCJK: true })).toEqual([]);
});

test('parseElementContent keeps all non-whitespace when onlyCJK is false', () => {
  expect(parseElementContent(fieldEl('漢 字'), { onlyCJK: false })).toEqual([
    '漢',
    '字',
  ]);
  expect(parseElementContent(fieldEl('ab'), { onlyCJK: false })).toEqual(['a', 'b']);
});

test('parseElementContent preserves order', () => {
  expect(parseElementContent(fieldEl('愛犬家'), { onlyCJK: true })).toEqual([
    '愛',
    '犬',
    '家',
  ]);
});
