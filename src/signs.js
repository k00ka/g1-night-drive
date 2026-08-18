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

/* ── The catalogue ───────────────────────────────────────────────────────
   cat: reg = regulatory (must obey) · warn = warning (hazard ahead)
        temp = temporary (orange, roadwork) · info = information/direction
        other = special shapes that don't fit the four families           */

const SIGNS = [
/* ══ REGULATORY ══════════════════════════════════════════════════════════ */
{id:'stop', name:'Stop', cat:'reg', shape:'octagon', art:{t:[{s:'STOP',size:34}]},
 means:'Come to a COMPLETE stop. Wheels stop rolling.', tip:'Eight sides, red. The only octagon on the road.'},
{id:'yield', name:'Yield', cat:'reg', shape:'yield', art:{t:[{s:'YIELD',size:17}], gy:-6},
 means:'Let traffic in or near the intersection go first. Stop if you must.', tip:'Upside-down triangle = give way, not always stop.'},
{id:'doNotEnter', name:'Do not enter', cat:'reg', shape:'square', art:{g:'noEntry', gs:.62, gy:-12, t:[{s:'DO NOT ENTER',size:11}]},
 means:'Do not enter this road — traffic comes the other way.', tip:'Red circle + white bar = wrong way, back off.'},
{id:'oneWay', name:'One way', cat:'reg', shape:'wide', art:{bg:'black', fg:'white', edge:null, g:'arrRight', gs:.42, t:[]},
 means:'Traffic travels in one direction only — the way the arrow points.', tip:'Black rectangle, white arrow.'},
{id:'maxSpeed', name:'Maximum speed 50 km/h', cat:'reg', shape:'tall', art:{t:[{s:'MAXIMUM',size:13},{s:'50',size:44}]},
 means:'The speed limit is 50 km/h. It is a maximum, not a target.', tip:'No sign posted in a city or town? Then it is 50.'},
{id:'maxSpeed80', name:'Maximum speed 80 km/h', cat:'reg', shape:'tall', art:{t:[{s:'MAXIMUM',size:13},{s:'80',size:44}]},
 means:'The speed limit is 80 km/h.', tip:'No sign posted outside a built-up area? Then it is 80.'},
{id:'speedAhead', name:'Speed limit changes ahead', cat:'reg', shape:'tall', art:{t:[{s:'MAXIMUM',size:12},{s:'60',size:34},{s:'AHEAD',size:14}]},
 means:'A new speed limit starts ahead. Begin adjusting now.', tip:'The word AHEAD means "not yet — but soon".'},
{id:'schoolZoneSpeed', name:'School zone maximum speed', cat:'reg', shape:'tall', art:{g:'pedTwo', gs:.72, gy:-4, t:[{s:'MAXIMUM',size:11},{s:'40',size:26}]},
 means:'Lower speed limit while the yellow lights flash or during posted hours.', tip:'School zone limits are enforced hard — fines can double.'},
{id:'noLeftTurn', name:'No left turn', cat:'reg', shape:'square', art:{g:'turnLeft', ring:'no'},
 means:'Do not turn left at this intersection.', tip:'Red circle + slash = the thing shown is banned.'},
{id:'noUturn', name:'No U-turn', cat:'reg', shape:'square', art:{g:'uTurn', ring:'no'},
 means:'Do not turn around to go the opposite way here.', tip:'The hooked arrow doubling back = U-turn.'},
{id:'noStraight', name:'Do not drive straight through', cat:'reg', shape:'square', art:{g:'arrUp', ring:'no'},
 means:'You may not go straight through this intersection — you must turn.', tip:'Straight arrow with a slash.'},
{id:'noRightOnRed', name:'No right turn on red', cat:'reg', shape:'tall', art:{g:'turnRight', ring:'no', gs:.70, gy:-6, t:[{s:'ON RED',size:14}]},
 means:'You may not turn right while facing a red light here.', tip:'Right-on-red is legal everywhere in Ontario EXCEPT where this sign says no.'},
{id:'noLeftTimed', name:'No left turn during posted times', cat:'reg', shape:'tall', art:{g:'turnLeft', ring:'no', gs:.70, gy:-4, t:[{s:'7-9 AM',size:12},{s:'MON-FRI',size:11}]},
 means:'No left turn during the hours shown. Legal outside those hours.', tip:'Read the small print — times change the rule.'},
{id:'noBicycles', name:'No bicycles', cat:'reg', shape:'square', art:{g:'bike', ring:'no'},
 means:'Bicycles are not allowed on this road.', tip:'Slash = keep off.'},
{id:'noPedestrians', name:'No pedestrians', cat:'reg', shape:'square', art:{g:'ped', ring:'no'},
 means:'Pedestrians are not allowed on this road.', tip:'Common on freeway entrances.'},
{id:'noParking', name:'No parking', cat:'reg', shape:'tall', art:{g:'parkingP', ring:'no', gs:.70, gy:-4, t:[{s:'ANY TIME',size:12}]},
 means:'Do not park here. You may stop briefly to load or unload people or goods.', tip:'No PARKING is the mildest of the three: loading is still OK.'},
{id:'noStopping', name:'No stopping', cat:'reg', shape:'tall', art:{t:[{s:'NO',size:24,c:'red'},{s:'STOPPING',size:15,c:'red'},{s:'ANY TIME',size:11}]},
 means:'Do not stop at all in this area, for any reason.', tip:'The strictest one — you cannot even pause.'},
{id:'noStanding', name:'No standing', cat:'reg', shape:'tall', art:{t:[{s:'NO',size:24,c:'red'},{s:'STANDING',size:14,c:'red'},{s:'ANY TIME',size:11}]},
 means:'Do not stop except to pick up or drop off passengers.', tip:'Middle of the three: people yes, cargo no.'},
{id:'parkingPermitted', name:'Parking permitted', cat:'reg', shape:'tall', art:{g:'parkingP', ring:'ok', gs:.70, gy:-4, t:[{s:'2 HOUR',size:13},{s:'9-6',size:13}]},
 means:'You may park between the signs during the times posted.', tip:'GREEN circle = allowed. RED circle = banned.'},
{id:'accessibleParking', name:'Accessible parking only', cat:'reg', shape:'square', art:{bg:'blue', fg:'white', edge:'white', g:'wheelchair'},
 means:'Only vehicles displaying a valid Accessible Parking Permit may park here.', tip:'Blue and white. Big fine if you cheat.'},
{id:'accessibleLoading', name:'Accessible loading zone', cat:'reg', shape:'tall', art:{g:'wheelchair', gs:.74, gy:-4, gfg:'blue', t:[{s:'LOADING',size:12},{s:'ZONE',size:12}]},
 means:'Curb space for permit holders to pick up and drop off passengers.', tip:'Drop-off only — not a parking spot.'},
{id:'slowKeepRight', name:'Slower traffic keep right', cat:'reg', shape:'tall', art:{t:[{s:'SLOWER',size:14},{s:'TRAFFIC',size:14},{s:'KEEP',size:14},{s:'RIGHT',size:14}]},
 means:'On multi-lane roads, slow traffic must stay in the right lane.', tip:'Left lanes are for passing, not cruising.'},
{id:'doNotPass', name:'Do not pass', cat:'reg', shape:'tall', art:{t:[{s:'DO NOT',size:18},{s:'PASS',size:22}]},
 means:'Passing is not allowed on this stretch of road.', tip:'Usually paired with a solid yellow line.'},
{id:'laneArrows', name:'Lane must turn as shown', cat:'reg', shape:'square', art:{g:'laneArrows'},
 means:'Each lane must go in the direction of its arrow at the intersection.', tip:'Pick your lane early — you cannot change your mind at the line.'},
{id:'twoWayLeft', name:'Two-way left-turn lane', cat:'reg', shape:'square', art:{g:'twoWayLeft2', gs:.80},
 means:'The centre lane is shared by both directions for LEFT TURNS ONLY.', tip:'Never use it to pass or to drive along.'},
{id:'hovLane', name:'High Occupancy Vehicle (HOV) lane', cat:'reg', shape:'tall', art:{g:'hovDiamond', gs:.60, gy:-4, gfg:'white', bg:'green', fg:'white', edge:'white', t:[{s:'2 OR MORE',size:12},{s:'PERSONS',size:12}]},
 means:'Only vehicles carrying at least the posted number of people may use this lane.', tip:'White diamond on green = carpool lane. Open 24/7.'},
{id:'hovNoChange', name:'Do not change lanes into or out of HOV lane', cat:'reg', shape:'square', art:{g:'hovDiamond', ring:'no', gs:.5},
 means:'You may not cross into or out of the HOV lane along this stretch.', tip:'Wait for the dashed opening.'},
{id:'busLane', name:'Reserved lane — buses only', cat:'reg', shape:'tall', art:{g:'transitBus', gs:.78, gy:-4, t:[{s:'ONLY',size:16}]},
 means:'This lane is reserved for the vehicle type shown — buses, taxis or bikes.', tip:'Reserved lanes are diamond-marked on the pavement.'},
{id:'yieldToBus', name:'Yield to bus', cat:'reg', shape:'tall', art:{g:'transitBus', gs:.78, gy:-4, t:[{s:'YIELD',size:16}]},
 means:'You must yield to a bus signalling to pull out from a bus bay.', tip:'Let the bus back into traffic.'},
{id:'bicycleRoute', name:'Bicycle route', cat:'reg', shape:'square', art:{g:'bike', ring:'ok', gs:.5},
 means:'This road is an official bicycle route. Share it.', tip:'Green circle = permitted.'},
{id:'snowmobilePermitted', name:'Snowmobiles permitted', cat:'reg', shape:'square', art:{g:'snowmobile', ring:'ok', gs:.5},
 means:'Snowmobiles may use this road.', tip:'Green circle = allowed here.'},
{id:'pedCrossoverSign', name:'Pedestrian crossover', cat:'reg', shape:'tall', art:{g:'ped', gs:.80, gy:-6, t:[{s:'X',size:22}]},
 means:'A pedestrian crossover. You MUST stop and let pedestrians cross the whole road.', tip:'Do not go until they are fully across — not just past you.'},
{id:'stopForSchoolBus', name:'Stop for school bus when signals flash', cat:'reg', shape:'tall', art:{g:'schoolBus', gs:.80, gy:-6, t:[{s:'STOP WHEN',size:11},{s:'FLASHING',size:11}]},
 means:'You must stop for a school bus with upper red lights flashing.', tip:'6 demerit points and a heavy fine if you do not.'},
{id:'communitySafety', name:'Community safety zone', cat:'reg', shape:'tall', art:{bg:'green', fg:'white', edge:'white', t:[{s:'COMMUNITY',size:12},{s:'SAFETY',size:13},{s:'ZONE',size:13},{s:'FINES INCREASED',size:8}]},
 means:'Extra risk to pedestrians here — traffic fines are increased.', tip:'Schools, parks, seniors homes.'},
{id:'keepRightIsland', name:'Keep right of island', cat:'reg', shape:'square', art:{g:'keepRightIsland'},
 means:'Pass to the right of the traffic island.', tip:'Island splits the road — take the right side.'},

/* ══ WARNING (yellow diamond) ════════════════════════════════════════════ */
{id:'stopAhead', name:'Stop sign ahead', cat:'warn', shape:'diamond', art:{g:'octagon', gs:.46},
 means:'A stop sign is coming up. Start slowing now.', tip:'Yellow diamond = warning, not an order.'},
{id:'signalAhead', name:'Traffic lights ahead', cat:'warn', shape:'diamond', art:{g:'signalAhead', gs:.44},
 means:'Traffic lights are coming — often where you cannot see them early.', tip:'Cover the brake.'},
{id:'crossroadAhead', name:'Intersection ahead', cat:'warn', shape:'diamond', art:{g:'crossroad', gs:.50},
 means:'A crossroad is ahead. Watch for traffic entering from both sides.', tip:'The stem shows the road you are on.'},
{id:'sideRoadAhead', name:'Side road ahead', cat:'warn', shape:'diamond', art:{g:'sideRoadRight', gs:.50},
 means:'A road joins from the side ahead.', tip:'Watch for vehicles pulling out.'},
{id:'roadBranch', name:'Road branching off', cat:'warn', shape:'diamond', art:{g:'roadBranch', gs:.50},
 means:'A road branches off in the direction shown.', tip:'The angled arm shows the branch.'},
{id:'curveRight', name:'Curve to the right', cat:'warn', shape:'diamond', art:{g:'curveRight', gs:.52},
 means:'A gentle curve to the right ahead. Slow before you enter it.', tip:'Brake before the curve, not in it.'},
{id:'curveLeft', name:'Curve to the left', cat:'warn', shape:'diamond', art:{g:'curveLeft', gs:.52},
 means:'A gentle curve to the left ahead.', tip:'Look through the curve to where you want to go.'},
{id:'sharpTurn', name:'Sharp turn ahead', cat:'warn', shape:'diamond', art:{g:'sharpRight', gs:.52},
 means:'A sharp, near right-angle turn ahead. Slow down a lot.', tip:'Often paired with a checkerboard marker at the corner.'},
{id:'windingRoad', name:'Winding road', cat:'warn', shape:'diamond', art:{g:'winding', gs:.52},
 means:'A series of curves ahead — more than one bend.', tip:'S-shape = several curves, not just one.'},
{id:'mergeAhead', name:'Merging traffic', cat:'warn', shape:'diamond', art:{g:'merge', gs:.50},
 means:'Traffic is merging into your lane. Adjust speed to let them in.', tip:'Merging is a shared job — both drivers adjust.'},
{id:'rightLaneEnds', name:'Right lane ends', cat:'warn', shape:'diamond', art:{g:'laneEndsRight', gs:.50},
 means:'The right lane ends ahead. Traffic must merge left.', tip:'Zipper merge — take turns.'},
{id:'roadNarrows', name:'Pavement narrows', cat:'warn', shape:'diamond', art:{g:'roadNarrows', gs:.52},
 means:'The road gets narrower ahead.', tip:'Move toward the centre of your lane, slow down.'},
{id:'dividedBegins', name:'Divided highway begins', cat:'warn', shape:'diamond', art:{g:'dividedBegin', gs:.52},
 means:'The road ahead is divided by a median. Keep right.', tip:'Two streams separating.'},
{id:'dividedEnds', name:'Divided highway ends', cat:'warn', shape:'diamond', art:{g:'dividedEnd', gs:.52},
 means:'The median ends — you will meet oncoming traffic again.', tip:'Two streams coming back together.'},
{id:'twoWayAhead', name:'Two-way traffic ahead', cat:'warn', shape:'diamond', art:{g:'twoWayTraffic', gs:.50},
 means:'You are leaving a one-way road — oncoming traffic ahead.', tip:'Two arrows, opposite directions.'},
{id:'roundaboutAhead', name:'Roundabout ahead', cat:'warn', shape:'diamond', art:{g:'roundaboutSign', gs:.54},
 means:'A roundabout is ahead. Slow down and pick your lane.', tip:'Yield to traffic already in the circle — look LEFT.'},
{id:'bumpAhead', name:'Bump ahead', cat:'warn', shape:'diamond', art:{g:'bump', gs:.50},
 means:'A bump or uneven pavement ahead.', tip:'Slow down or you will lose contact with the road.'},
{id:'narrowBridge', name:'Narrow bridge ahead', cat:'warn', shape:'diamond', art:{g:'narrowBridge', gs:.50},
 means:'The bridge ahead is narrower than the road.', tip:'Do not pass on it.'},
{id:'lowClearance', name:'Underpass / low clearance ahead', cat:'warn', shape:'diamond', art:{g:'lowClearance', gs:.52},
 means:'Low overhead clearance ahead — the height is posted.', tip:'Trucks: know your height.'},
{id:'steepHill', name:'Steep hill ahead', cat:'warn', shape:'diamond', art:{g:'hill', gs:.52},
 means:'A steep downgrade ahead. Shift to a lower gear before you start down.', tip:'Gear down before the hill, not on it.'},
{id:'slippery', name:'Slippery when wet', cat:'warn', shape:'diamond', art:{g:'slippery', gs:.52},
 means:'The road may be slippery when wet. Slow down, no sudden moves.', tip:'Car with wavy skid lines.'},
{id:'fallingRock', name:'Fallen rock zone', cat:'warn', shape:'diamond', art:{g:'rocks', gs:.50},
 means:'Rock may have fallen onto the road. Watch the surface.', tip:'Common on northern highways.'},
{id:'waterOverRoad', name:'Water over road', cat:'warn', shape:'diamond', art:{g:'water', gs:.50},
 means:'The road may be flooded ahead.', tip:'Test your brakes after driving through water.'},
{id:'pavementEnds', name:'Paved surface ends', cat:'warn', shape:'diamond', art:{g:'pavementEnds', gs:.50},
 means:'The pavement ends and gravel begins.', tip:'Loose gravel = less grip.'},
{id:'hazardEdge', name:'Hazard at the edge of the road', cat:'warn', shape:'diamond', art:{g:'hazardEdge', gs:.50},
 means:'There is an obstacle close to the road edge. Keep left of it.', tip:'Bridge pier, pole, or guardrail end.'},
{id:'bridgeLifts', name:'Lifting or swinging bridge', cat:'warn', shape:'diamond', art:{g:'liftBridge', gs:.50},
 means:'The bridge ahead lifts or swings for boats. Be ready to stop.', tip:'Watch for signals and gates.'},
{id:'pedestrianAhead', name:'Pedestrian crossing ahead', cat:'warn', shape:'diamond', art:{g:'ped', gs:.50},
 means:'Watch for people crossing ahead.', tip:'Yellow diamond = warning. The white square PXO sign is the one you must stop for.'},
{id:'bicycleCrossing', name:'Bicycle crossing ahead', cat:'warn', shape:'diamond', art:{g:'bike', gs:.50},
 means:'A bicycle route crosses the road ahead.', tip:'Shoulder-check for riders.'},
{id:'shareRoad', name:'Share the road with cyclists', cat:'warn', shape:'diamond', art:{g:'bike', gs:.80, gy:-4, t:[{s:'SHARE',size:11},{s:'THE ROAD',size:10}]},
 means:'Cyclists use this lane. Give them at least 1 metre when passing.', tip:'1 metre is the law — less is a fine plus 2 points.'},
{id:'deerCrossing', name:'Deer crossing', cat:'warn', shape:'diamond', art:{g:'deer', gs:.52},
 means:'Deer regularly cross here. Watch for shining eyes at night.', tip:'Where there is one deer, there are usually more.'},
{id:'snowmobileCross', name:'Snowmobiles cross', cat:'warn', shape:'diamond', art:{g:'snowmobile', gs:.50},
 means:'A snowmobile trail crosses the road ahead.', tip:'Winter hazard, often at night.'},
{id:'truckEntrance', name:'Truck entrance', cat:'warn', shape:'diamond', art:{g:'truckEntrance', gs:.50},
 means:'Trucks turn onto the road here.', tip:'They accelerate slowly and swing wide.'},
{id:'busEntrance', name:'Bus entrance', cat:'warn', shape:'diamond', art:{g:'transitBus', gs:.48},
 means:'Buses enter the road here.', tip:'Give them room to pull out.'},
{id:'hiddenBusStop', name:'Hidden school bus stop ahead', cat:'warn', shape:'diamond', art:{g:'schoolBus', gs:.48},
 means:'A school bus stop is hidden ahead — you will not see it until you are close.', tip:'Be ready to stop before you can see why.'},
{id:'railwayAhead', name:'Railway crossing ahead', cat:'warn', shape:'diamond', art:{g:'train', gs:.50},
 means:'Railway tracks cross the road ahead.', tip:'A train needs up to 2 km to stop. You do not win that race.'},
{id:'schoolAhead', name:'School zone ahead', cat:'warn', shape:'pentagon', art:{g:'pedTwo', gs:.52},
 means:'You are coming to a school zone. Expect children.', tip:'Five sides + fluorescent yellow-green = school, every time.'},
{id:'schoolCrossing', name:'School crossing ahead', cat:'warn', shape:'pentagon', art:{g:'pedTwo', gs:.80, gy:-2, t:[{s:'AHEAD',size:12}]},
 means:'Children cross here, often with a crossing guard.', tip:'Guard holds up a stop sign? You stop until the road is fully clear.'},
{id:'maxSafeSpeed', name:'Maximum safe speed for the curve', cat:'warn', shape:'wide', art:{bg:'yellow', fg:'black', t:[{s:'40',size:34}]},
 means:'The highest safe speed for the curve or ramp ahead, in good conditions.', tip:'Yellow tab under a curve sign — advisory, but ignore it and you leave the road.'},

/* ══ TEMPORARY (orange) ══════════════════════════════════════════════════ */
{id:'constructionAhead', name:'Construction ahead', cat:'temp', shape:'diamond', art:{bg:'orange', g:'worker', gs:.50},
 means:'Road work ahead. Slow down and watch for workers.', tip:'ORANGE = temporary. Fines double when workers are present.'},
{id:'roadWorkAhead', name:'Road work ahead', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'ROAD',size:15},{s:'WORK',size:15},{s:'AHEAD',size:13}]},
 means:'Construction is coming up. Expect lane changes and stops.', tip:'Orange diamond, black words.'},
{id:'flagperson', name:'Traffic control person ahead', cat:'temp', shape:'diamond', art:{bg:'orange', g:'flagger', gs:.50},
 means:'A worker will direct traffic. Obey their STOP or SLOW sign.', tip:'Their instructions beat the signs and lights.'},
{id:'surveyCrew', name:'Survey crew working', cat:'temp', shape:'diamond', art:{bg:'orange', g:'survey', gs:.50},
 means:'A survey crew is working on or near the road.', tip:'People standing close to live lanes.'},
{id:'detourSign', name:'Detour', cat:'temp', shape:'wide', art:{bg:'orange', fg:'black', g:'detour', gs:.46, t:[]},
 means:'Follow the marked detour around a closure.', tip:'Follow the orange markers, not your map app.'},
{id:'laneClosedAhead', name:'Lane closed ahead', cat:'temp', shape:'diamond', art:{bg:'orange', g:'laneClosedRight', gs:.50},
 means:'A lane is closed ahead for road work. Merge early.', tip:'Merge before the cones, not at them.'},
{id:'flashingArrow', name:'Flashing arrow — move over', cat:'temp', shape:'wide', art:{bg:'black', fg:'yellow', edge:null, g:'arrowFlash', gfg:'yellow', gs:.46, t:[]},
 means:'The lane ahead is closed. Move over in the direction of the arrow.', tip:'Black panel, big amber arrow.'},
{id:'groovedPavement', name:'Grooved or milled pavement', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'GROOVED',size:12},{s:'PAVEMENT',size:11}]},
 means:'The surface has been milled. It is rough and can pull at your steering.', tip:'Especially twitchy on a motorcycle.'},
{id:'reduceSpeedStop', name:'Be prepared to stop', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'BE PREPARED',size:10},{s:'TO STOP',size:13}]},
 means:'Traffic may be stopped ahead without warning.', tip:'Cover the brake and check your mirror.'},
{id:'doNotPassPace', name:'Do not pass the pace vehicle', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'DO NOT',size:11},{s:'PASS PACE',size:11},{s:'VEHICLE',size:10}]},
 means:'A pilot or pace vehicle is leading traffic through. Stay behind it.', tip:'It is setting the speed for a reason.'},

