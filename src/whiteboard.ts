import * as hs from 'hyperscript';
import { render } from './dom';
import * as styles from './styles';
import { CANVAS_SIZE } from './constants';

import {
  handleStart,
  handleMove,
  handleEnd,
  handleCancel,
  redraw,
  save,
} from './touch';

const h = hs.context();

const canvas = h('canvas', {
  style: styles.canvas,
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
});

const undoButton = h('button', { style: styles.action }, '❌');
const actions = h('div', { style: styles.actions }, undoButton);
const T = h('div', {}, [canvas, actions]);

render('whiteboard', T);

export type Point = {
  x: number;
  y: number;
};

save([]); // reset saved state on reinit
const state: Array<Point[]> = [];

function handleUndo() {
  state.splice(-1, 1);
  redraw(canvas, state);
}

undoButton.addEventListener('touchstart', handleUndo, false);
canvas.addEventListener('touchstart', handleStart(canvas), false);
canvas.addEventListener('touchend', handleEnd(canvas, state), false);
canvas.addEventListener('touchcancel', handleCancel(), false);
canvas.addEventListener('touchmove', handleMove(canvas), false);
canvas.addEventListener('click', e => e.preventDefault(), false);
