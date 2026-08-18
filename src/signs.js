/* ── Sign renderer ────────────────────────────────────────────────────────
   Ontario signs carry meaning in three layers: shape, colour, and symbol.
   The renderer keeps those three separate so the "Decoder" game can quiz
   any one of them independently.                                          */

const INK = {
  red:    '#C8102E',
  white:  '#FFFFFF',
  black:  '#12161C',
  yellow: '#FFCE00',
  orange: '#F97316',
  green:  '#00693E',
  blue:   '#0057B8',
  brown:  '#5C4033',
  fyg:    '#C6E52B'
};

/* shape: outline path in a 128×128 box + how much room the symbol gets */
const SHAPE = {
  octagon:  { d:'M40 6h48l34 34v48l-34 34H40L6 88V40z',      bg:'red',   fg:'white', gs:.62, pad:[26,22,86,102] },
  yield:    { d:'M8 14h112L64 118z',                          bg:'white', fg:'red',   gs:.46, pad:[30,24,98,74],  edge:'red', edgeW:11 },
  diamond:  { d:'M64 3 125 64 64 125 3 64z',                  bg:'yellow',fg:'black', gs:.60, pad:[26,26,102,102], edge:'black', edgeW:4 },
  square:   { d:'M12 12h104v104H12z',   r:8,                  bg:'white', fg:'black', gs:.74, pad:[16,16,112,112], edge:'black', edgeW:4 },
  tall:     { d:'M26 4h76v120H26z',     r:8,                  bg:'white', fg:'black', gs:.62, pad:[30,10,98,118], edge:'black', edgeW:4 },
  wide:     { d:'M4 28h120v72H4z',      r:6,                  bg:'white', fg:'black', gs:.50, pad:[10,32,118,96],  edge:'black', edgeW:4 },
  circle:   { d:'',  circle:true,                             bg:'white', fg:'black', gs:.66, pad:[22,22,106,106], edge:'black', edgeW:4 },
  pentagon: { d:'M64 5 121 50v70H7V50z',                       bg:'fyg',   fg:'black', gs:.60, pad:[14,30,114,114], edge:'black', edgeW:4 },
  triUp:    { d:'M64 8 122 116H6z',                           bg:'orange',fg:'red',   gs:.40, pad:[30,50,98,108], edge:'red', edgeW:12 },
  crossbuck:{ d:'',  crossbuck:true,                          bg:'white', fg:'red',   gs:.5,  pad:[0,0,128,128] },
  shield:   { d:'M64 4c22 0 34 8 46 8v58c0 30-28 42-46 54C46 112 18 100 18 70V12c12 0 24-8 46-8z', bg:'green', fg:'white', gs:.5, pad:[24,20,104,108] }
};

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* Renders one sign to an <svg> string. `size` is the CSS pixel box. */
function signSVG(sign, size, opts){
  opts = opts || {};
  const sh = SHAPE[sign.shape] || SHAPE.square;
  const a  = sign.art || {};
  const bg = INK[a.bg || sh.bg] || (a.bg || sh.bg);
  const fg = INK[a.fg || sh.fg] || (a.fg || sh.fg);
  const edge = a.edge === null ? null : INK[a.edge || sh.edge] || null;
  const edgeW = a.edgeW || sh.edgeW || 0;
  let body = '';

  /* ground */
  if (sh.circle){
    body += `<circle cx="64" cy="64" r="60" fill="${bg}"/>`;
    if (edge) body += `<circle cx="64" cy="64" r="${60-edgeW/2}" fill="none" stroke="${edge}" stroke-width="${edgeW}"/>`;
  } else if (sh.crossbuck){
    body += `<g fill="${INK.white}" stroke="${INK.red}" stroke-width="5">
      <rect x="-30" y="52" width="188" height="24" rx="3" transform="rotate(45 64 64)"/>
      <rect x="-30" y="52" width="188" height="24" rx="3" transform="rotate(-45 64 64)"/></g>`;
  } else {
    const r = sh.r ? ` rx="${sh.r}"` : '';
    body += `<path d="${sh.d}" fill="${bg}"${r}/>`;
    if (bg === INK.black) body += `<path d="${sh.d}" fill="none" stroke="#4A5567" stroke-width="3"${r}/>`;
    if (edge) body += `<path d="${sh.d}" fill="none" stroke="${edge}" stroke-width="${edgeW}" stroke-linejoin="round" transform="translate(64,64) scale(${1-edgeW/128}) translate(-64,-64)"/>`;
  }

  /* symbol + text share the padded box */
  const [x0,y0,x1,y1] = sh.pad;
  const lines = a.t || [];
  const hasG  = !!a.g;
  const gs    = a.gs || sh.gs;

  /* Symbols are placed by their measured ink bounds, not by the 100x100 box they
     were drawn in: centre on the ink centre, scale so the longest side matches a
     single reference size. Every symbol then reads at the same optical weight. */
  const shrink = lines.length ? 0.66 : 1;
  let gScale = 0, gcy = 0;
  if (hasG){
    const bb  = (typeof GBOX !== 'undefined' && GBOX[a.g]) || [6,6,88,88];
    const ink = Math.max(bb[2], bb[3]) || 88;
    gScale = gs * shrink * 88 / ink;
    gcy = (lines.length ? y0 + (y1-y0)*0.34 : 64) + (a.gy||0);
    const ox = bb[0] + bb[2]/2, oy = bb[1] + bb[3]/2;
    body += `<g transform="translate(${(64+(a.gx||0)).toFixed(2)},${gcy.toFixed(2)}) `+
            `scale(${gScale.toFixed(4)}) translate(${(-ox).toFixed(2)},${(-oy).toFixed(2)})" `+
            `style="color:${a.gfg?INK[a.gfg]||a.gfg:fg};--cut:${bg}" fill="currentColor">${G[a.g]||''}</g>`;
  }

  /* prohibition ring / permission ring drawn over the symbol */
  if (a.ring){
    const rr = (hasG ? 54*gs*shrink : 40) * (a.ringS||1);
    const cy = hasG ? gcy : (lines.length ? y0 + (y1-y0)*0.34 : 64) + (a.gy||0);
    const col = a.ring === 'ok' ? INK.green : INK.red;
    body += `<circle cx="64" cy="${cy}" r="${rr}" fill="none" stroke="${col}" stroke-width="${rr*0.24}"/>`;
    if (a.ring === 'no'){
      const k = rr*0.72;
      body += `<line x1="${64-k}" y1="${cy+k}" x2="${64+k}" y2="${cy-k}" stroke="${col}" stroke-width="${rr*0.24}" stroke-linecap="butt"/>`;
    }
  }

  /* text block */
  if (lines.length){
    const top = hasG ? y0 + (y1-y0)*0.60 : y0;
    const h   = (hasG ? y1 - top : y1-y0);
    const n   = lines.length;
    const lh  = h / n;
    lines.forEach((ln,i) => {
      const txt = typeof ln === 'string' ? ln : ln.s;
      const auto = Math.min(lh*0.86, (x1-x0)/Math.max(3.2, txt.length*0.60));
      const fs  = (typeof ln === 'object' && ln.size) ? ln.size : auto;
      const col = (typeof ln === 'object' && ln.c) ? (INK[ln.c]||ln.c) : fg;
      const wt  = (typeof ln === 'object' && ln.w) ? ln.w : 700;
      const y   = top + lh*(i+0.5) + fs*0.35;
      body += `<text x="64" y="${y.toFixed(1)}" font-family="Overpass, Arial Narrow, sans-serif" font-size="${fs.toFixed(1)}" font-weight="${wt}" fill="${col}" text-anchor="middle" letter-spacing="${(fs*0.01).toFixed(2)}">${esc(txt)}</text>`;
    });
  }

  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  const lab = opts.hideLabel ? 'true' : 'false';
  return `<svg viewBox="0 0 128 128" width="${size}" height="${size}"${cls} role="img" aria-hidden="${lab}"${opts.hideLabel?'':` aria-label="${esc(sign.name)}"`}>${body}</svg>`;
}

