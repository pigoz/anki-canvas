import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

function dist(s: string): string {
  return path.resolve(__dirname, path.join('./dist', s));
}

const m: { [k: string]: string } = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, dist('parcel-manifest.json')))
    .toString(),
);

const anki = path.join(
  os.homedir(),
  '/Library/Application Support/Anki2/User 1/collection.media',
);

const files = ['whiteboard', 'result'];

files.forEach(f => {
  const src = dist(m[`${f}.ts`]);
  const dst = path.join(anki, `_${f}.js`);
  console.log(`${src} -> ${dst}`);
  fs.unlinkSync(dst);
  fs.copyFileSync(src, dst);
});
