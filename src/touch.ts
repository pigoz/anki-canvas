import { Point } from './whiteboard';
import { HDPI_FACTOR } from './constants';

const DEFAULT_CONFIG = {
  color: '#000',
  lineWidth: 18,
};

type Config = Partial<typeof DEFAULT_CONFIG>;

const ongoing: Point[] = [];

function line(
  canvas: HTMLCanvasElement,
  src: Point,
  dst: Point,
  overrides: Config,
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

function model(canvas: HTMLCanvasElement, touch: any) {
  return {
    x: (touch.pageX - canvas.offsetLeft) * HDPI_FACTOR,
    y: (touch.pageY - canvas.offsetTop) * HDPI_FACTOR,
  };
}

const store = window.localStorage || window.sessionStorage;

export const load = (): Array<Point[]> =>
  JSON.parse(store.getItem('state') || '[]');

export const save = (x: Array<Point[]>) => {
  console.log('saved state', x);
  store.setItem('state', JSON.stringify(x));
};

function emptyarray(xs: Array<any>) {
  xs.splice(0, xs.length);
}

export const clear = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const redraw = (
  canvas: HTMLCanvasElement,
  state: Array<Point[]>,
  config: Config = {},
) => {
  clear(canvas);
  state.forEach(points => {
    for (let i = 1; i < points.length; i++) {
      line(canvas, points[i - 1], points[i], config);
    }
  });
};

export const handleStart = (canvas: HTMLCanvasElement) => (evt: TouchEvent) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = model(canvas, touches[0]);
  ongoing.push(touch);
};

export const handleMove = (canvas: HTMLCanvasElement) => (evt: TouchEvent) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = model(canvas, touches[0]);

  line(canvas, ongoing[ongoing.length - 1], touch, DEFAULT_CONFIG);
  ongoing.push(touch);
};

export const handleEnd = (canvas: HTMLCanvasElement, state: Array<Point[]>) => (
  evt: TouchEvent,
) => {
  evt.preventDefault();
  const touches = evt.changedTouches;
  const touch = model(canvas, touches[0]);

  line(canvas, ongoing[ongoing.length - 1], touch, DEFAULT_CONFIG);
  state.push(JSON.parse(JSON.stringify(ongoing)));
  save(state);
  emptyarray(ongoing);
};

export const handleCancel = () => (evt: TouchEvent) => {
  evt.preventDefault();
  emptyarray(ongoing);
};
