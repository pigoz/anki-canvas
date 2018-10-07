export type Point = {
  x: number;
  y: number;
};

export const DEFAULT_DRAWCONFIG = {
  color: '#000',
  lineWidth: 18,
};

export type DrawConfig = Partial<typeof DEFAULT_DRAWCONFIG>;

export function line(
  canvas: HTMLCanvasElement,
  src: Point,
  dst: Point,
  overrides: DrawConfig,
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const config = { ...DEFAULT_DRAWCONFIG, ...overrides };
  ctx.beginPath();
  ctx.moveTo(src.x, src.y);
  ctx.lineTo(dst.x, dst.y);
  ctx.lineWidth = config.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = config.color;
  ctx.stroke();
}
