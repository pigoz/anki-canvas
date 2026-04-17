import { options } from './options';

export function isCJK(c: string): boolean {
  if (c.length === 0) return false;
  const code = c.codePointAt(0);
  if (code === undefined) return false;
  // CJK Unified Ideographs
  if (code >= 0x4e00 && code <= 0x9fff) return true;
  // CJK Unified Ideographs Extension A
  if (code >= 0x3400 && code <= 0x4dbf) return true;
  return false;
}

export function parseElementContent(
  el: Element | null,
  opts: { onlyCJK: boolean },
): string[] {
  if (el === null) return [];
  const text = el.textContent ?? '';
  const chars = Array.from(text);
  if (opts.onlyCJK) return chars.filter(isCJK);
  return chars.filter(c => c.trim().length > 0);
}

const canvasKey = (i: number) => `ac:${i}`;

export function canvasKeys(): string[] {
  if (!options.multiCanvasEnabled) return [canvasKey(0)];
  const field = document.querySelector(
    options.multiCanvasFieldDomSelector,
  );
  const chars = parseElementContent(field, {
    onlyCJK: options.multiCanvasOnlyCJK,
  });
  const n = Math.max(chars.length, 1);
  return Array.from({ length: n }, (_, i) => canvasKey(i));
}
