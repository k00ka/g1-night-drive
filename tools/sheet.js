/* Renders a contact sheet of every sign, with the real embedded fonts, so the
   artwork can be reviewed at size:   node tools/sheet.js <out.html> [from] [to] */
const fs=require('fs'), path=require('path'), ROOT=path.join(__dirname,'..');
global.G = require(path.join(ROOT,'src/glyphs.js'));
global.GBOX = require(path.join(ROOT,'src/gbox.js'));
const m = eval(fs.readFileSync(path.join(ROOT,'src/signs.js'),'utf8')+';({SIGNS,signSVG})');
const out = process.argv[2], from = +(process.argv[3]||0), to = +(process.argv[4]||m.SIGNS.length);
const fonts = fs.readFileSync(path.join(ROOT,'src/fonts.css'),'utf8');
let h = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{background:#0F151F;color:#93A2B8;font-family:Barlow,sans-serif;font-size:12px;margin:0;padding:16px}
.g{display:grid;grid-template-columns:repeat(8,1fr);gap:12px}
.c{background:#161E2B;border:1px solid #26313F;border-radius:10px;padding:10px 8px;text-align:center}
.c svg{display:block;margin:0 auto 6px}
.c b{display:block;font-weight:500;color:#E9EFF7;font-size:12px;line-height:1.25}
.c i{color:#63728A;font-style:normal;font-size:11px}
</style></head><body><div class="g">`;
m.SIGNS.slice(from,to).forEach((s,i)=>{ h += `<div class="c">${m.signSVG(s,112)}<b>${s.name}</b><i>${from+i} · ${s.id}</i></div>`; });
fs.writeFileSync(out, h+'</div></body></html>');
console.log('wrote', out, to-from, 'signs');
