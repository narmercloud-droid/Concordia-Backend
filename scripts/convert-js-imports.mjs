import fs from 'fs/promises';
import path from 'path';

const root = path.resolve('./src');
const exts = ['.ts', '.tsx', '.js', '.jsx'];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else if (exts.includes(path.extname(e.name))) {
      await processFile(full);
    }
  }
}

async function processFile(file) {
  let txt = await fs.readFile(file, 'utf8');
  const orig = txt;
  // replace import ... from "... .js" or '.js'
  txt = txt.replace(/(from\s+['\"][^'\"]+?)\.js(['\"])/g, '$1.ts$2');
  // replace dynamic import(..."... .js")
  txt = txt.replace(/(import\(\s*['\"][^'\"]+?)\.js(['\"]\s*\))/g, '$1.ts$2');
  if (txt !== orig) {
    await fs.writeFile(file, txt, 'utf8');
    console.log('Patched', file);
  }
}

walk(root).then(()=>console.log('Done')).catch(err=>{console.error(err); process.exit(1)});
