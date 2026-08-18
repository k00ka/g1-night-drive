/* ═══════════════════════════════════════════════════════════════════════
   G1 NIGHT DRIVE — engine
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ── storage ─────────────────────────────────────────────────────────── */
const KEY = "g1nightdrive.v1";
const BLANK = {v:1, xp:0, plays:0, days:[], best:{}, topic:{}, signcat:{}, sign:{},
               miss:{}, exams:[], badges:[], seenIntro:false};
let S;
try { S = Object.assign({}, BLANK, JSON.parse(localStorage.getItem(KEY) || "{}")); }
catch(e){ S = Object.assign({}, BLANK); }
/* Signs get removed when the handbook is re-checked. Drop any stored progress
   that points at one, so a retired sign can't wedge the Fix-It list. */
(function pruneRetired(){
  const live = {}; SIGNS.forEach(s => live[s.id] = 1);
  let n = 0;
  Object.keys(S.miss || {}).forEach(k => {
    if (k[0] === "s" && !live[k.slice(2)]) { delete S.miss[k]; n++; }
  });
  Object.keys(S.sign || {}).forEach(id => { if (!live[id]) { delete S.sign[id]; n++; } });
  if (n) try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){}
})();

let saveT = null;
function save(){ clearTimeout(saveT); saveT = setTimeout(()=>{
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }, 120); }

/* ── tiny helpers ────────────────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const h = (t,a,k) => { const e=document.createElement(t); if(a) for(const n in a){
  if(n==="html") e.innerHTML=a[n]; else if(n==="text") e.textContent=a[n];
  else if(n.slice(0,2)==="on") e.addEventListener(n.slice(2),a[n]); else e.setAttribute(n,a[n]); }
  (k||[]).forEach(c=>e.appendChild(c)); return e; };
const esc2 = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const pick = a => a[Math.floor(Math.random()*a.length)];
function sampleOut(arr, n, exclude){ const p = arr.filter(x=>x!==exclude); return shuffle(p).slice(0,n); }
const todayKey = () => new Date().toISOString().slice(0,10);

/* ── progress model ──────────────────────────────────────────────────── */
function bucket(store, id){ if(!store[id]) store[id] = {n:0, r:0, hist:[]}; return store[id]; }
function record(store, id, ok){
  const b = bucket(store,id); b.n++; if(ok) b.r++;
  b.hist.push(ok?1:0); if(b.hist.length>20) b.hist.shift();
}
function accuracy(b){ if(!b || !b.hist.length) return 0;
  return b.hist.reduce((x,y)=>x+y,0)/b.hist.length; }
function coverage(b){ return b ? Math.min(1, b.n/10) : 0; }

/* Readiness: accuracy scaled by how much of each area you have actually done. */
function readiness(){
  const areas = TOPICS.map(t=>S.topic[t.id]).concat(Object.keys(SIGN_CATS).map(c=>S.signcat[c]));
  let sum=0; areas.forEach(b=>{ sum += accuracy(b)*coverage(b); });
  return Math.round(100*sum/areas.length);
}
function levelOf(xp){ return Math.floor(Math.sqrt(xp/60))+1; }
function xpInto(xp){ const l=levelOf(xp), base=60*(l-1)*(l-1), next=60*l*l; return {l, pct:(xp-base)/(next-base), need:next-xp}; }

function addXp(n){ S.xp += n; save(); }
function markDay(){ const t=todayKey(); if(S.days[S.days.length-1]!==t){ S.days.push(t); if(S.days.length>400) S.days.shift(); } }
function dayStreak(){
  if(!S.days.length) return 0;
  let n=0, d=new Date();
  for(;;){ const k=d.toISOString().slice(0,10);
    if(S.days.indexOf(k)>=0){ n++; d.setDate(d.getDate()-1); }
    else if(n===0 && k===todayKey()){ d.setDate(d.getDate()-1); }
    else break; if(n>400) break; }
  return n;
}

/* ── the miss list (Leitner boxes 0-2, retire at 3) ──────────────────── */
function addMiss(key){ const m=S.miss[key]||{box:0,wrong:0}; m.box=0; m.wrong++; m.at=Date.now(); S.miss[key]=m; save(); }
function clearMiss(key, ok){
  const m=S.miss[key]; if(!m) return;
  if(ok){ m.box++; if(m.box>=3) delete S.miss[key]; }
  else { m.box=0; m.wrong++; }
  save();
}
const missCount = () => Object.keys(S.miss).length;
const signsSeen = () => SIGNS.filter(s => S.sign[s.id] && S.sign[s.id].n > 0).length;
const signsRight = () => SIGNS.filter(s => S.sign[s.id] && S.sign[s.id].r > 0).length;

/* ── badges ──────────────────────────────────────────────────────────── */
const BADGES = [
 {id:"first",  e:"🔑", n:"Ignition",       d:"Finish your first round"},
 {id:"sign25", e:"🪧", n:"Sign Reader",     d:"25 signs correct"},
 {id:"sign100",e:"🏁", n:"Sign Fluent",     d:"100 signs correct"},
 {id:"streak10",e:"🔥", n:"On a Roll",      d:"10 in a row in Sign Sprint"},
 {id:"streak20",e:"⚡", n:"Untouchable",    d:"20 in a row in Sign Sprint"},
 {id:"row",    e:"🚦", n:"Referee",         d:"Perfect Right of Way round"},
 {id:"dial",   e:"📏", n:"Tape Measure",    d:"Perfect Distance Dial round"},
 {id:"ladder", e:"🪜", n:"Full G",          d:"Clear all three Licence Ladder rungs"},
 {id:"decoder",e:"🔺", n:"Decoder",         d:"Perfect Shape & Colour round"},
 {id:"exam1",  e:"🎫", n:"Test Ready",      d:"Pass one mock G1 exam"},
 {id:"exam3",  e:"🏆", n:"Locked In",       d:"Pass three mock G1 exams"},
 {id:"perfect",e:"💯", n:"Flawless",        d:"40/40 on a mock exam"},
 {id:"clean",  e:"🧽", n:"Clean Garage",    d:"Empty your Fix-It list"},
 {id:"day3",   e:"📅", n:"Three Days",      d:"Practise three days in a row"},
 {id:"all",    e:"🧠", n:"Full Sweep",      d:"Practise every topic at least once"}
];
function grant(id){
  if(S.badges.indexOf(id)>=0) return;
  S.badges.push(id); save();
  const b = BADGES.find(x=>x.id===id);
  toast(b.e+"  "+b.n+" unlocked");
}
function checkBadges(){
  const signRight = Object.keys(S.sign).reduce((a,k)=>a+S.sign[k].r,0);
  if(S.plays>=1) grant("first");
  if(signRight>=25) grant("sign25");
  if(signRight>=100) grant("sign100");
  const passed = S.exams.filter(e=>e.pass).length;
  if(passed>=1) grant("exam1");
  if(passed>=3) grant("exam3");
  if(dayStreak()>=3) grant("day3");
  if(TOPICS.every(t=>S.topic[t.id] && S.topic[t.id].n>0)) grant("all");
}
function toast(msg){
  const t = h("div",{class:"toast",text:msg}); document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2700);
}
function popScore(txt, x, y){
  const p = h("div",{class:"pop",text:txt}); p.style.left=x+"px"; p.style.top=y+"px";
  document.body.appendChild(p); setTimeout(()=>p.remove(), 1000);
}

/* ── question factories ──────────────────────────────────────────────── */
const CAT_ORDER = ["reg","warn","temp","info","other"];

