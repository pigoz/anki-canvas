import { _iso, type Newtype } from './newtype';
import { defaultStorage, dump, isStorageSupported, parse } from './storage';

export type Point = {
  readonly x: number;
  readonly y: number;
};

type S = {
  key: string;
  lines: Array<Point[]>;
  drawing: Point[];
  dirty: boolean;
  down: boolean;
};

export interface State extends Newtype<{ readonly State: unique symbol }, S> {}

const iso = _iso<State>();
const db = defaultStorage();

function save(x: S): void {
  if (!isStorageSupported(db)) {
    return;
  }

  db.setItem(x.key, dump(x));
}

export function load(key: string): State {
  if (!isStorageSupported(db)) {
    return empty(key);
  }
  const item = db.getItem(key);
  if (item === null || item === undefined) {
    return empty(key);
  }
  return iso.wrap({ ...parse(item), key, dirty: true });
}

export function empty(key: string): State {
  const result: S = {
    key,
    lines: [],
    drawing: [],
    dirty: true,
    down: false,
  };

  save(result);
  return iso.wrap(result);
}

export function map(s: State, cb: (x: Point) => Point): State {
  const state = iso.unwrap(s);
  const dup: S = parse(dump(state));
  dup.lines = dup.lines.map(l => l.map(cb));
  return iso.wrap(dup);
}

export function undo(s: State): void {
  const state = iso.unwrap(s);
  state.lines.splice(-1, 1);
  state.dirty = true;
  save(state);
}

export function clear(s: State): void {
  const state = iso.unwrap(s);
  state.lines.splice(0, state.lines.length);
  state.dirty = true;
  save(state);
}

export type Action = (state: State, p: Point) => void;

export function addDrawingPoint(s: State, p: Point): void {
  const state = iso.unwrap(s);

  if (!state.down) {
    return;
  }

  state.drawing.push(p);
  state.dirty = true;
  save(state);
}

export function addFirstDrawingPoint(s: State, p: Point): void {
  const state = iso.unwrap(s);
  state.down = true;
  addDrawingPoint(s, p);
}

export function addLastDrawingPoing(s: State, p: Point): void {
  const state = iso.unwrap(s);
  state.drawing.push(p);
  state.lines.push(state.drawing);
  state.drawing = [];
  state.dirty = true;
  state.down = false;
  save(state);
}

export function willdisplay(s: State, cb: (lines: Array<Point[]>) => boolean) {
  const state = iso.unwrap(s);
  if (state.dirty) {
    const successful = cb(
      [...state.lines, state.drawing].filter(x => x.length > 0),
    );
    state.dirty = !successful;
  }
}
