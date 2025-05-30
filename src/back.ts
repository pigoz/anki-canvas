import * as hs from "hyperscript";
import { load, map } from "./app";
import { getColorizer } from "./brushcolor";
import { options } from "./options";
import { rendercanvas, renderdom } from "./render";
import * as styles from "./styles";

const h = hs.context();
const RATIO = options.backCanvasSize / options.frontCanvasSize;
const colorScheme = options.colorScheme();

const canvas = h("canvas", {
  style: styles.result(colorScheme),
  width: options.backCanvasSize * options.hdpiFactor,
  height: options.backCanvasSize * options.hdpiFactor,
});

renderdom("ac-back", canvas);

const state = map(load(), z => ({ x: z.x * RATIO, y: z.y * RATIO }));

rendercanvas(canvas, state, {
  lineWidth: options.backLineWidth * options.hdpiFactor,
  colorizer: getColorizer(colorScheme, colorScheme.backBrushColorizer),
  colorScheme,
});
