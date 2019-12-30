import { options } from '../src/options';

function setopt(o: unknown) {
  (window as any).AnkiCanvasOptions = o;
}

function clearopt() {
  (window as any).AnkiCanvasOptions = null;
}

beforeEach(clearopt);

test('fetches default frontCanvasSize', () => {
  expect(options.frontCanvasSize).toEqual(300);
});

test('fetches default frontCanvasSize', () => {
  setopt({ frontCanvasSize: 1337 });
  expect(options.frontCanvasSize).toEqual(300);
});

test('fetches default colorscheme', () => {
  expect(options.colorScheme().backBrushColorizer).toEqual('spectrum');
});

test('fetches user defined colorscheme', () => {
  setopt({
    colorSchemes: {
      light: {
        backBrushColorizer: 'none',
      },
    },
  });
  expect(options.colorScheme().backBrushColorizer).toEqual('none');

  setopt({
    colorSchemes: {
      light: {
        backBrushColorizer: 'contrast',
      },
    },
  });
  expect(options.colorScheme().backBrushColorizer).toEqual('contrast');
});

test('merges user defined colorschemes', () => {
  setopt({
    colorSchemes: {
      light: {
        backBrushColorizer: 'contrast',
      },
    },
  });
  expect(options.frontCanvasSize).toEqual(300);
  expect(options.colorScheme().frontBrushColorizer).toEqual('none');
});
