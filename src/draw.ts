import { HDPI_FACTOR } from './constants';
import { Point } from './app';

export const DEFAULT_CONFIG = {
  color: '#000',
  lineWidth: 18,
};

export type DrawConfig = Partial<typeof DEFAULT_CONFIG>;

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

  const config = { ...DEFAULT_CONFIG, ...overrides };
  ctx.beginPath();
  ctx.moveTo(src.x, src.y);
  ctx.lineTo(dst.x, dst.y);
  ctx.lineWidth = config.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = config.color;
  ctx.stroke();
}

const ongoing: Point[] = [];

function emptyarray<T>(xs: Array<T>) {
  xs.splice(0, xs.length);
}

function point(canvas: HTMLCanvasElement, touch: any): Point {
  return {
    x: (touch.pageX - canvas.offsetLeft) * HDPI_FACTOR,
    y: (touch.pageY - canvas.offsetTop) * HDPI_FACTOR,
  };
}

export const handleStart = (canvas: HTMLCanvasElement) => (evt: TouchEvent) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = point(canvas, touches[0]);
  ongoing.push(touch);
};

export const handleMove = (canvas: HTMLCanvasElement) => (evt: TouchEvent) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = point(canvas, touches[0]);

  line(canvas, ongoing[ongoing.length - 1], touch, DEFAULT_CONFIG);
  ongoing.push(touch);
};

export const handleEnd = (
  canvas: HTMLCanvasElement,
  done: ((p: Point[]) => void),
) => (evt: TouchEvent) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = point(canvas, touches[0]);

  line(canvas, ongoing[ongoing.length - 1], touch, DEFAULT_CONFIG);
  done(JSON.parse(JSON.stringify(ongoing)));
  emptyarray(ongoing);
};

export const handleCancel = () => (evt: TouchEvent) => {
  evt.preventDefault();
  emptyarray(ongoing);
};

const clear = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const redraw = (canvas: HTMLCanvasElement, config: DrawConfig = {}) => (
  iterator: (cb: (p: Point[]) => void) => void,
) => () => {
  clear(canvas);
  iterator(points => {
    for (let i = 1; i < points.length; i++) {
      line(canvas, points[i - 1], points[i], config);
    }
  });
};
