/* ── Sign pictograms ──────────────────────────────────────────────────────
   Every glyph is drawn inside a 100×100 box, centred on (50,50), and paints
   in `currentColor` so one glyph can appear black-on-yellow (warning) or
   white-on-red (regulatory) without a second copy.                        */

const G = {};

/* people ---------------------------------------------------------------- */
G.ped = `<circle cx="50" cy="13" r="9"/><path d="M50 24 36 32v6l10-4v14L34 78h8l10-22 10 22h8L58 48V34l10 4v-6z"/>`;

G.pedTwo = `<g><circle cx="34" cy="16" r="8"/><path d="M34 26 22 33v6l9-4v12l-10 26h7l8-19 8 19h7L45 47V35l9 4v-6z"/></g>
<g><circle cx="70" cy="20" r="7"/><path d="M70 29 60 35v6l7-3v10l-8 22h6l7-16 7 16h6l-8-22V38l7 3v-6z"/></g>`;

G.pedCane = `<circle cx="46" cy="13" r="9"/><path d="M46 24 32 32v6l10-4v14L30 78h8l10-22 10 22h8L54 48V34l10 4v-6z"/><path d="M66 30h5v52h-5z"/>`;

G.worker = `<path d="M50 4c-12 0-20 8-21 17h42C70 12 62 4 50 4z"/><rect x="24" y="21" width="52" height="7" rx="3"/>
<path d="M42 31h14l12 8v20h-8V48l-4 3v45h-8V64h-4v32h-8V51l-4-3v11h-8V39z"/>
<path d="M66 44 87 71" stroke="currentColor" stroke-width="6" fill="none"/>
<path d="M83 65l15 11-7 9-14-12z"/>`;

G.flagger = `<circle cx="38" cy="12" r="9"/>
<path d="M38 23 26 30v8l8-4v12L24 88h9l7-20 7 20h9L46 46V34l8 4v-8z"/>
<path d="M62 6v84" stroke="currentColor" stroke-width="5" fill="none"/>
<path d="M64 8h30v24H64z"/>`;

G.survey = `<circle cx="32" cy="12" r="9"/>
<path d="M32 23 20 30v8l8-4v12L18 88h9l7-19 7 19h9L42 46V34l8 4v-8z"/>
<g stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round">
<path d="M76 42v10"/><path d="M76 52 62 88"/><path d="M76 52 90 88"/><path d="M76 52v36"/></g>
<rect x="63" y="28" width="26" height="13" rx="3"/>`;

/* vehicles -------------------------------------------------------------- */
G.car = `<path d="M12 62c0-4 2-7 6-8l5-16c1-4 4-6 8-6h38c4 0 7 2 8 6l5 16c4 1 6 4 6 8v12H78v-6H22v6H12z"/>
<path d="M30 40h40l4 12H26z" fill="#fff" opacity=".0"/><circle cx="28" cy="72" r="7"/><circle cx="72" cy="72" r="7"/>`;

G.carPlain = `<path d="M10 60c0-5 3-8 7-9l6-15c2-4 5-6 9-6h36c4 0 7 2 9 6l6 15c4 1 7 4 7 9v10h-9a8 8 0 0 0-16 0H35a8 8 0 0 0-16 0h-9z"/>
<circle cx="27" cy="70" r="8"/><circle cx="73" cy="70" r="8"/>`;

G.truck = `<path d="M4 26h52v38H4z"/><path d="M58 38h18l14 14v12H58z"/>
<rect x="62" y="42" width="14" height="10" rx="2" fill="var(--cut,#fff)"/>
<circle cx="22" cy="70" r="9"/><circle cx="76" cy="70" r="9"/>`;

G.bus = `<rect x="8" y="20" width="84" height="48" rx="7"/>
<rect x="14" y="27" width="24" height="15" rx="3" fill="var(--cut,#fff)"/>
<rect x="42" y="27" width="18" height="15" rx="3" fill="var(--cut,#fff)"/>
<rect x="64" y="27" width="22" height="15" rx="3" fill="var(--cut,#fff)"/>
<circle cx="26" cy="72" r="9"/><circle cx="74" cy="72" r="9"/>`;

