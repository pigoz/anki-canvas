import { options, ColorScheme } from './options';

export const canvas = (scheme: ColorScheme) => ({
  height: `${options.frontCanvasSize}px`,
  width: `${options.frontCanvasSize}px`,
  border: `2px solid ${scheme.grid}`,
  background: scheme.gridBg,
});

export const result = (scheme: ColorScheme) => ({
  display: 'inline-block',
  height: `${options.backCanvasSize}px`,
  width: `${options.backCanvasSize}px`,
  border: `1px solid ${scheme.grid}`,
  background: scheme.gridBg,
});

export const wrapper = (_scheme: ColorScheme) => ({
  'text-align': 'center',
});

export const actions = (_scheme: ColorScheme) => ({});

export const action = (scheme: ColorScheme) => ({
  'font-size': '22px',
  border: 'none',
  'border-radius': '50%',
  outline: 'none',
  background: scheme.buttonBg,
  color: scheme.buttonIcon,
  display: 'inline-flex',
  width: '44px',
  height: '44px',
  padding: '0',
  'align-items': 'center',
  'justify-content': 'center',
  margin: '0 5px',
});
