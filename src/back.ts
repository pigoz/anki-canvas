import * as hs from 'hyperscript';
import { load, map } from './app';
import { getColorizer } from './brushcolor';
import { canvasKeys } from './kanji';
import { options } from './options';
import { rendercanvas, renderdom } from './render';
import * as styles from './styles';

function buildResult(key: string): HTMLElement {
  const h = hs.context();
  const ratio = options.backCanvasSize / options.frontCanvasSize;
  const colorScheme = options.colorScheme();

  const canvas = h('canvas', {
    style: styles.result(colorScheme),
    width: options.backCanvasSize * options.hdpiFactor,
    height: options.backCanvasSize * options.hdpiFactor,
  });

  const state = map(load(key), z => ({ x: z.x * ratio, y: z.y * ratio }));

  rendercanvas(canvas, state, {
    lineWidth: options.backLineWidth * options.hdpiFactor,
    colorizer: getColorizer(colorScheme, colorScheme.backBrushColorizer),
    colorScheme,
  });

  return canvas;
}

function init() {
  renderdom('ac-back', canvasKeys().map(buildResult));
}

init();