G.schoolBus = `<path d="M6 22h62l24 24v24H6z"/>
<rect x="12" y="29" width="17" height="14" rx="3" fill="var(--cut,#fff)"/>
<rect x="33" y="29" width="17" height="14" rx="3" fill="var(--cut,#fff)"/>
<rect x="54" y="29" width="14" height="14" rx="3" fill="var(--cut,#fff)"/>
<circle cx="24" cy="76" r="9"/><circle cx="74" cy="76" r="9"/>`;

G.streetcar = `<rect x="18" y="18" width="64" height="50" rx="6"/>
<rect x="25" y="26" width="22" height="17" rx="3" fill="var(--cut,#fff)"/>
<rect x="53" y="26" width="22" height="17" rx="3" fill="var(--cut,#fff)"/>
<path d="M50 4v14M34 8h32" stroke="currentColor" stroke-width="4" fill="none"/>
<circle cx="34" cy="72" r="6"/><circle cx="66" cy="72" r="6"/>`;

G.bike = `<circle cx="24" cy="64" r="17" fill="none" stroke="currentColor" stroke-width="6"/>
<circle cx="76" cy="64" r="17" fill="none" stroke="currentColor" stroke-width="6"/>
<path d="M24 64 44 34h16L76 64M44 34l10 30M40 30h14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`;

G.motorcycle = `<circle cx="22" cy="66" r="15" fill="none" stroke="currentColor" stroke-width="6"/>
<circle cx="78" cy="66" r="15" fill="none" stroke="currentColor" stroke-width="6"/>
<path d="M22 66h20l10-16h18l8 16" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
<path d="M38 44h16v8H38z"/>`;

G.snowmobile = `<path d="M22 54h20l10-16h18l10 16h12v12H22z"/>
<path d="M10 74h74c5 0 8 4 8 9H16c-4 0-6-4-6-9z"/>
<path d="M4 74c0-7 5-12 12-12h8l-3 12z"/>
<path d="M62 38 76 24h16v8H80l-8 9z"/>
<rect x="44" y="42" width="20" height="11" rx="3" fill="var(--cut,#fff)"/>`;

G.tractor = `<circle cx="26" cy="66" r="19" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="76" cy="70" r="12" fill="none" stroke="currentColor" stroke-width="7"/>
<path d="M18 44h22V28h20v16h16l6 16H18z"/>`;

G.buggy = `<circle cx="30" cy="70" r="14" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="74" cy="70" r="10" fill="none" stroke="currentColor" stroke-width="6"/>
<path d="M18 30h44v34H18z"/><path d="M62 46h22v6H62z"/>`;

G.train = `<rect x="26" y="4" width="12" height="14" rx="2"/>
<path d="M16 18h40a12 12 0 0 1 12 12v12l18 20H16z"/>
<rect x="26" y="26" width="14" height="12" rx="2" fill="var(--cut,#fff)"/>
<rect x="46" y="26" width="12" height="12" rx="2" fill="var(--cut,#fff)"/>
<circle cx="30" cy="70" r="7"/><circle cx="56" cy="70" r="7"/>
<path d="M2 80h96v8H2z"/><path d="M14 74h7v20h-7zM79 74h7v20h-7z"/>`;

