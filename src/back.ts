import * as hs from 'hyperscript';
import * as styles from './styles';
import { redraw, DEFAULT_CONFIG } from './draw';
import { load, map, iterator } from './app';
import { render } from './dom';
import { CANVAS_SIZE, RESULT_SIZE } from './constants';

const h = hs.context();
const RATIO = RESULT_SIZE / CANVAS_SIZE;

const canvas = h('canvas', {
  style: styles.result,
  width: RESULT_SIZE,
  height: RESULT_SIZE,
});

render('ac-back', canvas);

const scaledstate = map(load(), z => ({ x: z.x * RATIO, y: z.y * RATIO }));
const scaledconfig = { lineWidth: DEFAULT_CONFIG.lineWidth * RATIO };
const redrawer = redraw(canvas, scaledconfig)(() => iterator(scaledstate));
redrawer();
