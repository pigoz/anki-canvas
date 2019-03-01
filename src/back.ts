import * as hs from 'hyperscript';
import * as styles from './styles';
import { renderdom, rendercanvas } from './render';
import { map, load } from './app';
import { spectrum } from './colors';
import { options } from './options';

const h = hs.context();
const RATIO = options.backCanvasSize / options.frontCanvasSize;

const canvas = h('canvas', {
  style: styles.result,
  width: options.backCanvasSize * options.hdpiFactor,
  height: options.backCanvasSize * options.hdpiFactor,
});

renderdom('ac-back', canvas);

const state = map(load(), z => ({ x: z.x * RATIO, y: z.y * RATIO }));

rendercanvas(canvas, state, {
  lineWidth: options.backLineWidth,
  colorizer: spectrum,
});