G.wheelchair = `<circle cx="56" cy="14" r="10"/><circle cx="52" cy="62" r="26" fill="none" stroke="currentColor" stroke-width="7"/>
<path d="M40 28h8v22h22v8H44l-4-4z"/><path d="M62 58l12 22h12" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;

G.deer = `<g stroke="currentColor" fill="none" stroke-linecap="round" stroke-width="9">
<path d="M58 60 67 76 61 91"/><path d="M46 61 55 76 64 89"/>
<path d="M34 60 23 76 14 87"/><path d="M26 58 15 70 18 89"/></g>
<path d="M20 42 6 30" stroke="currentColor" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M52 38 70 20l13 12-16 22z"/><ellipse cx="42" cy="50" rx="25" ry="15"/>
<g transform="rotate(-26 78 20)"><ellipse cx="78" cy="20" rx="17" ry="9"/><path d="M70 12 66 2 76 8z"/></g>
<g stroke="currentColor" fill="none" stroke-linecap="round" stroke-width="6">
<path d="M72 9 61 -1"/><path d="M75 8 79 -6"/><path d="M63 2 53 3"/><path d="M78 -4 89 0"/></g>`;

G.moose = `<g stroke="currentColor" fill="none" stroke-linecap="round" stroke-width="9">
<path d="M54 64 52 93"/><path d="M66 65 68 93"/><path d="M82 62 86 93"/><path d="M90 60 94 93"/></g>
<path d="M50 36c12-6 32-5 42 2 6 5 8 11 8 17v8c0 5-4 8-9 8H56c-7 0-11-4-11-11l1-16z"/>
<path d="M50 40 30 28l4 18z"/>
<g transform="rotate(16 20 34)"><ellipse cx="20" cy="34" rx="15" ry="8"/></g>
<path d="M8 40c-4 6-3 13 1 16 4-4 4-12-1-16z"/>
<g transform="rotate(-40 16 18)"><ellipse cx="16" cy="18" rx="19" ry="9"/></g>
<g transform="rotate(28 48 13)"><ellipse cx="48" cy="13" rx="16" ry="8"/></g>`;

/* road geometry --------------------------------------------------------- */
const road = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="square"/>`;

G.crossroad = `<path d="M44 6h12v88H44z"/><path d="M6 44h88v12H6z"/>`;
G.tIntersect = `<path d="M6 44h88v12H6z"/><path d="M44 50h12v44H44z"/>`;
G.sideRoadRight = `<path d="M44 6h12v88H44z"/><path d="M56 44h38v12H56z"/>`;
G.sideRoadRightAngle = `<path d="M44 6h12v88H44z"/><path d="M53 46 92 18l7 10-39 28z"/>`;
G.yIntersect = `<path d="M44 50h12v44H44z"/><path d="M44 52 16 14l10-7 26 36z"/><path d="M56 52 84 14l-10-7-26 36z"/>`;
G.roadBranch = `<path d="M44 30h12v64H44z"/><path d="M52 36 84 6l8 9-32 30z"/>`;

G.curveRight = `<path d="M38 94V56c0-16 24-16 24-32V22h-9l15-18 15 18h-9v2c0 24-24 20-24 34v36z"/>`;
G.curveLeft = `<g transform="translate(100,0) scale(-1,1)">${G.curveRight}</g>`;
G.sharpRight = `<path d="M38 94V40c0-8 5-13 13-13h13V14l22 19-22 19V39H51c-1 0-1 1-1 2v53z"/>`;
G.sharpLeft = `<g transform="translate(100,0) scale(-1,1)">${G.sharpRight}</g>`;
G.winding = `<path d="M40 94V64c0-12 20-12 20-24s-20-12-20-24v-4h-9l15-16 15 16h-9v4c0 8 20 10 20 24s-20 16-20 28v26z"/>`;
G.chevRight = `<path d="M28 8 76 50 28 92V64l18-14-18-14z"/>`;
G.chevLeft = `<g transform="translate(100,0) scale(-1,1)">${G.chevRight}</g>`;

G.merge = `<path d="M42 94V46L26 30l8-8 16 16V10h12v76z"/><path d="M64 40 82 22l8 8-18 18z"/>`;
G.laneEndsRight = `<path d="M36 94V6h12v88z"/><path d="M70 94V54c0-14-14-14-14-28V22h12v4c0 8 14 8 14 28v40z"/>`;
G.roadNarrows = `<path d="M18 94V56l14-24V6h8v28L26 58v36z"/><path d="M82 94V56L68 32V6h-8v28l14 24v36z"/>`;
G.dividedBegin = `<g stroke="currentColor" fill="none" stroke-width="9">
<path d="M50 96V72c0-14-16-18-16-32V26"/><path d="M50 72c0-14 16-18 16-32V26"/></g>
<path d="M34 4 23 27h22z"/><path d="M66 4 55 27h22z"/><ellipse cx="50" cy="48" rx="6" ry="15"/>`;
G.dividedEnd = `<g stroke="currentColor" fill="none" stroke-width="9">
<path d="M34 96V74c0-14 16-18 16-32V26"/><path d="M66 96V74c0-14-16-18-16-32"/></g>
<path d="M50 4 39 27h22z"/><ellipse cx="50" cy="78" rx="6" ry="14"/>`;
G.twoWayTraffic = `<path d="M30 92V30h-9l15-20 15 20h-9v62z"/><path d="M70 8v62h9L64 90 49 70h9V8z"/>`;