function signQuestion(sign, style){
  const sameCat = SIGNS.filter(s=>s.cat===sign.cat && s.id!==sign.id);
  const pool = sameCat.length>=3 ? sameCat : SIGNS.filter(s=>s.id!==sign.id);
  const mode = style || (Math.random()<0.72 ? "name" : "means");
  if(mode==="means"){
    const wrong = shuffle(pool).slice(0,3);
    const opts = shuffle([sign].concat(wrong));
    return { stage:'<div class="signwrap">'+signSVG(sign,168)+"</div>",
      prompt:"What does this sign mean?",
      opts: opts.map(s=>esc2(s.means)), c: opts.indexOf(sign),
      why: sign.name + " — " + sign.tip, ref:"s:"+sign.id, area:{store:"signcat",id:sign.cat} };
  }
  const wrong = shuffle(pool).slice(0,3);
  const opts = shuffle([sign].concat(wrong));
  return { stage:'<div class="signwrap">'+signSVG(sign,168)+"</div>",
    prompt:"Which sign is this?",
    opts: opts.map(s=>esc2(s.name)), c: opts.indexOf(sign),
    why: sign.means+" "+sign.tip, ref:"s:"+sign.id, area:{store:"signcat",id:sign.cat} };
}

/* reverse: name given, pick the sign face */
function signPickQuestion(sign){
  const sameCat = SIGNS.filter(s=>s.cat===sign.cat && s.id!==sign.id);
  const pool = sameCat.length>=3 ? sameCat : SIGNS.filter(s=>s.id!==sign.id);
  const opts = shuffle([sign].concat(shuffle(pool).slice(0,3)));
  return { stage:'<p class="prompt"><span class="k">Find the sign that means</span><br>'+esc2(sign.name)+"</p>",
    prompt:"", optHtml:true,
    opts: opts.map(s=>signSVG(s,84,{hideLabel:true})), c: opts.indexOf(sign),
    why: sign.means+" "+sign.tip, ref:"s:"+sign.id, area:{store:"signcat",id:sign.cat} };
}

function ruleQuestion(i){
  const q = BANK[i];
  const order = shuffle([0,1,2,3]);
  const opts = order.map(k=>esc2(q.a[k]));
  return { stage:'<p class="prompt">'+esc2(q.q)+"</p>", prompt:"",
    opts, c: order.indexOf(q.c), why:q.w, ref:"q:"+i, area:{store:"topic",id:q.t} };
}

function numberQuestion(i){
  const n = NUMBERS[i];
  const opts = shuffle(n.opts);
  const fmt = v => n.u==="$" ? "$"+v.toLocaleString() : v+" "+n.u;
  return { stage:'<p class="prompt"><span class="k">How far / how much?</span><br>'+esc2(n.q)+"</p>",
    prompt:"", opts: opts.map(fmt), c: opts.indexOf(n.v), why:n.w,
    ref:"n:"+i, area:{store:"topic",id:n.t||"along"} };
}

const DECODER = [
 {q:"An eight-sided sign always means:", a:["Stop","Yield","School","Railway"], c:0, w:"The octagon is reserved for STOP — you can read it by shape alone at night."},
 {q:"An upside-down triangle means:", a:["Stop","Yield","Warning","No entry"], c:1, w:"Yield: let others go first, stop only if you must."},
 {q:"A YELLOW diamond means:", a:["A rule you must obey","A hazard ahead","Road work","A destination"], c:1, w:"Yellow diamond = warning."},
 {q:"An ORANGE diamond means:", a:["A permanent rule","A temporary road-work condition","A hospital","A school"], c:1, w:"Orange is always temporary."},
 {q:"A five-sided fluorescent yellow-green sign means:", a:["Construction","School zone or crossing","Railway","Hospital"], c:1, w:"Pentagon + that green-yellow glow = children."},
 {q:"A red-and-white X-shaped sign means:", a:["Dead end","Railway crossing","Intersection ahead","No entry"], c:1, w:"The crossbuck marks the tracks themselves."},
 {q:"A GREEN circle on a sign means:", a:["The activity shown is banned","You may or must do the activity shown","Warning","Stop"], c:1, w:"Green circle = permitted."},
 {q:"A RED circle with a diagonal line means:", a:["Permitted","Prohibited","Warning","Temporary"], c:1, w:"Red circle + slash = do not do the thing shown."},
 {q:"A GREEN rectangle with white letters gives you:", a:["A warning","A rule","Directions and distances","Service information"], c:2, w:"Green = where you are going."},
 {q:"A BLUE sign gives you:", a:["Warnings","Services for travellers","Rules","Park information"], c:1, w:"Blue = hospitals, fuel, food, airports."},
 {q:"A BROWN sign points to:", a:["Hospitals","Parks, recreation and culture","Construction","Freeway exits"], c:1, w:"Brown = campgrounds, parks, historic sites."},
 {q:"An ORANGE triangle with a red border on a vehicle means:", a:["Dangerous goods","It travels at 40 km/h or less","It is a wide load","It is a school vehicle"], c:1, w:"Slow-moving vehicle: tractors, buggies, road machines."},
 {q:"A white rectangular sign with black letters is usually:", a:["A warning","A regulatory sign — the law","Information","Temporary"], c:1, w:"White + black = a rule you must obey."},
 {q:"A yellow diamond warns you. What does it NOT do?", a:["Tell you a hazard is ahead","Order you to stop","Suggest you slow down","Describe the road ahead"], c:1, w:"Warnings describe, regulatory signs command."}
];
function decoderQuestion(i){
  const d = DECODER[i]; const order = shuffle([0,1,2,3]);
  return { stage:'<p class="prompt">'+esc2(d.q)+"</p>", prompt:"",
    opts: order.map(k=>esc2(d.a[k])), c: order.indexOf(d.c), why:d.w,
    ref:"c:"+i, area:{store:"topic",id:"lights"} };
}

