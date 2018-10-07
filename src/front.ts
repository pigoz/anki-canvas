import * as hs from 'hyperscript';
import { render } from './dom';
import * as styles from './styles';
import { CANVAS_SIZE } from './constants';
import * as icons from './icons';

import { handleAdd, handleUndo, handleClear, save, empty } from './app';
import {
  handleStart,
  handleMove,
  handleEnd,
  handleCancel,
  redraw,
} from './draw';

const h = hs.context();

const canvas = h('canvas', {
  style: styles.canvas,
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
});

const undo = h('button', { style: styles.action });
undo.innerHTML = icons.undo;
const clear = h('button', { style: styles.action });
clear.innerHTML = icons.clear;

const actions = h('div', { style: styles.actions }, [clear, undo]);
const T = h('div', { style: styles.wrapper }, [canvas, actions]);

render('ac-front', T);

const state = empty();
save(state); // reset saved state on reinit

undo.addEventListener('click', redraw(canvas)(handleUndo(state)), false);
clear.addEventListener('click', redraw(canvas)(handleClear(state)), false);
canvas.addEventListener('touchstart', handleStart(canvas), false);
canvas.addEventListener('touchend', handleEnd(canvas, handleAdd(state)), false);
canvas.addEventListener('touchcancel', handleCancel(), false);
canvas.addEventListener('touchmove', handleMove(canvas), false);
canvas.addEventListener('click', e => e.preventDefault(), false);
