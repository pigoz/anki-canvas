# anki-canvas

This is a touch based canvas for drawing shapes in [AnkiDroid](https://github.com/ankidroid/Anki-Android) and Desktop Anki.

Compared to AnkiDroid's own native whiteboard which is designed to take notes,
this is meant for **use cases where the the user has to draw a shape as an
answer to the card** (for example: **Kanji/Hanzi drawing practice**,
Remembering the Kanji, etc).


### Download & Install

Download the premade Anki deck from the [Releases page](https://github.com/pigoz/anki-canvas/releases/latest) and import it into Anki.

### Screenshots

<p align="center">
  <img src="https://0x0.st/zmAi.png" width="200" title="front light colorscheme">
  <img src="https://0x0.st/zmA-.png" width="200" title="back light colorscheme">
  <img src="https://0x0.st/zmAH.png" width="200" title="front dark colorscheme">
  <img src="https://0x0.st/zmAX.png" width="200" title="back dark colorscheme">
</p>

### Options

You can easily customize some variables picked up by AnkiCanvas. Open the card
layout and edit the `AnkiCanvasOptions` JavaScript object in the Front and
Back templates.


The current default options object is the following:

```html
<script>
window.AnkiCanvasOptions = {
  frontCanvasSize: 300,
  frontLineWidth: 7,
  backCanvasSize: 150,
  backLineWidth: 3.5,

  // 'auto' is a special value that will automatically select either 'light' or
  // 'dark' depending on Anki's "Night Mode" status. If you wish to force a
  // colorScheme, you can pass it's name from the colorSchemes settings below.
  colorScheme: 'auto',

  // You can modify the default colorSchemes in the dictionary below, or even
  // add your own colorSchemes beyond light and dark.
  colorSchemes: {
    light: {
      brush: '#000',
      grid: '#dcdcdc',
      gridBg: '#fff',
      buttonIcon: '#464646',
      buttonBg: '#dcdcdc',
      frontBrushColorizer: 'none', // none | spectrum | contrast
      backBrushColorizer: 'spectrum',
    },
    dark: {
      brush: '#fff',
      grid: '#646464',
      gridBg: '#000',
      buttonIcon: '#000',
      buttonBg: '#646464',
      frontBrushColorizer: 'none',
      backBrushColorizer: 'spectrum',
    },
  },
}
</script>
```
