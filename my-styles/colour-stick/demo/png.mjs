// node png.mjs <scene> <out.png> [mono]   (run from anywhere; LIB defaults to ../../..)
import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = process.env.LIB || path.resolve(HERE, '../../..');
const { openDemo, closeServer } = await import(path.join(LIB, 'core/render/page.mjs'));
const [scene, out, mono] = process.argv.slice(2);
const { browser, page } = await openDemo(HERE, { q: 'scene=' + scene + (mono ? '&mono=1' : ''), warnings: true });
await page.screenshot({ path: out, type: 'png' }); console.log(out);
await browser.close(); closeServer();