/* ── plan-view intersections ─────────────────────────────────────────── */
function planSVG(sc){
  const W=300, C=150, RW=86, half=RW/2;
  const road = '#1D2531', edge='#2C3849';
  let s = '<svg class="plan" viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="Plan view of the intersection">';
  s += '<rect width="300" height="300" fill="#0B1119"/>';
  if(sc.kind==="driveway"){
    s += '<rect x="0" y="'+(C-half)+'" width="300" height="'+RW+'" fill="'+road+'"/>';
    s += '<rect x="0" y="'+(C+half)+'" width="300" height="10" fill="#243040"/>';   /* sidewalk */
    s += '<rect x="'+(C-16)+'" y="'+(C+half+10)+'" width="32" height="'+(150-half-10)+'" fill="'+road+'"/>';
    s += '<path d="M0 '+C+' H300" stroke="#C8A227" stroke-width="2" stroke-dasharray="12 10"/>';
  } else {
    s += '<rect x="0" y="'+(C-half)+'" width="300" height="'+RW+'" fill="'+road+'"/>';
    s += '<rect x="'+(C-half)+'" y="0" width="'+RW+'" height="300" fill="'+road+'"/>';
    s += '<path d="M0 '+C+' H'+(C-half)+' M'+(C+half)+' '+C+' H300" stroke="#C8A227" stroke-width="2" stroke-dasharray="12 10"/>';
    s += '<path d="M'+C+' 0 V'+(C-half)+' M'+C+' '+(C+half)+' V300" stroke="#C8A227" stroke-width="2" stroke-dasharray="12 10"/>';
  }
  if(sc.kind==="roundabout"){
    s += '<circle cx="'+C+'" cy="'+C+'" r="60" fill="'+road+'"/>';
    s += '<circle cx="'+C+'" cy="'+C+'" r="30" fill="#14351F" stroke="'+edge+'" stroke-width="3"/>';
    s += '<path d="M'+(C+46)+' '+C+' A46 46 0 1 0 '+C+' '+(C-46)+'" fill="none" stroke="#8B98AC" stroke-width="3" stroke-dasharray="7 8"/>';
    s += '<path d="M'+C+' '+(C-56)+' l10 16 -20 0z" fill="#8B98AC"/>';
  }
  /* control devices */
  const stopSign = (x,y)=>'<g transform="translate('+x+','+y+') scale(.14) translate(-64,-64)">'+
    signSVG({shape:"octagon",art:{t:[{s:"STOP",size:34}]},name:"stop"},128,{hideLabel:true}).replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")+'</g>';
  if(sc.kind==="allway"){
    [[C-half-14,C+half+14],[C+half+14,C-half-14],[C-half-14,C-half-14],[C+half+14,C+half+14]].forEach(p=>{ s+=stopSign(p[0],p[1]); });
  }
  if(sc.kind==="light"){
    const cols = {green:["#2FD07C","#22303f","#22303f"], red:["#22303f","#22303f","#FF5A5F"],
                  advgreen:["#2FD07C","#22303f","#22303f"], dark:["#22303f","#22303f","#22303f"]};
    const c = cols[sc.light]||cols.green;
    s += '<g transform="translate('+(C+half+22)+','+(C-half-30)+')"><rect x="-13" y="-34" width="26" height="68" rx="7" fill="#161E2B" stroke="'+edge+'"/>'+
         '<circle cx="0" cy="-20" r="8" fill="'+c[2]+'"/><circle cx="0" cy="0" r="8" fill="'+c[1]+'"/>'+
         '<circle cx="0" cy="20" r="8" fill="'+c[0]+'"/></g>';
    if(sc.light==="advgreen") s += '<text x="'+(C+half+22)+'" y="'+(C-half+52)+'" fill="#2FD07C" font-family="Barlow Condensed" font-size="16" font-weight="800" text-anchor="middle">ADV</text>';
    if(sc.light==="dark") s += '<text x="'+(C+half+22)+'" y="'+(C-half+52)+'" fill="#93A2B8" font-family="Barlow Condensed" font-size="15" font-weight="800" text-anchor="middle">OFF</text>';
  }
  if(sc.kind==="pxo"){
    s += '<rect x="'+(C-half)+'" y="'+(C-46)+'" width="'+RW+'" height="4" fill="#E9EFF7"/>';
    s += '<rect x="'+(C-half)+'" y="'+(C+42)+'" width="'+RW+'" height="4" fill="#E9EFF7"/>';
    s += '<text x="'+C+'" y="'+(C+8)+'" fill="#E9EFF7" font-family="Barlow Condensed" font-size="34" font-weight="800" text-anchor="middle">X</text>';
  }
  if(sc.ped){
    const px = sc.kind==="driveway" ? C-46 : C, py = sc.kind==="driveway" ? C+half+5 : C-4;
    s += '<g transform="translate('+px+','+py+') scale(.34) translate(-50,-50)" fill="#FFD24A" style="--cut:#0B1119">'+G.ped+'</g>';
  }
  if(sc.kind==="schoolbus"){
    s += '<g transform="translate('+(C+22)+',96) rotate(-90) scale(.52) translate(-50,-50)" fill="#FFCE00" style="--cut:#0B1119">'+G.schoolBus+'</g>';
    s += '<circle cx="'+(C+40)+'" cy="70" r="6" fill="#FF5A5F"/><circle cx="'+(C+4)+'" cy="70" r="6" fill="#FF5A5F"/>';
  }
  if(sc.kind==="emergency"){
    s += '<g transform="translate('+(C+18)+',272) rotate(-90) scale(.44) translate(-50,-50)" fill="#E9EFF7" style="--cut:#0B1119">'+G.carPlain+'</g>';
    s += '<circle cx="'+(C+30)+'" cy="290" r="6" fill="#FF5A5F"/><circle cx="'+(C+6)+'" cy="290" r="6" fill="#4EA8FF"/>';
  }
  /* cars */
  const spots = { s:[C+18,244,0], n:[C-18,56,180], w:[56,C+18,90], e:[244,C-18,270] };
  (sc.cars||[]).forEach(car=>{
    const p = spots[car.leg]; if(!p) return;
    const col = car.you ? "#4EA8FF" : "#FF5A5F";
    s += '<g transform="translate('+p[0]+','+p[1]+') rotate('+p[2]+')">'+
         '<rect x="-13" y="-22" width="26" height="44" rx="7" fill="'+col+'"/>'+
         '<rect x="-9" y="-14" width="18" height="12" rx="3" fill="rgba(0,0,0,.32)"/>'+
         '<rect x="-9" y="6" width="18" height="10" rx="3" fill="rgba(0,0,0,.22)"/>'+
         (car.you?'<circle cx="0" cy="-30" r="4" fill="#FFD24A"/>':'')+'</g>';
    if(car.you) s += '<text x="'+p[0]+'" y="'+(p[1]+ (car.leg==="s"?38:(car.leg==="n"?-30:5)))+
      '" fill="#4EA8FF" font-family="Barlow Condensed" font-size="15" font-weight="800" text-anchor="middle">YOU</text>';
  });
  s += '</svg>';
  return s;
}
function scenarioQuestion(i){
  const sc = SCENARIOS[i]; const order = shuffle([0,1,2,3]);
  return { stage:'<div class="signwrap">'+planSVG(sc)+'</div><p class="prompt">'+esc2(sc.q)+"</p>",
    prompt:"", opts: order.map(k=>esc2(sc.a[k])), c: order.indexOf(sc.c), why:sc.w,
    ref:"r:"+sc.id, area:{store:"topic",id:sc.t||"intersections"} };
}

/* rebuild any question from its stored key (used by the Fix-It list) */
function fromRef(ref){
  const k = ref.slice(0,1), v = ref.slice(2);
  if(k==="q") return ruleQuestion(+v);
  if(k==="n") return numberQuestion(+v);
  if(k==="c") return decoderQuestion(+v);
  if(k==="r"){ const i=SCENARIOS.findIndex(s=>s.id===v); return i<0?null:scenarioQuestion(i); }
  if(k==="s"){ const s=SIGNS.find(x=>x.id===v); return s?signQuestion(s):null; }
  return null;
}
window.__G1 = {S, readiness};   /* handy in the console, harmless in play */

/* one row of the "what you missed" lists: the sign or the question, the right
   answer, and why — so a wrong answer teaches something on the spot */
function missRow(ref, why, extra){
  const k = ref ? ref[0] : "";
  let thumb="", title="", answer="";
  if(k==="s"){ const s=SIGNS.find(y=>y.id===ref.slice(2));
    if(s){ thumb=signSVG(s,46,{hideLabel:true}); title=s.name; answer=s.means; } }
  else if(k==="q"){ const b=BANK[+ref.slice(2)]; if(b){ title=b.q; answer=b.a[b.c]; } }
  else if(k==="n"){ const n=NUMBERS[+ref.slice(2)]; if(n){ title=n.q; answer=(n.u==="$"?"$"+n.v.toLocaleString():n.v+" "+n.u); } }
  else if(k==="r"){ const s=SCENARIOS.find(y=>y.id===ref.slice(2)); if(s){ title=s.q; answer=s.a[s.c]; } }
  else if(k==="c"){ const d=DECODER[+ref.slice(2)]; if(d){ title=d.q; answer=d.a[d.c]; } }
  const el = h("div",{class:"row miss"});
  el.innerHTML = (thumb ? '<span class="thumb">'+thumb+"</span>" : "")+
    '<div class="nm"><b>'+esc2(title)+"</b><em>"+esc2(answer)+"</em>"+
    (why ? "<small>"+esc2(why)+"</small>" : "")+"</div>"+(extra||"");
  return el;
}

