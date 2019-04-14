const defaults = {
  frontCanvasSize: 300,
  frontLineWidth: 7,
  backCanvasSize: 150,
  backLineWidth: 3.5,
};

const hdpiFactor = window.devicePixelRatio ? window.devicePixelRatio : 2;

type O = Partial<typeof defaults>;

function userOption<K extends keyof O>(k: K): O[K] {
  const userOptions: { [k: string]: unknown } =
    (window as any).AnkiCanvasOptions || {};

  if (typeof userOptions[k] === typeof defaults[k]) {
    return userOptions[k];
  }

  return undefined;
}

export const options = {
  frontCanvasSize: userOption('frontCanvasSize') || defaults.frontCanvasSize,
  frontLineWidth: userOption('frontLineWidth') || defaults.frontLineWidth,
  backCanvasSize: userOption('backCanvasSize') || defaults.backCanvasSize,
  backLineWidth: userOption('backLineWidth') || defaults.backLineWidth,
  hdpiFactor,
};
