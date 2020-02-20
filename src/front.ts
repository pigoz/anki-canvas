import { options } from './options';
import * as hs from 'hyperscript';
import { renderdom, rendercanvas } from './render';
import {
  Point,
  State,
  Action,
  empty,
  addFirstDrawingPoint,
  addDrawingPoint,
  addLastDrawingPoing,
  undo,
  clear,
} from './app';

import { getColorizer } from './brushcolor';
import * as styles from './styles';
import * as icons from './icons';

function init() {
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

  const T = h('div', { style: styles.wrapper(colorScheme) }, [canvas, actions]);

  renderdom('ac-front', T);

  const state = empty();

  const handler = (canvas: HTMLCanvasElement, state: State, action: Action) => (
    evt: Event,
  ): void => {
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
    canvas.addEventListener(e[0], handler(canvas, state, e[1]), false);
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
}

requestAnimationFrame(init);
