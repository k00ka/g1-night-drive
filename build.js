const fs = require('fs'), P = __dirname + '/src/';
const read = f => fs.readFileSync(P + f, 'utf8');
const css = read('fonts.css') + '\n' + read('style.css');
const js  = ['glyphs.js','gbox.js','signs.js','bank.js','bank2.js','bank3.js','bank4.js','bank5.js','bank6.js','extras.js','cards.js','app.js']
              .map(read).join('\n;\n');
const TITLE = '<title>G1 Night Drive</title>';
const HEAD  = TITLE + '\n<style>' + css + '</style>';
const BODY  = '<div class="app" id="app"></div>\n<script>' + js + '\n</' + 'script>';

fs.writeFileSync(__dirname + '/dist/g1-night-drive.html', HEAD + '\n' + BODY);
const DOC = (extraHead) =>
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  (extraHead || '') + HEAD + '</head><body>' + BODY + '</body></html>';

fs.writeFileSync(__dirname + '/dist/preview.html', DOC());

/* Standalone build for hosting anywhere: adds the metadata a page needs when it
   is not wrapped by the artifact runtime — description, theme colour, an inline
   favicon, and the iOS bits so it can be added to an iPad home screen. */
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" rx="14" fill="#0F151F"/>' +
  '<rect x="22" y="8" width="20" height="48" rx="7" fill="#161E2B" stroke="#FFB020" stroke-width="2"/>' +
  '<circle cx="32" cy="20" r="5" fill="#FF5A5F"/><circle cx="32" cy="32" r="5" fill="#FFCE00"/>' +
  '<circle cx="32" cy="44" r="5" fill="#2FD07C"/></svg>');
const STANDALONE_HEAD =
  '<meta name="description" content="Ontario G1 practice arcade: 108 road signs, 280 rules questions, mock exams and a review list. Built from the official MTO Driver&apos;s Handbook.">' +
  '<meta name="theme-color" content="#070A10">' +
  '<meta name="color-scheme" content="dark">' +
  '<meta name="apple-mobile-web-app-capable" content="yes">' +
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' +
  '<meta name="apple-mobile-web-app-title" content="G1 Night Drive">' +
  '<meta property="og:title" content="G1 Night Drive">' +
  '<meta property="og:description" content="Practise for the Ontario G1 test: 108 signs, 280 questions, seven games and a full mock exam.">' +
  '<link rel="icon" href="' + FAVICON + '">' +
  '<link rel="apple-touch-icon" href="' + FAVICON + '">';
fs.mkdirSync(__dirname + '/docs', {recursive: true});
fs.writeFileSync(__dirname + '/docs/index.html', DOC(STANDALONE_HEAD));
const kb = n => (n/1024).toFixed(0) + ' KB';
console.log('artifact:', kb(fs.statSync(__dirname+'/dist/g1-night-drive.html').size),
            ' preview:', kb(fs.statSync(__dirname+'/dist/preview.html').size),
            ' docs/index.html:', kb(fs.statSync(__dirname+'/docs/index.html').size));
