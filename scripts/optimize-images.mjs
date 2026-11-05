// Converts large PNG photos in public/assets to WebP and rewrites references in src/.
// Run: npm run optimize
import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const dir = 'public/assets'
const converted = []

for (const file of await readdir(dir)) {
  if (!file.endsWith('.png')) continue
  const src = join(dir, file)
  if ((await stat(src)).size < 60_000) continue // keep small icons/swatches as-is
  const out = src.replace(/\.png$/, '.webp')
  await sharp(src).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  await unlink(src)
  converted.push(file.replace(/\.png$/, ''))
  console.log(`${file} -> ${out.split(/[\\/]/).pop()} (${((await stat(out)).size / 1024).toFixed(0)}KB)`)
}

async function rewrite(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) await rewrite(path)
    else if (/\.(jsx?|css)$/.test(entry.name)) {
      let text = await readFile(path, 'utf8')
      const before = text
      for (const name of converted) text = text.replaceAll(`${name}.png`, `${name}.webp`)
      if (text !== before) await writeFile(path, text)
    }
  }
}
await rewrite('src')
console.log(`Converted ${converted.length} images`)
