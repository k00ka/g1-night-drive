/* ── Pit Stop cards: the whole two chapters, in bites ─────────────────── */
const CARDS = [
{t:"licence", title:"The ladder", lines:[
 "G1 → G2 → G. Minimum 20 months, maximum 5 years.",
 "G1: 12 months, or 8 with driver ed.",
 "G2: 12 months minimum.",
 "You need 16 years, a vision test and the knowledge test to start."]},
{t:"licence", title:"G1: what you cannot do", lines:[
 "No alcohol. Zero. None.",
 "No driving between midnight and 5 a.m.",
 "No 400-series highways, QEW, DVP, Gardiner, E.C. Row, Conestoga.",
 "…unless your accompanying driver is a licensed driving instructor.",
 "Every passenger needs a working seatbelt."]},
{t:"licence", title:"Your accompanying driver", lines:[
 "Sits in the FRONT passenger seat.",
 "Holds a valid Class G or higher licence.",
 "Has at least 4 years of driving experience.",
 "Blood alcohol under 0.05.",
 "May have demerit points — but not a suspended licence."]},
{t:"licence", title:"G2: the late-night rule", lines:[
 "Zero alcohol, still.",
 "Aged 19 or under, midnight to 5 a.m.:",
 "First 6 months → 1 passenger aged 19 or under.",
 "After 6 months → up to 3 passengers aged 19 or under.",
 "Exempt: immediate family, or a full-G driver in the front seat."]},
{t:"licence", title:"Road test day", lines:[
 "Arrive 30 minutes early.",
 "Examiner only — no friends, family, instructors or pets.",
 "No backup camera, lane monitoring, cruise or self-parking.",
 "Failed? Wait at least 10 days.",
 "Cancel with under 48 hours notice and the fee is gone."]},

{t:"ready", title:"Belts", lines:[
 "Every seat, every trip. One person per belt.",
 "Shoulder strap across the chest, lap belt low on the hips.",
 "No belt for you: fine + 2 points.",
 "No working belt for a passenger: 30-day suspension."]},
{t:"ready", title:"Kids", lines:[
 "Under 9 kg → rear-facing, in the back, never near a live airbag.",
 "9–18 kg → forward-facing seat with tether.",
 "18–36 kg, under 145 cm, under 8 → booster.",
 "Out of the booster at 8 years OR 36 kg OR 145 cm — any one.",
 "Under 13 → back seat."]},
{t:"ready", title:"Set up the cockpit", lines:[
 "See 4 m of road over the hood.",
 "Head restraint level with the back of your head.",
 "Hands at 9 and 3.",
 "Mirrors set so the views barely overlap — then shoulder check anyway."]},
{t:"ready", title:"Lights", lines:[
 "On from half an hour before sunset to half an hour after sunrise.",
 "On whenever you can see less than 150 m.",
 "High → low within 150 m of oncoming traffic.",
 "High → low within 60 m when following.",
 "Daytime running lights do NOT turn on your tail lights."]},

{t:"along", title:"Speed", lines:[
 "No sign in a city, town or village → 50 km/h.",
 "No sign outside a built-up area → 80 km/h.",
 "The posted limit is a maximum in ideal conditions, not a target.",
 "Drive at a speed that lets you stop within a safe distance."]},
{t:"along", title:"Space", lines:[
 "Two-second rule: pick a marker, count 'one thousand and one, one thousand and two'.",
 "More than two seconds in rain, snow, or behind bikes and trucks.",
 "Mirrors every 5 seconds.",
 "Keep right; left lanes are for passing."]},
{t:"along", title:"Signals", lines:[
 "Signal before turning, changing lanes, slowing, stopping or pulling out.",
 "Signal early — but signalling does NOT give you right-of-way.",
 "Signals broken? Hand signals are legal.",
 "Police directions beat every sign and light."]},

{t:"share", title:"Cyclists", lines:[
 "1 metre minimum when passing. Less = fine + 2 points.",
 "Check mirror and blind spot before you open your door.",
 "Bike lane = solid white line; enter only to turn right.",
 "Sharrow (chevrons + bike) = shared lane, expect riders in the middle.",
 "Stop behind a bike box, never inside it."]},
{t:"share", title:"Big vehicles", lines:[
 "Cannot see the driver's face in their mirror? They cannot see you.",
 "Trucks need far more room to stop — never cut in close.",
 "A right-turning truck may swing LEFT first. Never dive up the right side.",
 "Leave room behind a stopped truck — they roll back."]},
{t:"share", title:"School buses", lines:[
 "Amber flashing → it is about to stop. Prepare.",
 "Red flashing / stop arm out → STOP, both directions.",
 "From behind: stop at least 20 m back.",
 "Median strip? Only traffic behind the bus stops.",
 "Any road, any time, any speed limit. 6 points if you blow it."]},
{t:"share", title:"Streetcars", lines:[
 "Pass on the RIGHT — unless it is a one-way road.",
 "At a stop with no safety island: stay 2 m behind the rear doors.",
 "Safety island: pass at a reasonable speed, watch for people.",
 "Cross tracks at about 90 degrees."]},

{t:"intersections", title:"Who goes first", lines:[
 "Uncontrolled: the driver on the LEFT yields.",
 "All-way stop: first to stop, first to go.",
 "Tie at an all-way stop: the vehicle on the RIGHT goes.",
 "Turning left on a green: you yield to everything oncoming.",
 "Leaving a driveway: you yield to everyone, including the sidewalk."]},
{t:"intersections", title:"Roundabouts", lines:[
 "Traffic flows counter-clockwise. Keep right of the island.",
 "LOOK LEFT — circulating traffic has the right-of-way.",
 "Left turn or straight → left lane. Right turn or straight → right lane.",
 "Never stop inside. Never change lanes inside.",
 "Missed your exit? Go around again.",
 "Signal right after passing the exit before yours."]},
{t:"intersections", title:"Railway crossings", lines:[
 "Train coming? Stop at least 5 m from the nearest rail or gate.",
 "Never drive around a gate that is down, lowering or rising.",
 "A train can take 2 km to stop.",
 "School buses stop at every crossing — with no red lights showing.",
 "Trapped on the tracks? Everyone out, away, then call."]},

{t:"stopping", title:"Where to stop", lines:[
 "Stop line → crosswalk → sidewalk edge → intersection edge, in that order.",
 "A complete stop means the wheels stop turning.",
 "Crossing guard with a stop sign: wait until the guard is off the road too. (3 points)",
 "Right foot for both pedals."]},
{t:"stopping", title:"Braking", lines:[
 "See the stop early, check mirrors, brake early and smoothly.",
 "ABS: press hard, hold, keep steering. The pulsing is normal.",
 "ABS does NOT shorten your stopping distance.",
 "No ABS: threshold brake — hard, ease off when a wheel locks, reapply.",
 "Steep hill: gear down BEFORE you start down."]},

{t:"turns", title:"Turning", lines:[
 "Right turn: start right, finish right.",
 "Left turn: start in the far left lane, finish in the far left lane.",
 "Right on red: complete stop first, then yield, then go — unless posted otherwise.",
 "Left on red: only one-way onto one-way, after a complete stop.",
 "Waiting to turn left? Keep the wheels STRAIGHT."]},
{t:"turns", title:"Turning around", lines:[
 "U-turn: need 150 m of sight in both directions.",
 "No U-turns on curves, hilltops, near bridges, tunnels or railway crossings.",
 "Three-point turn: start from the far right.",
 "Reversing: look over your shoulder, watch for kids and bikes.",
 "No reversing on a divided road over 80 km/h."]},

{t:"positions", title:"Lane changes", lines:[
 "Mirror → blind spot → signal → check again → move.",
 "Hold your speed while you move over.",
 "Never change lanes in or near an intersection.",
 "Move back after passing once you see their whole front end in your mirror."]},
{t:"positions", title:"Passing", lines:[
 "No passing within 30 m of a pedestrian crossover.",
 "No passing left of centre within 30 m of a bridge, viaduct or tunnel.",
 "Right-side passing: only on multi-lane or one-way roads, or past a streetcar or left-turning car.",
 "Shoulder passing: right only, paved only, left-turning vehicle only.",
 "NEVER pass a working snow plow."]},

{t:"parking", title:"Distances that get you a ticket", lines:[
 "3 m — fire hydrant.",
 "6 m — public building entrance.",
 "9 m — uncontrolled intersection.",
 "15 m — signalised intersection, and railway crossing.",
 "100 m — bridge.",
 "125 m — the clear view you need in both directions."]},
{t:"parking", title:"Hills", lines:[
 "Downhill with a curb → wheels INTO the curb.",
 "Uphill with a curb → wheels LEFT, toward the road.",
 "Uphill with NO curb → wheels sharply RIGHT.",
 "Always set the parking brake.",
 "Finish about 30 cm from the curb."]},

{t:"freeway", title:"On and off", lines:[
 "Entrance = ramp + acceleration lane. Match traffic speed BEFORE merging.",
 "Exit = deceleration lane + ramp + intersection. Signal, move over, THEN slow.",
 "Look 15–20 seconds ahead.",
 "Missed your exit? Take the next one. Never stop or reverse."]},
{t:"freeway", title:"HOV lanes", lines:[
 "Open 24/7.",
 "At least 2 people in the vehicle.",
 "Exempt: buses, taxis, airport limos, green-plate EVs, motorcycles, emergency vehicles.",
 "Crossing the striped buffer is illegal.",
 "Commercial vehicles: 2+ people and under 6.5 m long."]},

{t:"night", title:"Night", lines:[
 "Overdriving your headlights = going faster than you can see to stop.",
 "Blinded by oncoming lights? Look up and right, use the edge line.",
 "Passing at night: low beams approaching, high beams alongside.",
 "Bright day into a tunnel: slow down, sunglasses off, headlights on."]},
{t:"night", title:"Weather", lines:[
 "Fog: low beams, never high. Never stop on the travelled road.",
 "Rain: hydroplaning means your tires are skimming. Slow down.",
 "After deep water: test brakes with a firm stop from 50 km/h.",
 "Snow: no cruise control. Black shiny asphalt = black ice.",
 "Whiteout: pull into a safe area and stay with the vehicle.",
 "Snow plows show flashing BLUE lights. Never pass one."]},
{t:"night", title:"Skids", lines:[
 "Ease off the accelerator or brake.",
 "Look and steer where you WANT to go.",
 "Do not overcorrect.",
 "Very slippery? Slip into neutral."]},

{t:"emergencies", title:"After a collision", lines:[
 "Report to police if anyone is injured or damage tops $5,000.",
 "Exchange names, addresses, plate and permit numbers, insurance.",
 "Take witness names and numbers.",
 "Drivable and minor? Steer it, clear it.",
 "Never move an injured person unless there is fire danger."]},
{t:"emergencies", title:"When things break", lines:[
 "Brakes fail → pump, then the parking brake gently while holding the release.",
 "Gas pedal sticks → lift it with your foot, shift to neutral, stop, do not restart.",
 "Blowout → off the gas, steer firmly, coast to a stop.",
 "Off the pavement → grip, ease off, steer back gently.",
 "Headlights fail at night → hazards on, get off the road."]},
{t:"emergencies", title:"Emergency vehicles", lines:[
 "Approaching with lights and siren: pull as far right as safe and STOP.",
 "Stopped on the roadside: slow down AND move over a lane. (3 points if you do not)",
 "Same rule for tow trucks with amber lights.",
 "Never follow a responding fire vehicle within 150 m.",
 "Never drive on or block a freeway shoulder."]},

{t:"lights", title:"Signals", lines:[
 "Yellow = red is coming. Stop if you safely can.",
 "Flashing green / green arrow + green = ADVANCED green. Oncoming traffic is stopped.",
 "Pedestrians may NOT cross on a flashing green.",
 "Flashing red = full stop, then go when safe.",
 "Flashing yellow = proceed with caution.",
 "Dead light = treat it as an all-way stop."]},
{t:"lights", title:"Lines", lines:[
 "YELLOW separates opposing traffic. WHITE separates same-direction traffic.",
 "Broken line on your side → you may cross it.",
 "Solid line on your side → stay put.",
 "Double solid yellow → nobody passes.",
 "Continuity lines (wide, close together) → your lane is ending or exiting."]},
{t:"lights", title:"Shape and colour", lines:[
 "Octagon → STOP. Only ever stop.",
 "Upside-down triangle → YIELD.",
 "Yellow diamond → warning. Orange diamond → temporary road work.",
 "Fluorescent yellow-green pentagon → school.",
 "Red-and-white X → railway crossing.",
 "Green circle = allowed. Red circle + slash = banned.",
 "Green sign = direction. Blue = services. Brown = parks."]},

{t:"penalties", title:"Demerit points", lines:[
 "Points last 2 years from the offence date.",
 "7 — failing to remain, failing to stop for police.",
 "6 — careless driving, racing, school bus, 50+ km/h over.",
 "4 — following too closely, 30–49 over, pedestrian crossover.",
 "3 — hand-held device, failing to yield, disobeying signs, dooring.",
 "2 — seatbelts, lights, signals, improper turns."]},
{t:"penalties", title:"Suspension thresholds", lines:[
 "Novice: 2 points warning → 6 second warning → 9 points = 60-day suspension.",
 "Full licence: 6 warning → 9 second warning → 15 points = 30-day suspension.",
 "Novice escalating sanctions: 30 days → 90 days → licence cancelled."]},
{t:"penalties", title:"Alcohol, drugs, phones", lines:[
 "Novice drivers and everyone 21 and under: ZERO alcohol.",
 "Warn range 0.05–0.08 still costs you your licence on the spot.",
 "Over 0.08 or refusing a test: 90-day suspension + 7-day impound.",
 "Distracted driving, full licence: 3 points + fine + 3-day suspension.",
 "Distracted driving, novice: no points — a 30-day suspension instead.",
 "Stunt driving: 40+ over under 80 zones, 50+ over elsewhere, or 150 km/h. 30-day suspension, 14-day impound."]}
];
