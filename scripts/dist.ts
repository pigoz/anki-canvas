import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dist = path.resolve(__dirname, '..', 'dist');
const anki = path.join(
  os.homedir(),
  'Library/Application Support/Anki2/User 1/collection.media',
);

for (const f of ['front', 'back']) {
  const src = path.join(dist, `${f}.js`);
  const dst = path.join(anki, `_${f}.js`);
  console.log(`${src} -> ${dst}`);
  fs.rmSync(dst, { force: true });
  fs.copyFileSync(src, dst);
}
