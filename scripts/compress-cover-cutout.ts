// Converts the Vision cutout (PNG with alpha) into a lightweight WebP with alpha, which is what the home page serves.
//
// Usage (after scripts/make-cover-cutout.swift):
//   bun scripts/compress-cover-cutout.ts public/images/cover-cutout.png public/images/cover-cutout.webp
//
// Why: the PNG is ~1.5 MB and next/image needs ~20 s per variant on a cold cache. Uses `sharp`, which is already
// installed as a dependency of Next.js (it is intentionally not listed in package.json).
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	console.error('usage: bun scripts/compress-cover-cutout.ts <input.png> <output.webp>');
	process.exit(1);
}

const info = await sharp(input).webp({quality: 88, alphaQuality: 90, effort: 6}).toFile(output);
console.log(`wrote ${output} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