/* ── Catalogue ───────────────────────────────────────────────────────────
   The signs themselves come from the handbook: BOOK_SIGNS carries the official
   artwork and the book's own wording. The three below are drawn here because
   chapter 3 does not picture them, yet chapter 2 teaches them and the test
   asks about them.                                                        */
const LEGACY_SIGNS = [
{id:'maxSpeed', name:'Maximum speed 50 km/h', cat:'reg', shape:'tall', art:{t:[{s:'MAXIMUM',size:13},{s:'50',size:44}]},
 means:'The speed limit is 50 km/h. It is a maximum, not a target.', tip:'No sign posted in a city or town? Then it is 50.'},
{id:'maxSpeed80', name:'Maximum speed 80 km/h', cat:'reg', shape:'tall', art:{t:[{s:'MAXIMUM',size:13},{s:'80',size:44}]},
 means:'The speed limit is 80 km/h.', tip:'No sign posted outside a built-up area? Then it is 80.'},
{id:'routeMarker', name:'Provincial highway route marker', cat:'info', shape:'shield', art:{bg:'green', fg:'white', t:[{s:'401',size:30}]},
 means:'Identifies the numbered provincial highway you are on.', tip:'The crown shield means a King\u2019s Highway.'}
];

/* BOOK_SIGNS is generated from the handbook; each entry carries a `file` that
   the build resolves to either an inlined data URI or a cached image path. */
const SIGNS = (typeof BOOK_SIGNS !== 'undefined' ? BOOK_SIGNS.slice() : []).concat(LEGACY_SIGNS);

/* Renders a sign: official artwork on a white plate where the handbook has a
   picture, our own SVG for the three it does not. */
function signArt(sign, size, opts){
  opts = opts || {};
  if (!sign.file)  /* plated too, so the three drawn signs sit like the rest */
    return '<span class="plate" style="width:' + size + 'px">' + signSVG(sign, size - 12, opts) + '</span>';
  const src = (typeof SIGNIMG !== 'undefined' && SIGNIMG[sign.file]) || '';
  const alt = opts.hideLabel ? '' : esc(sign.name);
  return '<span class="plate" style="width:' + size + 'px">' +
         '<img src="' + src + '" alt="' + alt + '" loading="lazy" draggable="false"></span>';
}

const SIGN_CATS = {
  reg:   { label:'Regulatory',  blurb:'Tells you the law. Obey it or get a ticket.',  colour:'White with black, red or blue' },
  warn:  { label:'Warning',     blurb:'Warns of a hazard ahead. Adjust now.',          colour:'Yellow diamond, black symbol' },
  temp:  { label:'Temporary',   blurb:'Road work and short-term conditions.',          colour:'Orange diamond, black symbol' },
  info:  { label:'Information', blurb:'Where things are and how far away.',            colour:'Green, blue or brown rectangle' },
  other: { label:'Special',     blurb:'Unique shapes you must know on sight.',         colour:'Varies by sign' }
};

if (typeof module !== 'undefined') module.exports = { SIGNS, SIGN_CATS, signSVG, SHAPE, INK };
