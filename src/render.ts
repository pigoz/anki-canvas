import { State, willdisplay } from './app';
import { hex, RGB, gray } from './colors';

const DEFAULT_CONFIG = {
  lineWidth: 18,
};

type DrawConfig = {
  colorizer: (_index: number, _count: number) => RGB;
  lineWidth: number;
};

function grid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const color = gray(200);
  const mw = w / 2;
  const mh = h / 2;

  const lines: Array<[number, number, number, number]> = [
    [0, 0, w, h],
    [w, 0, 0, h],
    [mw, 0, mw, h],
    [0, mh, w, mh],
  ];

  ctx.save();
  for (let i = 0; i < lines.length; i++) {
    const x = lines[i];
    ctx.beginPath();
    ctx.setLineDash([w / 80, h / 80]);
    ctx.strokeStyle = hex(color);
    ctx.lineWidth = 1;
    ctx.moveTo(x[0], x[1]);
    ctx.lineTo(x[2], x[3]);
    ctx.stroke();
  }
  ctx.restore();
}

export function rendercanvas(
  canvas: HTMLCanvasElement,
  s: State,
  customConfig: DrawConfig,
) {
  willdisplay(s, lines => {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return false;
    }

    const config = { ...DEFAULT_CONFIG, ...customConfig };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid(ctx, canvas.width, canvas.height);

    ctx.save();
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < lines.length; i++) {
      ctx.beginPath();
      ctx.strokeStyle = hex(config.colorizer(i, lines.length));
      const line = lines[i];
      for (let j = 1; j < line.length; j++) {
        const src = line[j - 1];
        const dst = line[j];
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(dst.x, dst.y);
      }
      ctx.stroke();
    }

    ctx.restore();

    return true;
  });
}

export function renderdom(id: string, t: HTMLElement) {
  const el = document.getElementById(id);
  if (el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(t);
  }
}
