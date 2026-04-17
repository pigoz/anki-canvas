import * as hs from 'hyperscript';
import {
  type Action,
  addDrawingPoint,
  addFirstDrawingPoint,
  addLastDrawingPoing,
  clear,
  empty,
  type Point,
  type State,
  undo,
} from './app';
import { getColorizer } from './brushcolor';
import * as icons from './icons';
import { canvasKeys } from './kanji';
import { options } from './options';
import { rendercanvas, renderdom } from './render';
import * as styles from './styles';

function buildCanvas(state: State): HTMLElement {
  const h = hs.context();
  const colorScheme = options.colorScheme();

  const canvas = h('canvas', {
    style: styles.canvas(colorScheme),
    width: options.frontCanvasSize * options.hdpiFactor,
    height: options.frontCanvasSize * options.hdpiFactor,
  });

  const buttons = {
    undo: h('button', { style: styles.action(colorScheme) }),
    clear: h('button', { style: styles.action(colorScheme) }),
  };

  const actions = h(
    'div',
    { style: styles.actions(colorScheme) },
    Object.values(buttons),
  );

  const wrapper = h('div', { style: styles.wrapper(colorScheme) }, [
    canvas,
    actions,
  ]);

  const handler =
    (action: Action) =>
    (evt: Event): void => {
      evt.preventDefault();

      if (!(evt instanceof TouchEvent) && !(evt instanceof MouseEvent)) {
        return;
      }

      const touch = evt instanceof TouchEvent ? evt.changedTouches[0] : evt;
      const rect = canvas.getBoundingClientRect();

      const point: Point = {
        x: (touch.pageX - rect.left) * options.hdpiFactor,
        y: (touch.pageY - rect.top) * options.hdpiFactor,
      };

      action(state, point);
    };

  const events: Array<[string, Action]> = [
    ['touchstart', addFirstDrawingPoint],
    ['touchmove', addDrawingPoint],
    ['touchend', addLastDrawingPoing],
    ['mousedown', addFirstDrawingPoint],
    ['mousemove', addDrawingPoint],
    ['mouseup', addLastDrawingPoing],
  ];

  events.forEach(e => {
    canvas.addEventListener(e[0], handler(e[1]), false);
  });

  function renderloop() {
    rendercanvas(canvas, state, {
      colorizer: getColorizer(colorScheme, colorScheme.frontBrushColorizer),
      lineWidth: options.frontLineWidth * options.hdpiFactor,
      colorScheme,
    });
    requestAnimationFrame(renderloop);
  }

  renderloop();

  canvas.addEventListener('click', e => e.preventDefault(), false);
  buttons.undo.addEventListener('click', () => undo(state), false);
  buttons.clear.addEventListener('click', () => clear(state), false);
  buttons.undo.innerHTML = icons.undo;
  buttons.clear.innerHTML = icons.clear;

  return wrapper;
}

function init() {
  const wrappers = canvasKeys().map(k => buildCanvas(empty(k)));
  renderdom('ac-front', wrappers);
}

requestAnimationFrame(init);