/* ═══ ROUND RUNNER ═══════════════════════════════════════════════════════ */
let activeTimer = null;
function stopTimers(){ if(activeTimer){ clearInterval(activeTimer); activeTimer=null; } }

function play(cfg){
  stopTimers();
  const app = $("#app");
  let i=0, score=0, combo=0, bestCombo=0, right=0, answered=false, log=[];
  let left = cfg.seconds || 0;
  const total = cfg.questions ? cfg.questions.length : 0;

  app.innerHTML = "";
  app.appendChild(hudBar(cfg.title, true));
  const bar   = h("div",{class:"playbar"});
  const timer = h("div",{class:"timer"},[h("i")]);
  const meter = h("div",{class:"meter"});
  const stage = h("div",{class:"stage"});
  const ansEl = h("div",{class:"answers"});
  const whyEl = h("div");
  app.appendChild(bar);
  if(cfg.seconds) app.appendChild(timer);
  if(total && total<=24) app.appendChild(meter);
  app.appendChild(stage); app.appendChild(ansEl);
  app.appendChild(h("div",{class:"kbhint",text:"Keys 1\u20134 or A\u2013D"}));
  app.appendChild(whyEl);

  if(total<=24) for(let k=0;k<total;k++) meter.appendChild(h("i"));

  function paintBar(){
    const bits = [];
    const cq = cfg.questions ? cfg.questions[Math.min(i,total-1)] : null;
    if(cq && cq.half){ bits.push("<span>"+cq.half.toUpperCase()+" "+(cq.half==="signs"?i+1:i-19)+" / 20</span>"); }
    else if(total) bits.push('<span>'+(Math.min(i+1,total))+" / "+total+"</span>");
    else bits.push("<span>Signs</span>");
    if(cfg.combo && combo>1) bits.push('<span class="combo">&times;'+comboMult()+" streak "+combo+"</span>");
    bar.innerHTML = bits.join(" ")+'<span class="score num">'+score+"</span>";
  }
  const comboMult = () => Math.min(5, 1+Math.floor(combo/4));

  if(cfg.seconds){
    activeTimer = setInterval(()=>{
      left--; const pct = Math.max(0,left/cfg.seconds*100);
      timer.firstChild.style.width = pct+"%";
      timer.classList.toggle("low", left<=10);
      if(left<=0){ stopTimers(); finish(); }
    },1000);
    timer.firstChild.style.width = "100%";
  }

  function nextQ(){
    answered=false; whyEl.innerHTML="";
    const q = cfg.questions ? cfg.questions[i] : cfg.next(i);
    if(!q){ finish(); return; }
    if(cfg.questions && i>=total){ finish(); return; }
    stage.className = "stage" + (q.stage.indexOf("signwrap")<0 ? " text" : "");
    stage.innerHTML = '<div class="beam"></div><div class="road"></div>'+q.stage;
    ansEl.className = "answers" + (q.optHtml ? " two" : "");
    ansEl.innerHTML = "";
    q.opts.forEach((o,k)=>{
      const b = h("button",{class:"ans", type:"button"});
      b.innerHTML = '<span class="key">'+"ABCD"[k]+"</span><span>"+o+"</span>";
      b.addEventListener("click", ev=>answer(q,k,b,ev));
      ansEl.appendChild(b);
    });
    paintBar();
  }

  function answer(q, k, btn, ev){
    if(answered) return; answered=true;
    const ok = k===q.c;
    const kids = Array.prototype.slice.call(ansEl.children);
    kids.forEach((el,n)=>{ el.disabled=true;
      if(n===q.c) el.classList.add("right");
      else if(n===k) el.classList.add("wrong");
      else el.classList.add("faded"); });

    /* progress bookkeeping */
    if(q.area){ record(q.area.store==="topic"?S.topic:S.signcat, q.area.id, ok); }
    if(q.ref && q.ref[0]==="s") record(S.sign, q.ref.slice(2), ok);
    if(ok){ right++; combo++; bestCombo=Math.max(bestCombo,combo); clearMiss(q.ref, true); }
    else  { combo=0; addMiss(q.ref); }
    log.push({ref:q.ref, ok:ok, q:q});

    let gained = 0;
    if(ok){
      gained = cfg.combo ? 100*comboMult() : 100;
      score += gained;
      if(cfg.seconds){ left = Math.min(cfg.seconds, left+2); }
      if(ev && ev.clientX) popScore("+"+gained, ev.clientX, ev.clientY-20);
    } else if(cfg.seconds){ left = Math.max(1, left-3); }
    if(total && total<=24 && meter.children[i]) meter.children[i].className = ok?"on":"miss";
    paintBar();

    if(cfg.silent){ i++; setTimeout(nextQ, 140); return; }
    if(cfg.fast){
      if(!ok){
        whyEl.innerHTML = '<div class="why wrong"><b>'+esc2(q.opts[q.c].replace(/<[^>]+>/g,"")||"Answer")+"</b><p>"+esc2(q.why)+"</p></div>";
        i++; setTimeout(nextQ, 2100);
      } else { i++; setTimeout(nextQ, 520); }
      return;
    }
    const box = h("div",{class:"why "+(ok?"right":"wrong")});
    box.innerHTML = "<b>"+(ok?"Correct":"Not quite")+"</b><p>"+esc2(q.why)+"</p>";
    const nb = h("button",{class:"btn go wide", type:"button", text: (total && i>=total-1) ? "See results" : "Next"});
    nb.addEventListener("click", ()=>{ i++; nextQ(); });
    box.appendChild(h("div",{class:"btnrow"},[nb]));
    whyEl.appendChild(box);
    nb.focus({preventScroll:true});
  }

  function finish(){
    stopTimers();
    S.plays++; markDay();
    const asked = log.length;
    const acc = asked ? right/asked : 0;
    const xp = Math.round(score/10) + right*4 + (cfg.mode==="exam" ? 0 : 0);
    addXp(xp);
    if(cfg.mode){
      const prev = S.best[cfg.mode]||0;
      if(score>prev){ S.best[cfg.mode]=score; }
    }
    if(cfg.mode==="sprint"){ if(bestCombo>=10) grant("streak10"); if(bestCombo>=20) grant("streak20"); }
    if(cfg.mode==="row" && asked && right===asked) grant("row");
    if(cfg.mode==="dial" && asked && right===asked) grant("dial");
    if(cfg.mode==="decoder" && asked && right===asked) grant("decoder");
    if(cfg.mode==="ladder" && acc>=0.8) grant("ladder");
    if(cfg.mode==="review" && missCount()===0) grant("clean");
    checkBadges(); save();
    if(cfg.onDone) cfg.onDone({score, right, asked, acc, bestCombo, xp, log});
    else results({score, right, asked, acc, bestCombo, xp, log, title:cfg.title, again:cfg.again});
  }

  document.onkeydown = function(e){
    if(answered || !ansEl.children.length) return;
    const map = {"1":0,"2":1,"3":2,"4":3,"a":0,"b":1,"c":2,"d":3};
    const k = map[e.key.toLowerCase()];
    if(k!=null && ansEl.children[k]){ e.preventDefault(); ansEl.children[k].click(); }
  };
  nextQ();
}

