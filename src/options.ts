import { Colorizers } from './brushcolor';

export type ColorScheme = {
  brush: string;
  grid: string;
  gridBg: string;
  buttonIcon: string;
  buttonBg: string;
  frontBrushColorizer: Colorizers;
  backBrushColorizer: Colorizers;
};

const defaults = {
  frontCanvasSize: 300,
  frontLineWidth: 7,
  backCanvasSize: 150,
  backLineWidth: 3.5,
  colorScheme: 'auto',
  colorSchemes: {
    light: {
      brush: '#000',
      grid: '#dcdcdc',
      gridBg: '#fff',
      buttonIcon: '#464646',
      buttonBg: '#dcdcdc',
      frontBrushColorizer: 'none' as const,
      backBrushColorizer: 'spectrum' as const,
    },
    dark: {
      brush: '#fff',
      grid: '#646464',
      gridBg: '#000',
      buttonIcon: '#000',
      buttonBg: '#646464',
      frontBrushColorizer: 'none' as const,
      backBrushColorizer: 'spectrum' as const,
    },
  },
};

const hdpiFactor = window.devicePixelRatio ?? 2;

type O = Partial<typeof defaults>;

function userOption<K extends keyof O>(k: K): O[K] {
  const userOptions: Record<string, unknown> =
    (window as any).AnkiCanvasOptions ?? {};

  const t = defaults[k];
  if (typeof userOptions[k] === typeof t) {
    return userOptions[k] as typeof t;
  }

  return undefined;
}

function isAnkiInNightMode(): boolean {
  return document.getElementsByClassName('night_mode').length > 0;
}

function colorScheme(): ColorScheme {
  const c = userOption('colorScheme') ?? defaults.colorScheme;
  const schemes: Record<string, ColorScheme> = Object.assign(
    {},
    defaults.colorSchemes,
    userOption('colorSchemes'),
  );
  const auto = isAnkiInNightMode() ? schemes.dark : schemes.light;
  return schemes[c] ?? auto;
}

export const options = {
  frontCanvasSize: userOption('frontCanvasSize') ?? defaults.frontCanvasSize,
  frontLineWidth: userOption('frontLineWidth') ?? defaults.frontLineWidth,
  backCanvasSize: userOption('backCanvasSize') ?? defaults.backCanvasSize,
  backLineWidth: userOption('backLineWidth') ?? defaults.backLineWidth,
  colorScheme,
  hdpiFactor,
};
