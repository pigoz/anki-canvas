export type Point = {
  x: number;
  y: number;
};

type Priv = Array<Point[]>;
type State = Priv & { _T: 'State' };

const store = window.localStorage || window.sessionStorage;

export const load = (): State => JSON.parse(store.getItem('state') || '[]');

export const save = (x: State): void => {
  store.setItem('state', JSON.stringify(x));
};

export const empty = (): State => JSON.parse('[]');

const cast = (x: Priv): State => x as State;

export const map = (state: State, cb: (p: Point) => Point): State =>
  cast(state.map(l => l.map(z => cb(z))));

export const iterator = (state: State) => (cb: (p: Point[]) => void): void => {
  state.forEach(cb);
};

export const handleAdd = (state: State) => (l: Point[]) => {
  state.push(l);
  save(state);
};

export const handleUndo = (state: State) => () => {
  state.splice(-1, 1);
  save(state);
  return iterator(state);
};

export const handleClear = (state: State) => () => {
  state.splice(0, state.length);
  save(state);
  return iterator(state);
};