G.roundabout = `<path d="M50 12a38 38 0 1 0 38 38h-14a24 24 0 1 1-24-24z" /><path d="M44 4 68 18 44 32z"/>`;
G.roundaboutSign = `<circle cx="50" cy="52" r="20" fill="none" stroke="currentColor" stroke-width="9"/>
<path d="M46 6h8v18h-8z"/><path d="M46 80h8v14h-8z"/><path d="M6 48h18v8H6z"/><path d="M76 48h18v8H76z"/>`;

/* hazards --------------------------------------------------------------- */
G.bump = `<path d="M6 74h88v10H6z"/><path d="M18 74c0-18 14-30 32-30s32 12 32 30h-14c0-10-8-18-18-18s-18 8-18 18z"/>`;
G.dip = `<path d="M6 40h14c0 14 12 26 30 26s30-12 30-26h14c0 24-20 42-44 42S6 64 6 40z"/>`;
G.narrowBridge = `<path d="M20 10h12v80H20z"/><path d="M68 10h12v80H68z"/><path d="M6 40h14v20H6z"/><path d="M80 40h14v20H80z"/>`;
G.lowClearance = `<path d="M4 8h92v17H4z"/><rect x="10" y="25" width="12" height="32"/><rect x="78" y="25" width="12" height="32"/>
<path d="M4 84h92v10H4z"/><path d="M46 34h8v46h-8z"/>
<path d="M50 24 40 42h20z"/><path d="M50 90 40 72h20z"/>`;
G.hill = `<path d="M6 88 88 16v72z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>
<g transform="rotate(-41 52 58)"><path d="M34 46h24v13H34z"/><path d="M58 49h9l6 6v4H58z"/>
<circle cx="41" cy="62" r="5"/><circle cx="66" cy="62" r="5"/></g>`;
G.slippery = `<path d="M18 50c0-5 3-8 8-9l7-14c2-4 5-6 9-6h20c4 0 7 2 9 6l7 14c5 1 8 4 8 9v10H18z"/>
<path d="M37 31h26l4 9H33z" fill="var(--cut,#fff)"/>
<circle cx="30" cy="64" r="8"/><circle cx="70" cy="64" r="8"/>
<g stroke="currentColor" fill="none" stroke-width="6" stroke-linecap="round">
<path d="M12 86c8-5 8-13 0-18"/><path d="M33 92c8-5 8-13 0-18"/>
<path d="M67 92c-8-5-8-13 0-18"/><path d="M88 86c-8-5-8-13 0-18"/></g>`;
G.rocks = `<path d="M6 92 34 8h11v84z"/>
<path d="M55 38l13-6 9 11-7 13-13 2-6-11z"/>
<circle cx="82" cy="64" r="9"/><circle cx="62" cy="80" r="8"/><circle cx="86" cy="87" r="6"/>`;
G.water = `<path d="M8 44h84v14H8z"/><path d="M8 66c8 0 8 8 16 8s8-8 16-8 8 8 16 8 8-8 16-8 8 8 16 8" fill="none" stroke="currentColor" stroke-width="8"/>
<path d="M28 12h12v32H28zM60 12h12v32H60z"/>`;
G.pavementEnds = `<path d="M8 20h84v26H8z"/><path d="M10 56h16v12H10zM34 56h16v12H34zM58 56h16v12H58zM82 56h10v12h-10z"/>
<path d="M18 76h16v10H18zM46 76h16v10H46zM74 76h14v10H74z"/>`;
G.hazardEdge = `<rect x="72" y="16" width="16" height="74" rx="3"/>
<path d="M46 96V64c0-16-16-20-16-34v-6" stroke="currentColor" stroke-width="10" fill="none"/>
<path d="M30 2 18 26h24z"/>`;
G.liftBridge = `<rect x="2" y="58" width="46" height="12" rx="2"/><rect x="74" y="58" width="24" height="12" rx="2"/>
<rect x="8" y="70" width="10" height="26"/><rect x="82" y="70" width="10" height="26"/>
<g transform="rotate(-56 48 64)"><rect x="48" y="58" width="40" height="12" rx="2"/></g>`;
G.signalAhead = `<rect x="32" y="6" width="36" height="86" rx="8"/><circle cx="50" cy="26" r="10" fill="#ff5252"/><circle cx="50" cy="50" r="10" fill="#ffd400"/><circle cx="50" cy="74" r="10" fill="#3ddc84"/>`;
G.truckEntrance = `<path d="M8 74h84v9H8z"/><path d="M10 28h44v34H10z"/><path d="M56 38h16l12 12v12H56z"/>
<rect x="60" y="42" width="12" height="9" rx="2" fill="var(--cut,#fff)"/>
<circle cx="26" cy="66" r="7"/><circle cx="72" cy="66" r="7"/>`;
G.bikeCross = `<path d="M6 40h88v8H6z" opacity=".35"/><g transform="translate(0,6) scale(1,.92)">${G.bike}</g>`;