/* ═══ RESULT SCREENS ════════════════════════════════════════════════════ */
function results(r){
  document.onkeydown = null;
  const app = $("#app"); app.innerHTML="";
  app.appendChild(hudBar("Round over"));
  const pct = Math.round(r.acc*100);
  const verdict = pct>=90 ? "Sharp" : pct>=80 ? "Test ready" : pct>=60 ? "Getting there" : "Needs work";
  const box = h("div",{class:"panel result"});
  box.innerHTML =
    '<div class="big num">'+r.score+"</div>"+
    '<div class="verdict '+(pct>=80?"pass":"fail")+'">'+verdict+"</div>"+
    "<p>"+r.right+" of "+r.asked+" correct &middot; "+pct+"%"+
      (r.bestCombo>2 ? " &middot; best streak "+r.bestCombo : "")+
      " &middot; +"+r.xp+" XP</p>";
  const again = h("button",{class:"btn go",type:"button",text:"Run it again"});
  again.addEventListener("click", ()=> r.again ? r.again() : home());
  const rev = h("button",{class:"btn",type:"button",text:"Fix-It list ("+missCount()+")"});
  rev.addEventListener("click", reviewView);
  const hm = h("button",{class:"btn",type:"button",text:"Home"});
  hm.addEventListener("click", home);
  box.appendChild(h("div",{class:"btnrow"},[again, rev, hm]));
  app.appendChild(box);

  const wrong = r.log.filter(x=>!x.ok);
  if(wrong.length){
    const s = h("div",{class:"sec"});
    s.appendChild(h("h2",{text:"What tripped you up"}));
    const rows = h("div",{class:"rows"});
    wrong.forEach(x=>rows.appendChild(missRow(x.ref, x.q.why)));
    s.appendChild(rows); app.appendChild(s);
  }
  window.scrollTo(0,0);
}

/* ═══ CHROME ════════════════════════════════════════════════════════════ */
function hudBar(title, showScore){
  const bar = h("div",{class:"hud"});
  const back = h("button",{class:"back",type:"button",html:"&larr; Home"});
  back.addEventListener("click", ()=>{ stopTimers(); document.onkeydown=null; home(); });
  bar.appendChild(back);
  bar.appendChild(h("div",{class:"title",text:title||""}));
  const lv = xpInto(S.xp);
  bar.appendChild(h("div",{class:"chip xp",text:"LV "+lv.l}));
  return bar;
}
function gaugeSVG(pct){
  const len = 207.3, on = len*Math.max(0,Math.min(1,pct/100));
  return '<svg viewBox="0 0 160 104" width="152" height="99" role="img" aria-label="Exam readiness '+pct+' percent">'+
   '<path d="M14 86 A66 66 0 1 1 146 86" fill="none" stroke="#1F2937" stroke-width="15" stroke-linecap="round"/>'+
   '<path d="M14 86 A66 66 0 1 1 146 86" fill="none" stroke="url(#gg)" stroke-width="15" stroke-linecap="round" '+
     'stroke-dasharray="'+on.toFixed(1)+" "+len+'"/>'+
   '<defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF7A45"/>'+
   '<stop offset=".55" stop-color="#FFB020"/><stop offset="1" stop-color="#2FD07C"/></linearGradient></defs>'+
   '<text x="80" y="86" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="15" fill="#63728A">READY</text>'+
   "</svg>";
}

/* ═══ WEIGHTED PICKING — practise what you are worst at ═════════════════ */
function weightedSigns(n){
  const scored = SIGNS.map(s=>{
    const b = S.sign[s.id];
    const acc = (b && b.n) ? b.r/b.n : null;
    let w = acc===null ? 1.15 : (1-acc)*1.9 + 0.15;
    if(S.miss["s:"+s.id]) w += 1.4;
    return {s, w: w + Math.random()*0.75};
  });
  scored.sort((a,b)=>b.w-a.w);
  return shuffle(scored.slice(0, Math.min(SIGNS.length, Math.max(n*2, n+10)))).slice(0,n).map(x=>x.s);
}
function ruleIndexes(){ return BANK.map((q,i)=>i); }
function weightedRules(n, topic){
  let idx = ruleIndexes();
  if(topic) idx = idx.filter(i=>BANK[i].t===topic);
  const scored = idx.map(i=>{
    const b = S.topic[BANK[i].t];
    const acc = (b && b.hist.length) ? accuracy(b) : null;
    let w = acc===null ? 1.1 : (1-acc)*1.6 + 0.2;
    if(S.miss["q:"+i]) w += 1.5;
    return {i, w: w + Math.random()*0.9};
  });
  scored.sort((a,b)=>b.w-a.w);
  return shuffle(scored.slice(0, Math.min(idx.length, Math.max(n*2, n+10)))).slice(0,n).map(x=>x.i);
}
/* exam rules must span the whole book, not just your weak spots */
function examRules(n){
  const byTopic = {}; TOPICS.forEach(t=>byTopic[t.id]=[]);
  BANK.forEach((q,i)=>{ if(byTopic[q.t]) byTopic[q.t].push(i); });
  const keys = shuffle(TOPICS.map(t=>t.id)), out=[]; let guard=0;
  while(out.length<n && guard++<400){
    for(const k of keys){
      const arr = byTopic[k];
      if(!arr.length) continue;
      const j = Math.floor(Math.random()*arr.length);
      const v = arr.splice(j,1)[0];
      if(out.indexOf(v)<0) out.push(v);
      if(out.length>=n) break;
    }
  }
  return shuffle(out);
}

/* ═══ ROUNDS ════════════════════════════════════════════════════════════ */
function startSprint(){
  const bag = [];
  play({ title:"Sign Sprint", mode:"sprint", seconds:90, combo:true, fast:true,
    next:function(){ if(!bag.length) weightedSigns(24).forEach(s=>bag.push(s));
      const s = bag.shift();
      return Math.random()<0.18 ? signPickQuestion(s) : signQuestion(s); },
    again:startSprint });
}
function startDecoder(){
  const qs = shuffle(DECODER.map((d,i)=>i)).slice(0,12).map(decoderQuestion);
  play({ title:"Shape & Colour", mode:"decoder", questions:qs, again:startDecoder });
}
function startRapid(topic){
  const qs = weightedRules(12, topic).map(ruleQuestion);
  const t = topic ? TOPICS.find(x=>x.id===topic) : null;
  play({ title: t ? t.name : "Rapid Fire", mode:"rapid", questions:qs, again:()=>startRapid(topic) });
}
function startRow(){
  const qs = shuffle(SCENARIOS.map((s,i)=>i)).slice(0,10).map(scenarioQuestion);
  play({ title:"Right of Way", mode:"row", questions:qs, again:startRow });
}
function startDial(){
  const qs = shuffle(NUMBERS.map((n,i)=>i)).slice(0,12).map(numberQuestion);
  play({ title:"Distance Dial", mode:"dial", questions:qs, again:startDial });
}
function startLadder(){
  const lic = weightedRules(11,"licence").map(ruleQuestion);
  const rdy = weightedRules(4,"ready").map(ruleQuestion);
  const qs = lic.concat(rdy);
  play({ title:"Licence Ladder", mode:"ladder", questions:qs, again:startLadder,
    onDone:function(r){ ladderResult(r); } });
}
function ladderResult(r){
  const rung = r.right>=13 ? 3 : r.right>=9 ? 2 : r.right>=5 ? 1 : 0;
  const names = ["Still at the counter","G1 — learner","G2 — on your own","Full G"];
  const app = $("#app"); app.innerHTML=""; document.onkeydown=null;
  app.appendChild(hudBar("Licence Ladder"));
  const box = h("div",{class:"panel result"});
  box.innerHTML = '<div class="big">'+["🚧","🅖1","🅖2","🅖"][rung]+"</div>"+
    '<div class="verdict '+(rung>=2?"pass":"fail")+'">'+names[rung]+"</div>"+
    "<p>"+r.right+" of "+r.asked+" correct &middot; +"+r.xp+" XP</p>"+
    "<p>"+(rung===3?"You know Chapter 1 cold.":"Reach 13 of 15 to earn your full G on this ladder.")+"</p>";
  const a=h("button",{class:"btn go",type:"button",text:"Climb again"}); a.addEventListener("click",startLadder);
  const b=h("button",{class:"btn",type:"button",text:"Home"}); b.addEventListener("click",home);
  box.appendChild(h("div",{class:"btnrow"},[a,b]));
  app.appendChild(box);
  if(rung===3) grant("ladder");
}

