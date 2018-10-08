import { State, willdisplay } from './app';

export const DEFAULT_CONFIG = {
  color: '#000',
  lineWidth: 18,
};

export type DrawConfig = Partial<typeof DEFAULT_CONFIG>;

export function rendercanvas(
  canvas: HTMLCanvasElement,
  s: State,
  customConfig: DrawConfig = {},
) {
  willdisplay(s, lines => {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return false;
    }

    const config = { ...DEFAULT_CONFIG, ...customConfig };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = config.color;

    for (let i = 0; i < lines.length; i++) {
      ctx.beginPath();
      const line = lines[i];
      for (let j = 1; j < line.length; j++) {
        const src = line[j - 1];
        const dst = line[j];
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(dst.x, dst.y);
      }
      ctx.stroke();
    }

    return true;
  });
}

export function render(id: string, t: HTMLElement) {
  const el = document.getElementById(id);
  if (el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(t);
  }
}