G.fireTruck = `<path d="M4 30h46v34H4z"/><path d="M52 40h20l14 12v12H52z"/>
<rect x="56" y="44" width="13" height="9" rx="2" fill="var(--cut,#fff)"/>
<g transform="rotate(-9 12 20)"><rect x="12" y="14" width="52" height="9" rx="3"/></g>
<circle cx="22" cy="70" r="8"/><circle cx="74" cy="70" r="8"/><circle cx="70" cy="24" r="6"/>`;

G.hiddenSide = `<path d="M44 6h12v88H44z"/><path d="M56 44h38v12H56z"/><rect x="66" y="16" width="12" height="22" rx="2"/>`;

/* control devices ------------------------------------------------------- */
G.octagon = `<path d="M32 8h36l24 24v36L68 92H32L8 68V32z"/>`;
G.triangleDown = `<path d="M6 10h88L50 92z"/>`;
G.stopAheadWord = `<path d="M32 8h36l24 24v36L68 92H32L8 68V32z"/>`;
G.parkingP = `<path d="M28 8h30c16 0 26 10 26 24S74 56 58 56H46v36H28z M46 24v16h10c5 0 8-3 8-8s-3-8-8-8z"/>`;

/* arrows ---------------------------------------------------------------- */
G.arrUp = `<path d="M50 4 82 42H64v54H36V42H18z"/>`;
G.arrRight = `<path d="M96 50 58 82V64H12V36h46V18z"/>`;
G.arrLeft = `<g transform="translate(100,0) scale(-1,1)">${G.arrRight}</g>`;
G.turnRight = `<path d="M34 96V44c0-8 6-14 14-14h16V12l30 26-30 26V46H50c-1 0-2 1-2 2v48z"/>`;
G.turnLeft = `<g transform="translate(100,0) scale(-1,1)">${G.turnRight}</g>`;
G.uTurn = `<path d="M30 96V44a20 20 0 0 1 40 0v22h12L64 92 46 66h12V44a8 8 0 0 0-16 0v52z"/>`;
G.straightRight = `<path d="M26 96V32H14L30 8l16 24H34v64z"/><path d="M52 96V56c0-8 5-13 13-13h13V30l20 19-20 19V55H68c-2 0-2 1-2 2v39z" opacity=".95"/>`;
G.twoWayLeftLane = `<path d="M22 90V54c0-9 6-15 15-15h9V26L74 46 46 66V53h-7c-2 0-3 1-3 3v34z"/>
<path d="M78 10v36c0 9-6 15-15 15h-9v13L26 54 54 34v13h7c2 0 3-1 3-3V10z" opacity=".55"/>`;
G.keepRight = `<path d="M34 96V52c0-14 10-24 24-24V12l26 22-26 22V44c-6 0-10 4-10 10v42z"/>`;
G.keepRightIsland = `<path d="M22 94 44 6h12l22 88H62L50 40 38 94z" opacity=".25"/><path d="M56 94V50c0-10 6-16 16-16V22l22 18-22 18V48c-4 0-6 2-6 6v40z"/>`;
G.laneArrows = `<path d="M20 92V36H8L26 12l18 24H32v56z"/><path d="M60 92V50c0-8 5-13 13-13h11V24l18 17-18 17V49H74c-2 0-2 1-2 2v41z"/>`;
G.detour = `<path d="M8 76h34c8 0 8-10 0-10H30c-14 0-14-22 0-22h30V28l24 21-24 21V56H32c-6 0-6 4 0 4h12c16 0 16 26 0 26H8z"/>`;
G.exitArrow = `<path d="M20 92V44c0-14 10-24 24-24h20V6l26 22-26 22V38H50c-6 0-8 4-8 10v44z"/>`;
G.laneClosedRight = `<g stroke="currentColor" stroke-width="9" fill="none"><path d="M26 94V6"/><path d="M64 94V54"/></g>
<g stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"><path d="M46 10 84 42M84 10 46 42"/></g>`;
G.arrowFlash = `<path d="M4 50 40 14v22h56v28H40v22z"/>`;

