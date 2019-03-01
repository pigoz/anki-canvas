# anki-canvas

This is a touch based canvas for drawing shapes in [AnkiDroid](https://github.com/ankidroid/Anki-Android).

Compared to AnkiDroid's own native whiteboard which is designed to take notes,
this is meant for **use cases where the the user has to draw a shape as an
answer to the card** (for example: **Kanji/Hanzi drawing practice**,
Remembering the Kanji, etc).

It's composed of two JavaScript files:
 - `front.js` can be included in the front card layout. It generates a touch
   based canvas that allows the user to draw into it.
 - `back.js` can be included in the back card layout. It displays a
   smaller readonly version of what was drawn by the user in the front card.

### How to use

Sadly there's no way to install this in a single step, and you will require
Anki for desktop and an Ankiweb account. Follow these steps:

- Go on your computer with desktop Anki
- Grab the release from the [Releases page](https://github.com/pigoz/anki-canvas/releases/latest), and unzip it
- Add `_front.js` and `_back.js` to your Anki's `collection.media` folder. This
  is located in different places depending on platform, but you can easily
  locate it by opening Anki's preferences, going to the `Backups` tab and
  clicking on the `Open backup folder` link. `collection.media` is located in
  the same location of the backup folder, so go up one directory from the
  location Anki opened for you.
- Load the example deck included in the release archive in Anki
- Sync from Anki to Ankiweb (this will upload the JavaScript files as well as
  the new deck)
- Sync from Ankidroid

### Screenshots

<p align="center">
  <img src="https://0x0.st/sgTa.png" width="200" title="whiteboard.js">
  <img src="https://0x0.st/sgTB.png" width="200" title="result.js">
</p>

### Options

You can easily customize some variables picked up by AnkiCanvas. Add the
following script tag in your card layout before the widget's script tag.

```
<script>
window.AnkiCanvasOptions = {
  frontCanvasSize: 300,
  frontLineWidth: 18,
  backCanvasSize: 150,
  backLineWidth: 9,
}
</script>
```
