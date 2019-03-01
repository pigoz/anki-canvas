import { options } from './options';
import * as hs from 'hyperscript';
import { renderdom, rendercanvas } from './render';
import {
  Point,
  State,
  empty,
  addDrawingPoint,
  addLastDrawingPoing,
  undo,
  clear,
} from './app';
import { black } from './colors';
import * as styles from './styles';
import * as icons from './icons';

const h = hs.context();

const canvas = h('canvas', {
  style: styles.canvas,
  width: options.frontCanvasSize * options.hdpiFactor,
  height: options.frontCanvasSize * options.hdpiFactor,
});

const buttons = {
  undo: h('button', { style: styles.action }),
  clear: h('button', { style: styles.action }),
};

const actions = h('div', { style: styles.actions }, Object.values(buttons));
const T = h('div', { style: styles.wrapper }, [canvas, actions]);

renderdom('ac-front', T);

const state = empty();

const handler = (
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
    x: (touch.pageX - canvas.offsetLeft) * options.hdpiFactor,
    y: (touch.pageY - canvas.offsetTop) * options.hdpiFactor,
  };

  action(state, point);
};

canvas.addEventListener(
  'touchstart',
  handler(canvas, state, addDrawingPoint),
  false,
);

canvas.addEventListener(
  'touchmove',
  handler(canvas, state, addDrawingPoint),
  false,
);

canvas.addEventListener(
  'touchend',
  handler(canvas, state, addLastDrawingPoing),
  false,
);

function renderloop() {
  rendercanvas(canvas, state, {
    colorizer: black,
    lineWidth: options.frontLineWidth,
  });
  requestAnimationFrame(renderloop);
}

renderloop();

canvas.addEventListener('click', e => e.preventDefault(), false);
buttons.undo.addEventListener('click', () => undo(state), false);
buttons.clear.addEventListener('click', () => clear(state), false);
buttons.undo.innerHTML = icons.undo;
buttons.clear.innerHTML = icons.clear;