/* services / info ------------------------------------------------------- */
G.hospitalH = `<path d="M22 12h16v28h24V12h16v76H62V56H38v32H22z"/>`;
G.plane = `<path d="M50 4c5 0 8 6 8 14v18l34 20v10L58 56v20l12 10v8l-20-6-20 6v-8l12-10V56L8 66V56l34-20V18C42 10 45 4 50 4z"/>`;
G.fuel = `<path d="M14 8h40v84H14z" /><rect x="22" y="18" width="24" height="18" fill="#fff" opacity=".35"/>
<path d="M58 30h10v42a6 6 0 0 0 12 0V44h8v28a14 14 0 0 1-28 0z"/><path d="M66 16h8v16h-8z"/>`;
G.food = `<path d="M18 8h8v34h4V8h8v34h4V8h8v40c0 8-4 12-10 14v30h-12V62c-6-2-10-6-10-14z"/>
<path d="M62 8h12c8 0 10 8 10 20s-4 22-10 24v40H62z"/>`;
G.phone = `<path d="M28 8h44v14H28z"/><path d="M36 22h28v34H36z"/><path d="M42 56h16v36H42z"/><circle cx="50" cy="70" r="6" fill="#fff" opacity=".4"/>`;
G.camp = `<path d="M50 8 92 90H8z"/><path d="M50 34 74 82H26z" fill="#fff" opacity=".3"/>`;
G.transitBus = `<rect x="14" y="14" width="72" height="54" rx="8"/>
<rect x="21" y="22" width="58" height="20" rx="4" fill="var(--cut,#fff)"/>
<circle cx="30" cy="74" r="9"/><circle cx="70" cy="74" r="9"/>`;

G.noEntry = `<circle cx="50" cy="50" r="44" fill="#C8102E"/><rect x="22" y="42" width="56" height="16" rx="2" fill="#FFFFFF"/>`;

const _hookL = `<rect x="34" y="44" width="11" height="52"/><rect x="14" y="44" width="31" height="11"/><path d="M14 35v29L0 49.5z"/>`;
G.twoWayLeft2 = `${_hookL}<g transform="rotate(180 50 50)">${_hookL}</g>`;

/* markings -------------------------------------------------------------- */
G.hovDiamond = `<path d="M50 6 88 50 50 94 12 50z"/>`;
G.crossbuckArt = `<path d="M6 18 18 6l76 76-12 12z"/><path d="M82 6l12 12-76 76L6 82z"/>`;
G.slowVeh = `<path d="M50 8 94 88H6z"/>`;
G.stripes = `<path d="M2 76 32 4h17L19 76z"/><path d="M40 76 70 4h17L57 76z"/>`;
G.checker = `<path d="M6 6h22v22H6zM50 6h22v22H50zM28 28h22v22H28zM72 28h22v22H72zM6 50h22v22H6zM50 50h22v22H50zM28 72h22v22H28zM72 72h22v22H72z"/>`;

if (typeof module !== 'undefined') module.exports = G;