/* ══ INFORMATION / DIRECTION ═════════════════════════════════════════════ */
{id:'exitSign', name:'Freeway exit', cat:'info', shape:'wide', art:{bg:'green', fg:'white', edge:'white', t:[{s:'EXIT 25',size:22}]},
 means:'Names the numbered exit ahead.', tip:'The number is the distance in km from the start of that freeway — exit 204 is 204 km along.'},
{id:'destinationDistance', name:'Distance to destinations', cat:'info', shape:'square', art:{bg:'green', fg:'white', edge:'white', t:[{s:'BARRIE 42',size:13},{s:'SUDBURY 347',size:11}]},
 means:'How far it is to the places listed, in kilometres.', tip:'Green rectangle with white letters.'},
{id:'advanceExit', name:'Advance exit / lane guidance', cat:'info', shape:'wide', art:{bg:'green', fg:'white', edge:'white', g:'exitArrow', gfg:'white', gs:.62, gy:-4, t:[{s:'HWY 401 EAST',size:11}]},
 means:'Tells you which lane you need for the exit ahead.', tip:'Get over early — the lane change is the hard part.'},
{id:'routeMarker', name:'Provincial highway route marker', cat:'info', shape:'shield', art:{bg:'green', fg:'white', t:[{s:'401',size:30}]},
 means:'Identifies the numbered provincial highway you are on.', tip:'The crown shield means a King’s Highway (400-series and others).'},
{id:'hospitalSign', name:'Hospital', cat:'info', shape:'square', art:{bg:'blue', fg:'white', edge:'white', g:'hospitalH', gs:.55},
 means:'A hospital is nearby, in the direction shown.', tip:'BLUE = services for the traveller.'},
{id:'airportSign', name:'Airport', cat:'info', shape:'square', art:{bg:'blue', fg:'white', edge:'white', g:'plane', gs:.55},
 means:'Route to an airport.', tip:'Blue service sign.'},
{id:'accessibleFacility', name:'Wheelchair accessible facility', cat:'info', shape:'square', art:{bg:'blue', fg:'white', edge:'white', g:'wheelchair', gs:.55},
 means:'The facility ahead is wheelchair accessible.', tip:'Blue and white.'},
{id:'edrSign', name:'Emergency detour route', cat:'info', shape:'square', art:{bg:'green', fg:'white', edge:'white', t:[{s:'EDR',size:24},{s:'DETOUR',size:11}]},
 means:'A pre-planned detour used when a freeway is closed.', tip:'Follow the EDR markers.'},

