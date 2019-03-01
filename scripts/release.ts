import * as fs from 'fs';
import * as path from 'path';

function dist(s: string): string {
  return path.resolve(__dirname, path.join('../dist', s));
}

function release(f: string): string {
  return path.resolve(path.join(__dirname, `./anki-canvas/_${f}.js`));
}

const m: { [k: string]: string } = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, dist('parcel-manifest.json')))
    .toString(),
);

['front', 'back'].forEach(f => {
  const src = dist(m[`${f}.ts`]);
  const dst = release(f);
  console.log(`${src} -> ${dst}`);
  fs.copyFileSync(src, dst);
});
