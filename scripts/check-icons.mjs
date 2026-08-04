import { fetch } from 'undici';

(async () => {
  const base = 'https://greencart-gs.vercel.app';
  const html = await fetch(base).then(r => r.text());
  const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!jsMatch) return console.log('no js match');
  
  const js = await fetch(base + jsMatch[1]).then(r => r.text());
  
  const allAssets = [...js.matchAll(/assets\/([A-Za-z0-9_-]+\.(?:png|svg|jpg|webp))/g)].map(m => m[1]);
  console.log("All icons matching 'icon':");
  const icons = allAssets.filter(a => a.toLowerCase().includes('icon'));
  console.log([...new Set(icons)]);
  
  // also check if "cart" is anywhere
  console.log("All assets matching 'cart':");
  console.log([...new Set(allAssets.filter(a => a.toLowerCase().includes('cart')))]);
})();