/* ── the mock exam: 20 signs + 20 rules, 16/20 needed in EACH half ────── */
function startExam(){
  const signQs = weightedSigns(20).map(s=>signQuestion(s, Math.random()<0.3?"means":"name"));
  const ruleQs = examRules(20).map(ruleQuestion);
  signQs.forEach(q=>q.half="signs"); ruleQs.forEach(q=>q.half="rules");
  play({ title:"Mock G1 Exam", mode:"exam", silent:true, questions: signQs.concat(ruleQs),
    onDone:function(r){
      let sr=0, rr=0;
      r.log.forEach((x,i)=>{ if(i<20){ if(x.ok) sr++; } else if(x.ok) rr++; });
      const pass = sr>=16 && rr>=16;
      S.exams.push({ts:Date.now(), signs:sr, rules:rr, pass:pass});
      if(S.exams.length>40) S.exams.shift();
      addXp(pass?400:120);
      if(sr===20 && rr===20) grant("perfect");
      checkBadges(); save();
      examResult(r, sr, rr, pass);
    }});
}
function examResult(r, sr, rr, pass){
  document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";
  app.appendChild(hudBar("Mock G1 Exam"));
  const box = h("div",{class:"panel result"});
  box.innerHTML = '<div class="big num">'+(sr+rr)+"<span style=\"font-size:.4em;color:#63728A\">/40</span></div>"+
    '<div class="verdict '+(pass?"pass":"fail")+'">'+(pass?"PASS":"NOT YET")+"</div>"+
    "<p>"+(pass ? "That is a pass on both halves. Do it three times in a row and book the real thing."
                : "You need 16 of 20 in EACH half. Failing one half fails the whole test.")+"</p>";
  const sc = h("div",{class:"scorecard"});
  sc.innerHTML =
    '<div class="half '+(sr>=16?"pass":"fail")+'"><b class="num">'+sr+'/20</b><span>Road signs</span></div>'+
    '<div class="half '+(rr>=16?"pass":"fail")+'"><b class="num">'+rr+'/20</b><span>Rules of the road</span></div>';
  box.appendChild(sc);
  const a=h("button",{class:"btn go",type:"button",text:"Take it again"}); a.addEventListener("click",startExam);
  const b=h("button",{class:"btn",type:"button",text:"Fix-It list ("+missCount()+")"}); b.addEventListener("click",reviewView);
  const c=h("button",{class:"btn",type:"button",text:"Home"}); c.addEventListener("click",home);
  box.appendChild(h("div",{class:"btnrow"},[a,b,c]));
  app.appendChild(box);

  const wrong = r.log.filter(x=>!x.ok);
  if(wrong.length){
    const s=h("div",{class:"sec"}); s.appendChild(h("h2",{text:"Every one you missed"}));
    const rows=h("div",{class:"rows"});
    wrong.forEach(x=>rows.appendChild(missRow(x.ref, x.q.why)));
    s.appendChild(rows); app.appendChild(s);
  }
  window.scrollTo(0,0);
}

/* ── Fix-It Garage ───────────────────────────────────────────────────── */
function reviewView(){
  stopTimers(); document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";
  app.appendChild(hudBar("Fix-It Garage"));
  const keys = Object.keys(S.miss);
  if(!keys.length){
    app.appendChild(h("div",{class:"panel empty",html:"<b>Nothing to fix</b><p>Everything you have missed has been cleared. Play a round and come back when you break something.</p>"}));
    const b=h("button",{class:"btn go",type:"button",text:"Sign Sprint"}); b.addEventListener("click",startSprint);
    app.appendChild(h("div",{class:"btnrow"},[b]));
    return;
  }
  const intro = h("div",{class:"panel"});
  intro.innerHTML = "<p style=\"color:var(--ink-2)\">Every question you get wrong lands here. Get one right <b style=\"color:var(--ink)\">three times</b> and it leaves the list for good.</p>";
  app.appendChild(intro);
  const b = h("button",{class:"btn go wide",type:"button",text:"Review "+Math.min(keys.length,12)+" items"});
  b.addEventListener("click", ()=>{
    const qs = shuffle(keys).slice(0,12).map(fromRef).filter(Boolean);
    if(!qs.length){ toast("Nothing to review"); return; }
    play({title:"Fix-It Review", mode:"review", questions:qs, again:reviewView});
  });
  app.appendChild(h("div",{class:"btnrow"},[b]));

  const sec = h("div",{class:"sec"});
  sec.appendChild(h("h2",{text:"On the list ("+keys.length+")"}));
  const rows = h("div",{class:"rows"});
  keys.map(k=>({k, m:S.miss[k]})).sort((a,b)=>b.m.wrong-a.m.wrong).forEach(o=>{
    const q = fromRef(o.k); if(!q) return;
    const need = ["3 correct to clear","2 more to clear","1 more to clear"][Math.min(2,o.m.box)];
    rows.appendChild(missRow(o.k, "Missed "+o.m.wrong+"\u00d7 \u00b7 "+need,
      '<span class="pill '+(o.m.wrong>2?"hot":"ok")+'">'+o.m.box+"/3</span>"));
  });
  sec.appendChild(rows); app.appendChild(sec);
  window.scrollTo(0,0);
}

/* ── Pit Stop: the whole two chapters in bites ───────────────────────── */
function studyView(topicId){
  stopTimers(); document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";
  app.appendChild(hudBar("Pit Stop"));
  const cur = topicId || TOPICS[0].id;
  const tabs = h("div",{class:"tabs",role:"tablist"});
  TOPICS.forEach(t=>{
    const b=h("button",{class:"tab",type:"button",role:"tab",text:t.name});
    b.setAttribute("aria-selected", t.id===cur ? "true":"false");
    b.addEventListener("click",()=>studyView(t.id));
    tabs.appendChild(b);
  });
  app.appendChild(tabs);
  const t = TOPICS.find(x=>x.id===cur);
  const head = h("div",{class:"panel"});
  const b = S.topic[cur];
  head.innerHTML = "<h2 style=\"font-size:22px\">"+esc2(t.name)+"</h2>"+
    '<p style="color:var(--ink-2);margin-top:4px">'+esc2(t.chap)+" &middot; "+esc2(t.blurb)+
    (b&&b.n ? " &middot; you are at "+Math.round(accuracy(b)*100)+"% here" : "")+"</p>";
  const drill = h("button",{class:"btn go wide",type:"button",text:"Drill this topic"});
  drill.addEventListener("click",()=>startRapid(cur));
  head.appendChild(h("div",{class:"btnrow"},[drill]));
  app.appendChild(head);
  const wrap = h("div",{class:"sec"});
  CARDS.filter(c=>c.t===cur).forEach(c=>{
    const s=h("div",{class:"sheet"});
    s.innerHTML = "<h3>"+esc2(c.title)+"</h3><ul>"+c.lines.map(l=>"<li>"+esc2(l)+"</li>").join("")+"</ul>";
    wrap.appendChild(s);
  });
  app.appendChild(wrap);
  window.scrollTo(0,0);
}

