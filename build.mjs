import { readFile, writeFile } from 'node:fs/promises';
const matcher = await readFile(new URL('./matcher.mjs', import.meta.url), 'utf8');
const app = await readFile(new URL('./app.js', import.meta.url), 'utf8');
await writeFile(new URL('./bundle.js', import.meta.url), matcher.replace(/export /g, '') + '\n' + app.split('\n').slice(1).join('\n'));
