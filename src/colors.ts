export type RGB = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

type HSV = {
  readonly h: number;
  readonly s: number;
  readonly v: number;
};

export const black = (_idx: number, _count: number): RGB => ({
  r: 0,
  g: 0,
  b: 0,
});

export function hex(c: RGB): string {
  return (
    '#' +
    [c.r, c.g, c.b]
      .map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
      })
      .join('')
  );
}

function rgb(color: HSV): RGB {
  let r = 0;
  let g = 0;
  let b = 0;

  const s = color.s;
  const v = color.v;
  const h = color.h;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255),
  };
}

export function spectrum(idx: number, count: number, s = 0.95, v = 0.75): RGB {
  return rgb({ h: idx / count, s, v });
}
