#!/usr/bin/env python3
"""Regenerates src/booksigns.js from the handbook's own sign images and captions.
   Input: signs_from_book.json (extracted from ontario.ca/document/print/book/80362)
   The images themselves are King's Printer for Ontario, reproduced unmodified
   for non-commercial use with credit, per ontario.ca's copyright terms."""
import json, re, sys, os

NAMES = ["Stop","School zone","Yield","Railway crossing (crossbuck)","Bicycle route",
"Parking permitted between the signs","Snowmobiles permitted","Do not enter","Do not stop","Do not stand",
"Do not park","No left turn","Do not drive through the intersection","No U-turn","No right turn on red",
"No left turn during posted times","Accessible parking permit only","No bicycles","No pedestrians",
"Keep right of the traffic island","Speed limit changes ahead","Do not pass","Slow traffic keep right",
"Community safety zone","School zone speed limit","Stop for school bus when signals flash",
"Both directions stop for school bus","Lane must travel as the arrow shows","One way","Pedestrian crossover",
"Two-way left-turn lane","Accessible passenger loading zone","Reserved lane for specific vehicles",
"Keep right except to pass","Yield to the bus","Road forks to the right","School bus loading zone",
"High Occupancy Vehicle (HOV) lane","No lane change into or out of the HOV lane","Narrow bridge ahead",
"Road branching off ahead","Intersection ahead","Roundabout ahead","Side road with a blocked view",
"Pavement narrows ahead","Slight bend or curve ahead","Maximum safe speed for the curve","Sharp bend or turn ahead",
"Chevron — guides you around a curve","Winding road ahead","Bridge lifts or swings","Paved surface ends",
"Bicycle crossing ahead","Stop sign ahead","Share the road with oncoming traffic","Share the road with cyclists",
"Slippery when wet","Hazard at the edge of the road","Divided highway begins","Right lane ends ahead",
"Traffic lights ahead","Steep hill ahead","Two roads merging into one","Snowmobiles cross this road",
"Divided highway ends","Underpass ahead — low clearance","Bump or uneven pavement","Railway crossing ahead",
"Sharp turn — checkerboard marker","Deer crossing","Truck entrance ahead","Maximum safe speed on the ramp",
"Watch for pedestrians","Fallen rock zone","Water flowing over the road","Hidden school bus stop ahead",
"Bus entrance ahead","Fire truck entrance ahead","School crossing","Construction one kilometre ahead",
"Road work ahead","Survey crew working","Traffic control person ahead","Construction zone begins",
"Temporary detour","Flashing arrow — follow the direction","Grooved or milled pavement",
"Lane closed ahead for road work","Closed lane — merge as the arrow shows","Do not pass the pace vehicle",
"Reduce speed, be prepared to stop","Detour marker","Construction zone fines doubled",
"Directions to nearby towns","Distances in kilometres","Freeway exit","Advance exit — lane guidance",
"Exit lanes marked EXIT ONLY","Interchange (exit) number","VIA — the route to follow","Roundabout destinations",
"Variable message sign","Off-road facilities","Passenger railway station","Airport",
"Wheelchair accessible facility","Oversize load (D sign)","Slow-moving vehicle","Emergency detour route (EDR)",
"Long commercial vehicle (LCV)","Emergency response number","Bilingual sign"]

IDS = ["stop","schoolZone","yield","railwayCrossbuck","bicycleRoute","parkingPermitted","snowmobilesPermitted",
"doNotEnter","noStopping","noStanding","noParking","noLeftTurn","noStraight","noUturn","noRightOnRed",
"noLeftTimed","accessibleParking","noBicycles","noPedestrians","keepRightIsland","speedAhead","doNotPass",
"slowKeepRight","communitySafety","schoolZoneSpeed","stopForSchoolBus","schoolBusBoth","laneArrows","oneWay",
"pedCrossover","twoWayLeft","accessibleLoading","reservedLane","keepRightPass","yieldToBus","roadForksRight",
"schoolBusZone","hovLane","hovNoChange","narrowBridge","roadBranch","crossroadAhead","roundaboutAhead",
"hiddenSideRoad","roadNarrows","curveAhead","maxSafeSpeed","sharpTurn","chevronMarker","windingRoad",
"bridgeLifts","pavementEnds","bicycleCrossing","stopAhead","twoWayAhead","shareRoad","slippery","hazardEdge",
"dividedBegins","rightLaneEnds","signalAhead","steepHill","mergeAhead","snowmobileCross","dividedEnds",
"lowClearance","bumpAhead","railwayAhead","checkerboard","deerCrossing","truckEntrance","rampSpeed",
"pedestrianAhead","fallingRock","waterOverRoad","hiddenBusStop","busEntrance","fireTruckEntrance",
"schoolCrossing","constructionKm","roadWorkAhead","surveyCrew","flagperson","constructionZone","detourSign",
"flashingArrow","groovedPavement","laneClosedAhead","closedLane","doNotPassPace","reduceSpeedStop",
"detourMarker","finesDoubled","destinationDirection","destinationDistance","exitSign","advanceExit",
"exitLanes","exitNumber","viaSign","roundaboutDest","variableMessage","offRoadFacilities","railStation",
"airportSign","accessibleFacility","oversizeLoad","slowMoving","edrSign","lcvPlacard","emergencyResponse",
"bilingualSign"]

src = json.load(open(sys.argv[1]))
assert len(src) == len(NAMES) == len(IDS), f"{len(src)} images vs {len(NAMES)} names vs {len(IDS)} ids"

def clean(t):
    t = re.sub(r'\s+', ' ', t).replace('­', '').strip()
    return t

out = []
for i, r in enumerate(src):
    cap = clean(r['caption'])
    sents = [s for s in re.split(r'(?<=[.!?])\s+', cap) if s.strip()]
    means = sents[0] if sents else cap
    if len(means) < 40 and len(sents) > 1: means = ' '.join(sents[:2])
    tip = ' '.join(sents[1:])[:200] if len(sents) > 1 else ''
    if means.startswith(tip[:20]) and tip: tip = ''
    out.append({'id': IDS[i], 'file': r['file'], 'cat': r['cat'],
                'name': NAMES[i], 'means': means[:240], 'tip': tip.strip()})

def js(s): return json.dumps(s, ensure_ascii=False)
lines = ["/* ── The handbook's own sign artwork and wording ───────────────────────────",
 "   GENERATED by tools/build-signs.py — do not hand-edit.",
 "   Images and descriptions: The Official MTO Driver's Handbook, chapter 3.",
 "   © King's Printer for Ontario. Reproduced unmodified for non-commercial use",
 "   with credit, per the reproduction terms published on ontario.ca.        */",
 "const BOOK_SIGNS = ["]
for o in out:
    lines.append("{id:%s, file:%s, cat:%s, name:%s," % (js(o['id']), js(o['file']), js(o['cat']), js(o['name'])))
    lines.append(" means:%s, tip:%s}," % (js(o['means']), js(o['tip'])))
lines[-1] = lines[-1].rstrip(',')
lines += ["];", "if (typeof module !== 'undefined') module.exports = BOOK_SIGNS;"]
open(sys.argv[2], 'w').write('\n'.join(lines) + '\n')
print(f"wrote {sys.argv[2]}: {len(out)} signs")
from collections import Counter
print(' by category:', dict(Counter(o['cat'] for o in out)))
