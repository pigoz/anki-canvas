import { HDPI_FACTOR } from './constants';

type Point = {
  x: number;
  y: number;
};

type Priv = Array<Point[]>;
type State = Priv & { _T: 'State' };

export const DEFAULT_CONFIG = {
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

function model(canvas: HTMLCanvasElement, touch: any): Point {
  return {
    x: (touch.pageX - canvas.offsetLeft) * HDPI_FACTOR,
    y: (touch.pageY - canvas.offsetTop) * HDPI_FACTOR,
  };
}

const store = window.localStorage || window.sessionStorage;

export const load = (): State => JSON.parse(store.getItem('state') || '[]');

export const save = (x: State): void => {
  store.setItem('state', JSON.stringify(x));
};

export const empty = (): State => JSON.parse('[]');

const cast = (x: Priv): State => x as State;

function emptyarray<T>(xs: Array<T>) {
  xs.splice(0, xs.length);
}

export const clear = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const map = (state: State, cb: (p: Point) => Point): State =>
  cast(state.map(l => l.map(z => cb(z))));

export const redraw = (
  canvas: HTMLCanvasElement,
  state: State,
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

export const handleEnd = (canvas: HTMLCanvasElement, state: State) => (
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

export const handleUndo = (canvas: HTMLCanvasElement, state: State) => () => {
  state.splice(-1, 1);
  redraw(canvas, state);
};

export const handleClear = (canvas: HTMLCanvasElement, state: State) => () => {
  state.splice(0, state.length);
  redraw(canvas, state);
};
