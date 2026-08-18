/* Builds three targets from src/:
     docs/index.html            hosted site — sign images ship as separate cached files
     dist/g1-night-drive.html   claude.ai artifact — everything inlined (no external requests)
     dist/preview.html          local development copy                                    */
const fs = require('fs'), path = require('path');
const P = __dirname + '/src/';
const read = f => fs.readFileSync(P + f, 'utf8');

const SIGN_DIR = path.join(__dirname, 'assets', 'signs');
const signFiles = fs.readdirSync(SIGN_DIR).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
const mime = f => /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
const inlineMap = {}, pathMap = {};
let rawBytes = 0;
signFiles.forEach(f => {
  const buf = fs.readFileSync(path.join(SIGN_DIR, f));
  rawBytes += buf.length;
  inlineMap[f] = 'data:' + mime(f) + ';base64,' + buf.toString('base64');
  pathMap[f]   = 'signs/' + f;
});

const CODE = ['glyphs.js','gbox.js','booksigns.js','signbox.js'];
const REST = ['signs.js','bank.js','bank2.js','bank3.js','bank4.js','bank5.js','bank6.js',
              'extras.js','cards.js','app.js'];
const bundle = map =>
  CODE.map(read).join('\n;\n') + '\n;\n' +
  '/* Sign artwork: The Official MTO Driver\'s Handbook, chapter 3.\n' +
  '   © King\'s Printer for Ontario, reproduced unmodified for non-commercial\n' +
  '   use with credit, per the reproduction terms published on ontario.ca. */\n' +
  'const SIGNIMG = ' + JSON.stringify(map) + ';\n;\n' +
  REST.map(read).join('\n;\n');

const css   = read('fonts.css') + '\n' + read('style.css');
const TITLE = '<title>G1 Night Drive</title>';
const head  = TITLE + '\n<style>' + css + '</style>';
const body  = map => '<div class="app" id="app"></div>\n<script>' + bundle(map) + '\n</' + 'script>';

const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" rx="14" fill="#0F151F"/>' +
  '<rect x="22" y="8" width="20" height="48" rx="7" fill="#161E2B" stroke="#FFB020" stroke-width="2"/>' +
  '<circle cx="32" cy="20" r="5" fill="#FF5A5F"/><circle cx="32" cy="32" r="5" fill="#FFCE00"/>' +
  '<circle cx="32" cy="44" r="5" fill="#2FD07C"/></svg>');
const STANDALONE_HEAD =
  '<meta name="description" content="Ontario G1 practice arcade: every road sign in the official handbook, 311 rules questions, mock exams and a review list.">' +
  '<meta name="theme-color" content="#070A10"><meta name="color-scheme" content="dark">' +
  '<meta name="apple-mobile-web-app-capable" content="yes">' +
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' +
  '<meta name="apple-mobile-web-app-title" content="G1 Night Drive">' +
  '<meta property="og:title" content="G1 Night Drive">' +
  '<meta property="og:description" content="Practise for the Ontario G1 test with the handbook’s own road signs.">' +
  '<link rel="icon" href="' + FAVICON + '"><link rel="apple-touch-icon" href="' + FAVICON + '">';
const doc = (extraHead, map) =>
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  (extraHead || '') + head + '</head><body>' + body(map) + '</body></html>';

/* artifact + local preview: inlined */
fs.writeFileSync(__dirname + '/dist/g1-night-drive.html', head + '\n' + body(inlineMap));
fs.writeFileSync(__dirname + '/dist/preview.html', doc('', inlineMap));

/* hosted site: images alongside, so the HTML stays small and they cache */
fs.mkdirSync(__dirname + '/docs/signs', { recursive: true });
signFiles.forEach(f => fs.copyFileSync(path.join(SIGN_DIR, f), path.join(__dirname, 'docs', 'signs', f)));
fs.writeFileSync(__dirname + '/docs/index.html', doc(STANDALONE_HEAD, pathMap));

const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log('sign images :', signFiles.length, '(' + kb(rawBytes) + ' on disk)');
console.log('artifact    :', kb(fs.statSync(__dirname + '/dist/g1-night-drive.html').size), '(images inlined)');
console.log('docs/index  :', kb(fs.statSync(__dirname + '/docs/index.html').size), '+ docs/signs/');