/* ── Sign Shop: browse all 108 ───────────────────────────────────────── */
function signsView(cat, openId){
  stopTimers(); document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";
  app.appendChild(hudBar("Sign Shop"));
  const cur = cat || "reg";
  const tabs = h("div",{class:"tabs",role:"tablist"});
  CAT_ORDER.forEach(c=>{
    const b=h("button",{class:"tab",type:"button",role:"tab",text:SIGN_CATS[c].label});
    b.setAttribute("aria-selected", c===cur?"true":"false");
    b.addEventListener("click",()=>signsView(c));
    tabs.appendChild(b);
  });
  app.appendChild(tabs);
  const fam = SIGNS.filter(s=>s.cat===cur);
  const famSeen = fam.filter(s=>S.sign[s.id] && S.sign[s.id].n>0).length;
  const info = h("div",{class:"panel"});
  info.innerHTML = "<h2 style=\"font-size:20px\">"+esc2(SIGN_CATS[cur].label)+"</h2>"+
    '<p style="color:var(--ink-2);margin-top:4px">'+esc2(SIGN_CATS[cur].blurb)+" &middot; "+esc2(SIGN_CATS[cur].colour)+"</p>"+
    '<p style="color:var(--ink-3);margin-top:6px;font-size:14px">Tested on <b style="color:var(--beam)">'+
    famSeen+" of "+fam.length+"</b> of these. A tick means it has come up at least once.</p>";
  app.appendChild(info);

  const detail = h("div",{class:"panel hide"});
  app.appendChild(detail);
  function open(s){
    const b = S.sign[s.id];
    detail.className = "panel";
    detail.innerHTML = '<div class="detail">'+signSVG(s,150)+
      "<h3 style=\"font-size:22px\">"+esc2(s.name)+"</h3>"+
      '<p style="color:var(--ink)">'+esc2(s.means)+"</p>"+
      '<p style="color:var(--ink-2);font-size:14px">'+esc2(s.tip)+"</p>"+
      '<div class="meta"><span class="tagx">'+esc2(SIGN_CATS[s.cat].label)+'</span><span class="tagx">'+
      esc2(s.shape)+'</span>'+(b&&b.n?'<span class="tagx">you: '+b.r+"/"+b.n+"</span>":"")+"</div></div>";
    detail.scrollIntoView({block:"nearest", behavior:"smooth"});
  }
  const grid = h("div",{class:"signgrid"});
  fam.forEach(s=>{
    const b = S.sign[s.id];
    const c=h("button",{class:"sgi"+(b&&b.n?" seen":""),type:"button"});
    c.innerHTML = signSVG(s,64,{hideLabel:true})+"<span>"+esc2(s.name)+"</span>";
    c.addEventListener("click",()=>open(s));
    grid.appendChild(c);
  });
  app.appendChild(h("div",{class:"sec"},[grid]));
  if(openId){ const s=SIGNS.find(x=>x.id===openId); if(s) open(s); }
  window.scrollTo(0,0);
}

/* ── recommendation engine ───────────────────────────────────────────── */
function recommend(){
  if(missCount()>=6) return {label:"Clear "+missCount()+" from your Fix-It list", go:reviewView};
  const unseen = SIGNS.length - signsSeen();
  if(unseen > 0) return {label: signsSeen()===0 ? "Start with the signs — Sign Sprint"
                                                : unseen+" signs you have never been shown", go:startSprint};
  const weak = TOPICS.map(t=>({t, v: accuracy(S.topic[t.id])*coverage(S.topic[t.id]), c:coverage(S.topic[t.id])}))
                     .sort((a,b)=>a.v-b.v)[0];
  if(readiness()>=78) return {label:"You are ready — take the mock G1 exam", go:startExam};
  if(weak && weak.v<0.75) return {label:"Weakest area: "+weak.t.name, go:()=>startRapid(weak.t.id)};
  return {label:"Take the mock G1 exam", go:startExam};
}

/* ── HOME ───────────────────────────────────────────────────────────── */
const GAMES = [
 {id:"sprint", sign:"yield",   name:"Sign Sprint",    d:"90 seconds. Name the sign. Build a streak.", go:startSprint},
 {id:"decoder",sign:"schoolAhead", name:"Shape & Colour", d:"Read a sign you have never seen before.", go:startDecoder},
 {id:"rapid",  sign:"maxSpeed", name:"Rapid Fire",    d:"Rules of the road, 12 at a time.", go:()=>topicPicker()},
 {id:"row",    sign:"crossroadAhead", name:"Right of Way", d:"Who goes first? Plan-view puzzles.", go:startRow},
 {id:"dial",   sign:"maxSafeSpeed", name:"Distance Dial", d:"Every number the G1 loves to ask.", go:startDial},
 {id:"ladder", sign:"routeMarker", name:"Licence Ladder", d:"Chapter 1: climb G1 to full G.", go:startLadder}
];
function topicPicker(){
  stopTimers(); document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";
  app.appendChild(hudBar("Rapid Fire"));
  const p=h("div",{class:"panel"});
  p.innerHTML = "<p style=\"color:var(--ink-2)\">Pick a topic, or take a mixed round from all 268 questions.</p>";
  const all=h("button",{class:"btn go wide",type:"button",text:"Mixed round"});
  all.addEventListener("click",()=>startRapid(null));
  p.appendChild(h("div",{class:"btnrow"},[all]));
  app.appendChild(p);
  const sec=h("div",{class:"sec"}); sec.appendChild(h("h2",{text:"By topic"}));
  const rows=h("div",{class:"rows"});
  TOPICS.forEach(t=>{
    const b=S.topic[t.id], acc=Math.round(accuracy(b)*100), cov=coverage(b);
    const el=h("button",{class:"row",type:"button"});
    el.innerHTML = '<div class="nm">'+esc2(t.name)+"<small>"+esc2(t.chap)+"</small></div>"+
      '<div class="bar '+(cov<0.3?"":(acc>=80?"good":acc>=50?"":"bad"))+'"><i style="width:'+(cov?acc:0)+'%"></i></div>'+
      '<div class="pc num">'+(b&&b.n?acc+"%":"—")+"</div>";
    el.addEventListener("click",()=>startRapid(t.id));
    rows.appendChild(el);
  });
  sec.appendChild(rows); app.appendChild(sec);
  window.scrollTo(0,0);
}

