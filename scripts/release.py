#!/usr/bin/env python3
import os
import genanki

card_id = 1437221308
deck_id = 1900164519

root = os.path.dirname(os.path.realpath(__file__))
dist = os.path.abspath(os.path.join(root, '..', 'dist'))

frontjs = open(os.path.join(dist, 'front.js'), 'r').read()
backjs = open(os.path.join(dist, 'back.js'), 'r').read()

options = '''
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
'''.strip()

q = '''
{1!s}
<p class="keyword">{{{{Keyword}}}} <span class="index">#{{{{Index}}}}</span></p>
<p class="reading">{{{{furigana:Reading}}}}</p>
<div id="ac-front"></div>
<script>{0!s}</script>
'''.format(frontjs, options).strip()

r = '''
{1!s}
<div id=answer>
  <p>
    <span class="comparison-item" id="ac-back"></span>
    <span class="comparison-item">{{{{Diagram}}}}</span>
  </p>

  <p class="story">
    {{{{Kanji}}}} 〜 {{{{furigana:Story}}}}
  </p>

  <div class="vocab">
    {{{{furigana:Vocab}}}}
  </div>
</div>
<script>{0!s}</script>
'''.format(backjs, options).strip()

css = '''
.card {
  font-family: arial;
  font-size: 1.4rem;
  text-align: center;
  background-color: #fffaf0;
  color: #2a1b0a;
}

.index {
  font-size: 1rem;
}

.story {
  margin-top: 2rem;
}

.comparison-item {
  display: inline-block;
  width: 150px;
  height: 150px;
}

.vocab {
  margin-top: 4rem;
  font-size: 1rem;
}
'''.strip()

model = genanki.Model(
  card_id,
  'Japanese Kanji Practice',
  fields=[
    {'name': 'Kanji'},
    {'name': 'Keyword'},
    {'name': 'Reading'},
    {'name': 'Story'},
    {'name': 'Diagram'},
    {'name': 'Page'},
    {'name': 'Vocab'},
    {'name': 'RTK Index'},
    {'name': 'Index'},
  ],
  templates=[
    {
      'name': 'Card 1',
      'qfmt': q,
      'afmt': r,
    },
  ],
  css=css)

deck = genanki.Deck(deck_id, '漢字')

class KanjiNote(genanki.Note):
  @property
  def guid(self):
    return genanki.guid_for(self.fields[0])

note = KanjiNote(
  model=model,
  fields=[
    '籠',
    'basket, cage',
    'かご -  引[ひ]き ＿[こ]もり',
    'An <i>old dragon</i> inside a <i>bamboo</i> <b>cage</b>',
    '<img src="07c60.svg">',
    '56',
    '-',
    '-',
    '244'
  ])

deck.add_note(note)

package = genanki.Package(deck)
package.media_files = ['07c60.svg']
package.write_to_file(os.path.join(root, 'deck.apkg'))

print('wrote "./scripts/deck.apkg"')
