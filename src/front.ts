import { HDPI_FACTOR, CANVAS_SIZE } from './constants';
import * as hs from 'hyperscript';
import { render, rendercanvas } from './render';
import {
  Point,
  State,
  empty,
  addDrawingPoint,
  addLastDrawingPoing,
  undo,
  clear,
} from './app';
import * as styles from './styles';
import * as icons from './icons';

const h = hs.context();

const canvas = h('canvas', {
  style: styles.canvas,
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
});

const buttons = {
  undo: h('button', { style: styles.action }),
  clear: h('button', { style: styles.action }),
};

const actions = h('div', { style: styles.actions }, Object.values(buttons));
const T = h('div', { style: styles.wrapper }, [canvas, actions]);

render('ac-front', T);

const state = empty();

const hdl = (
  canvas: HTMLCanvasElement,
  state: State,
  action: (state: State, p: Point) => void,
) => (evt: Event): void => {
  evt.preventDefault();

  if (!(evt instanceof TouchEvent)) {
    return;
  }

  const touches = evt.changedTouches;
  const touch = touches[0];
  const point: Point = {
    x: (touch.pageX - canvas.offsetLeft) * HDPI_FACTOR,
    y: (touch.pageY - canvas.offsetTop) * HDPI_FACTOR,
  };

  action(state, point);
};

canvas.addEventListener(
  'touchstart',
  hdl(canvas, state, addDrawingPoint),
  false,
);

canvas.addEventListener(
  'touchmove',
  hdl(canvas, state, addDrawingPoint),
  false,
);

canvas.addEventListener(
  'touchend',
  hdl(canvas, state, addLastDrawingPoing),
  false,
);

function renderloop() {
  rendercanvas(canvas, state);
  requestAnimationFrame(renderloop);
}

renderloop();

canvas.addEventListener('click', e => e.preventDefault(), false);
buttons.undo.addEventListener('click', () => undo(state), false);
buttons.clear.addEventListener('click', () => clear(state), false);
buttons.undo.innerHTML = icons.undo;
buttons.clear.innerHTML = icons.clear;
