import { options } from '../src/options';

test('fetches default frontCanvasSize', () => {
  expect(options.frontCanvasSize).toEqual(300);
});

test('fetches default frontCanvasSize', () => {
  (window as any).AnkiCanvasOptions = {
    frontCanvasSize: 1337,
  };
  expect(options.frontCanvasSize).toEqual(300);
});

test('fetches default colorscheme', () => {
  expect(options.colorScheme().backBrushColorizer).toEqual('spectrum');
});

test('fetches user defined colorscheme', () => {
  (window as any).AnkiCanvasOptions = {
    colorSchemes: {
      light: {
        backBrushColorizer: 'none',
      },
    },
  };
  expect(options.colorScheme().backBrushColorizer).toEqual('none');

  (window as any).AnkiCanvasOptions = {
    colorSchemes: {
      light: {
        backBrushColorizer: 'contrast',
      },
    },
  };
  expect(options.colorScheme().backBrushColorizer).toEqual('contrast');
});