/* ══ OTHER SHAPES ════════════════════════════════════════════════════════ */
{id:'crossbuck', name:'Railway crossing (crossbuck)', cat:'other', shape:'crossbuck', art:{},
 means:'Railway tracks cross the road right here. Slow, look both ways, listen.', tip:'Big red-and-white X. If a train is coming, stop at least 5 m from the nearest rail.'},
{id:'slowMoving', name:'Slow-moving vehicle', cat:'other', shape:'triUp', art:{},
 means:'The vehicle ahead travels at 40 km/h or less.', tip:'Orange triangle with a red border — on the BACK of a tractor or buggy.'},
{id:'checkerboard', name:'Checkerboard — road changes direction', cat:'other', shape:'square', art:{bg:'yellow', g:'checker', gs:.78, edge:null},
 means:'The road turns sharply or ends here. Follow the pattern.', tip:'Black-and-yellow checker = the road does not continue straight.'},
{id:'chevronMarker', name:'Chevron — sharp change of direction', cat:'other', shape:'wide', art:{bg:'yellow', fg:'black', g:'chevRight', gs:.46, edge:null, t:[]},
 means:'Guides you around a sharp curve. Several are placed along the bend.', tip:'Follow the arrows through the curve.'}
,

/* ── added to match chapter 3 of the handbook ─────────────────────────── */
{id:'schoolBusBoth', name:'Both directions must stop for school bus', cat:'reg', shape:'tall', art:{g:'schoolBus', gs:.78, gy:-6, t:[{s:'BOTH',size:13},{s:'DIRECTIONS',size:10}]},
 means:'On a multi-lane road with no median, traffic BOTH ways must stop for the bus.', tip:'Posted where drivers might assume the median rule applies. It does not.'},
{id:'schoolBusZone', name:'School bus loading zone', cat:'reg', shape:'tall', art:{t:[{s:'SCHOOL BUS',size:11},{s:'LOADING',size:12},{s:'ZONE',size:13}]},
 means:'Buses load and unload here WITHOUT using red lights or the stop arm.', tip:'No flashing lights does not mean no children. Slow down.'},
{id:'roadForksRight', name:'Road forks to the right', cat:'reg', shape:'square', art:{g:'roadBranch', gs:.66},
 means:'The road ahead splits — keep right to stay on the through route.', tip:'A white regulatory sign, not a yellow warning.'},
{id:'keepRightPass', name:'Keep right except to pass', cat:'reg', shape:'tall', art:{t:[{s:'KEEP',size:15},{s:'RIGHT',size:15},{s:'EXCEPT TO',size:10},{s:'PASS',size:14}]},
 means:'On climbing and passing lanes, stay right unless you are actively passing.', tip:'The extra lane exists so faster traffic can get by you.'},
{id:'hiddenSideRoad', name:'Hidden side road ahead', cat:'warn', shape:'diamond', art:{g:'hiddenSide', gs:.52},
 means:'Drivers on the side road ahead cannot see you coming. Expect them to pull out.', tip:'Cover the brake — assume they have not seen you.'},
{id:'fireTruckEntrance', name:'Fire truck entrance', cat:'warn', shape:'diamond', art:{g:'fireTruck', gs:.52},
 means:'Fire trucks enter the road here. Be ready to yield.', tip:'They leave in a hurry and they do not stop for you.'},
{id:'rampSpeed', name:'Maximum safe speed on ramp', cat:'warn', shape:'wide', art:{bg:'yellow', fg:'black', t:[{s:'RAMP 50',size:22}]},
 means:'The highest safe speed for the ramp ahead in good conditions.', tip:'Check your speedometer — after freeway speed, 50 feels like crawling.'},
{id:'constructionKm', name:'Construction one kilometre ahead', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'CONSTRUCTION',size:8},{s:'1 km AHEAD',size:10}]},
 means:'Road work starts one kilometre ahead. Start planning your lane now.', tip:'Orange means temporary, every time.'},
{id:'constructionZone', name:'Construction zone begins', cat:'temp', shape:'diamond', art:{bg:'orange', t:[{s:'CONSTRUCTION',size:8},{s:'ZONE BEGINS',size:10}]},
 means:'You are entering a construction zone. Expect a lower speed limit.', tip:'Fines double here when workers are present.'},
{id:'detourMarker', name:'Detour marker', cat:'temp', shape:'square', art:{bg:'orange', fg:'black', g:'arrRight', gs:.52, gy:-8, t:[{s:'DETOUR',size:14}]},
 means:'Follow these markers until they return you to the regular route.', tip:'Follow the markers, not your map app — it does not know about the closure.'},
{id:'finesDoubled', name:'Construction zone fines doubled', cat:'temp', shape:'tall', art:{bg:'orange', fg:'black', t:[{s:'FINES',size:14},{s:'DOUBLED',size:12},{s:'WHEN WORKERS',size:8},{s:'PRESENT',size:10}]},
 means:'Speeding fines double in this construction zone when workers are present.', tip:'The people beside your car have nothing between them and you.'},
{id:'viaSign', name:'VIA route sign', cat:'info', shape:'wide', art:{bg:'green', fg:'white', edge:'white', t:[{s:'OTTAWA',size:15},{s:'VIA HWY 417',size:11}]},
 means:'Names the road you must follow to reach that destination.', tip:'VIA = the route to take, not the destination itself.'},
{id:'roundaboutDest', name:'Roundabout destination sign', cat:'info', shape:'square', art:{bg:'green', fg:'white', edge:'white', g:'roundaboutSign', gfg:'white', gs:.58},
 means:'Shows the roundabout exits and where each one goes.', tip:'Read it on approach and pick your lane before the yield line.'},
{id:'variableMessage', name:'Variable message sign', cat:'info', shape:'wide', art:{bg:'black', fg:'yellow', edge:null, t:[{s:'CRASH AHEAD',size:13},{s:'2 LANES CLOSED',size:11}]},
 means:'Changes with conditions to warn of delays, closures and collisions ahead.', tip:'Live information — believe it over your route plan.'},
{id:'railStation', name:'Passenger railway station', cat:'info', shape:'square', art:{bg:'blue', fg:'white', edge:'white', g:'train', gs:.58},
 means:'Route to a passenger railway station.', tip:'Blue means services for the traveller.'},
{id:'oversizeLoad', name:'Oversize load (D sign)', cat:'info', shape:'square', art:{t:[{s:'D',size:56}]},
 means:'Marks a vehicle carrying an oversize load. Give it extra room.', tip:'It needs more of the road than its lane provides.'},
{id:'lcvPlacard', name:'Long commercial vehicle (LCV)', cat:'other', shape:'wide', art:{bg:'yellow', fg:'black', t:[{s:'LONG',size:15},{s:'VEHICLE',size:13}]},
 means:'A double trailer up to 40 metres long.', tip:'Passing one takes far longer than you think. Do not start unless the road is clear.'},
{id:'emergencyResponse', name:'Emergency response number', cat:'other', shape:'square', art:{bg:'green', fg:'white', edge:'white', t:[{s:'HWY 401',size:15},{s:'EAST',size:11},{s:'2045',size:17}]},
 means:'The number along the bottom tells emergency crews exactly where you are.', tip:'Read it out when you call 911 from a highway.'},
{id:'bilingualSign', name:'Bilingual sign', cat:'other', shape:'wide', art:{bg:'green', fg:'white', edge:'white', t:[{s:'EXIT 25 SORTIE',size:14}]},
 means:'In designated bilingual areas, the message appears in English and French.', tip:'Read whichever language you know best — they say the same thing.'}

];

const SIGN_CATS = {
  reg:   { label:'Regulatory',  blurb:'Tells you the law. Obey it or get a ticket.',  colour:'White with black, red or blue' },
  warn:  { label:'Warning',     blurb:'Warns of a hazard ahead. Adjust now.',          colour:'Yellow diamond, black symbol' },
  temp:  { label:'Temporary',   blurb:'Road work and short-term conditions.',          colour:'Orange diamond, black symbol' },
  info:  { label:'Information', blurb:'Where things are and how far away.',            colour:'Green, blue or brown rectangle' },
  other: { label:'Special',     blurb:'Unique shapes you must know on sight.',         colour:'Varies by sign' }
};

if (typeof module !== 'undefined') module.exports = { SIGNS, SIGN_CATS, signSVG, SHAPE, INK };