function home(){
  stopTimers(); document.onkeydown=null;
  const app=$("#app"); app.innerHTML="";

  const mark = h("div",{class:"mark"});
  mark.innerHTML = '<div class="g1">Night<em>Drive</em></div>';
  app.appendChild(mark);
  app.appendChild(h("div",{class:"mark",html:'<div class="sub">Ontario G1 &middot; Chapters 1 &amp; 2 &amp; every sign</div>'}));
  app.appendChild(h("div",{class:"realtest",html:
    "<b>The real test</b><span>40 questions &middot; 20 signs + 20 rules &middot; you need <b>16 of 20 in each half</b> &middot; about 30 minutes</span>"}));

  /* readiness */
  const r = readiness(), lv = xpInto(S.xp);
  const g = h("div",{class:"panel"});
  const note = r<20 ? "Play a few rounds and this needle starts moving."
             : r<50 ? "Coming along. Keep hitting your weak topics."
             : r<78 ? "Close. Push the red topics up and try a mock exam."
                    : "You are in test-ready territory. Prove it three times.";
  g.innerHTML = '<div class="gauge">'+gaugeSVG(r)+
    '<div class="read"><div class="pct num">'+r+"%</div><div class=\"lbl\">Exam readiness</div>"+
    '<p class="note">'+note+"</p></div></div>"+
    '<div class="statrow">'+
      '<div class="stat"><b class="num">'+lv.l+"</b><span>Level</span></div>"+
      '<div class="stat"><b class="num">'+dayStreak()+"</b><span>Day streak</span></div>"+
      '<div class="stat"><b class="num">'+missCount()+"</b><span>To fix</span></div>"+
      '<div class="stat"><b class="num">'+signsSeen()+"/"+SIGNS.length+"</b><span>Signs seen</span></div></div>";
  const rec = recommend();
  const rb = h("button",{class:"btn go wide",type:"button",text:rec.label});
  rb.addEventListener("click", rec.go);
  g.appendChild(h("div",{class:"btnrow"},[rb]));
  app.appendChild(g);

  /* games */
  const sec1 = h("div",{class:"sec"});
  sec1.appendChild(h("h2",{text:"Games"}));
  const grid = h("div",{class:"games"});
  GAMES.forEach(gm=>{
    const s = SIGNS.find(x=>x.id===gm.sign);
    const c = h("button",{class:"gcard",type:"button"});
    c.innerHTML = '<span class="ic">'+signSVG(s,38,{hideLabel:true})+"</span><b>"+esc2(gm.name)+"</b><small>"+esc2(gm.d)+"</small>"+
      (S.best[gm.id] ? '<span class="best">Best '+S.best[gm.id]+"</span>" : "");
    c.addEventListener("click", gm.go);
    grid.appendChild(c);
  });
  const ex = h("button",{class:"gcard wide exam",type:"button"});
  const passes = S.exams.filter(e=>e.pass).length;
  ex.innerHTML = '<span class="ic">'+signSVG(SIGNS.find(s=>s.id==="stop"),38,{hideLabel:true})+"</span>"+
    "<b>Mock G1 Exam</b><small>The real shape: 20 signs + 20 rules. You need 16 of 20 in each half.</small>"+
    '<span class="best">'+(S.exams.length ? passes+" passed of "+S.exams.length+(S.exams.length===1?" attempt":" attempts") : "Not attempted yet")+"</span>";
  ex.addEventListener("click", startExam);
  grid.appendChild(ex);
  const rv = h("button",{class:"gcard wide review",type:"button"});
  rv.innerHTML = '<span class="ic">'+signSVG(SIGNS.find(s=>s.id==="constructionAhead"),38,{hideLabel:true})+"</span>"+
    "<b>Fix-It Garage "+(missCount()?'<span class="pill hot">'+missCount()+"</span>":"")+"</b>"+
    "<small>Everything you got wrong, waiting to be cleared. Three correct answers retires an item.</small>";
  rv.addEventListener("click", reviewView);
  grid.appendChild(rv);

  const st = h("button",{class:"gcard",type:"button"});
  st.innerHTML = '<span class="ic">'+signSVG(SIGNS.find(s=>s.id==="destinationDistance"),38,{hideLabel:true})+"</span>"+
    "<b>Pit Stop</b><small>The whole two chapters, in short lines.</small>";
  st.addEventListener("click",()=>studyView());
  grid.appendChild(st);
  const sh = h("button",{class:"gcard",type:"button"});
  sh.innerHTML = '<span class="ic">'+signSVG(SIGNS.find(s=>s.id==="crossbuck"),38,{hideLabel:true})+"</span>"+
    "<b>Sign Shop</b><small>All "+SIGNS.length+" signs, sorted by family.</small>";
  sh.addEventListener("click",()=>signsView());
  grid.appendChild(sh);
  sec1.appendChild(grid); app.appendChild(sec1);

  /* progress */
  const sec2 = h("div",{class:"sec"});
  sec2.appendChild(h("h2",{text:"Where you stand"}));
  const rows = h("div",{class:"rows"});
  const areas = CAT_ORDER.map(c=>({name:SIGN_CATS[c].label+" signs", sub:"Signs", b:S.signcat[c], go:()=>startSprint()}))
    .concat(TOPICS.map(t=>({name:t.name, sub:t.chap, b:S.topic[t.id], go:()=>startRapid(t.id)})));
  areas.sort((a,b)=>(accuracy(a.b)*coverage(a.b))-(accuracy(b.b)*coverage(b.b)));
  areas.forEach(a=>{
    const acc = Math.round(accuracy(a.b)*100), cov = coverage(a.b);
    const el = h("button",{class:"row",type:"button"});
    el.innerHTML = '<div class="nm">'+esc2(a.name)+"<small>"+esc2(a.sub)+(cov<1&&a.b?" &middot; keep going":"")+"</small></div>"+
      '<div class="bar '+(!a.b?"":(acc>=80?"good":acc>=50?"":"bad"))+'"><i style="width:'+(a.b?acc:0)+'%"></i></div>'+
      '<div class="pc num">'+(a.b&&a.b.n?acc+"%":"—")+"</div>";
    el.addEventListener("click", a.go);
    rows.appendChild(el);
  });
  sec2.appendChild(rows); app.appendChild(sec2);

  /* badges */
  const sec3 = h("div",{class:"sec"});
  sec3.appendChild(h("h2",{text:"Badges ("+S.badges.length+" / "+BADGES.length+")"}));
  const bl = h("div",{class:"badges"});
  BADGES.forEach(b=>{
    const got = S.badges.indexOf(b.id)>=0;
    const el = h("div",{class:"bdg"+(got?" got":""),title:b.d});
    el.innerHTML = '<span class="e">'+b.e+"</span><span>"+esc2(got?b.n:b.d)+"</span>";
    bl.appendChild(el);
  });
  sec3.appendChild(bl); app.appendChild(sec3);

  const foot = h("div",{class:"foot"});
  foot.innerHTML = "Built from <b>The Official MTO Driver&rsquo;s Handbook</b> (ISBN 978-1-4868-8628-9), chapters 1 and 2, "+
    "plus the traffic signs, lights and pavement markings the knowledge test also covers. "+
    SIGNS.length+" signs &mdash; every one in the handbook &middot; "+BANK.length+" rules questions &middot; "+
    NUMBERS.length+" distances &middot; "+SCENARIOS.length+" right-of-way puzzles."+
    "<br><br>Study aid only — always confirm the current rules at ontario.ca. Progress is saved on this device only. "+
    '<button id="wipe" style="color:#63728A;text-decoration:underline">Reset my progress</button>';
  app.appendChild(foot);
  const w = foot.querySelector("#wipe");
  if(w) w.addEventListener("click",()=>{
    if(confirm("Erase all your scores, badges and Fix-It list on this device?")){
      S = Object.assign({}, BLANK, {days:[],badges:[],exams:[],best:{},topic:{},signcat:{},sign:{},miss:{}});
      try{ localStorage.removeItem(KEY); }catch(e){}
      home();
    }
  });
  window.scrollTo(0,0);
}

/* ── boot ────────────────────────────────────────────────────────────── */
home();
})();
