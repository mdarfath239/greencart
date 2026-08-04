import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const base = "https://greencart-gs.vercel.app";
const dest = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(dest, { recursive: true });

const html = await fetch(`${base}/`).then((r) => r.text());
const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
if (!jsMatch) throw new Error("Could not find main JS bundle");

const js = await fetch(`${base}${jsMatch[1]}`).then((r) => r.text());
const assets = [...js.matchAll(/assets\/([A-Za-z0-9_-]+\.(?:png|svg|jpg|webp))/g)].map((m) => m[1]);
const unique = [...new Set(assets)];

const mapping = {
  "organic_vegitable_image.png": /organic|vegitable|vegetable/i,
  "fresh_fruits_image.png": /fresh.?fruit|fruits_image/i,
  "cold_drinks_image.png": /cold.?drink|bottles/i,
  "instant_food_image.png": /instant|maggi/i,
  "dairy_product_image.png": /dairy/i,
  "bakery_image.png": /bakery/i,
  "grain_image.png": /grain|cereal/i,
  "banner_image.png": /banner_image(?!_sm)/i,
  "banner_image_sm.png": /banner_image_sm|banner.*sm/i,
  "delivery_truck_icon.png": /truck|delivery/i,
};

for (const asset of unique) {
  const url = `${base}/assets/${asset}`;
  const res = await fetch(url);
  if (!res.ok) continue;
  const buf = Buffer.from(await res.arrayBuffer());

  for (const [target, pattern] of Object.entries(mapping)) {
    if (pattern.test(asset)) {
      writeFileSync(join(dest, target), buf);
      console.log(`mapped ${asset} -> ${target} (${buf.length} bytes)`);
    }
  }
}

for (const asset of unique) {
  const url = `${base}/assets/${asset}`;
  const res = await fetch(url);
  if (!res.ok) continue;
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(dest, asset.split("/").pop()), buf);
  console.log(`saved ${asset} (${buf.length} bytes)`);
}

console.log("Assets:", unique.join(", "));
