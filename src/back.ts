import * as hs from 'hyperscript';
import * as styles from './styles';
import { render, rendercanvas, DEFAULT_CONFIG } from './render';
import { map, load } from './app';
import { spectrum } from './colors';
import { CANVAS_SIZE, RESULT_SIZE } from './constants';

const h = hs.context();
const RATIO = RESULT_SIZE / CANVAS_SIZE;

const canvas = h('canvas', {
  style: styles.result,
  width: RESULT_SIZE,
  height: RESULT_SIZE,
});

render('ac-back', canvas);

const state = map(load(), z => ({ x: z.x * RATIO, y: z.y * RATIO }));
const config = {
  lineWidth: DEFAULT_CONFIG.lineWidth * RATIO,
  color: spectrum,
};

rendercanvas(canvas, state, config);
