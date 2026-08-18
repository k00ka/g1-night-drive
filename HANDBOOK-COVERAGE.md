# Handbook coverage

What this app tests, and how it was checked against the source.

## Signs — chapter 3

The catalogue is the handbook's sign set. It was audited line by line against
the "Signs" section of the official handbook (fetched from the ontario.ca print
edition), and reconciled in both directions.

### Removed — signs the app had that the handbook does not

| Sign | Why it went |
|---|---|
| Dip ahead | Not an Ontario sign at all — that's US MUTCD. Spotted by a student. |
| Moose area | Real in the north, not in the guide |
| Yield sign ahead | Real, not in the guide |
| T-intersection ahead | Real, not in the guide |
| Y-intersection ahead | Real, not in the guide |
| No trucks | Real, not in the guide |
| No right turn | Real, not in the guide (the guide shows no-left-turn only) |
| Object marker | Not in the guide; "hazard at the edge of the road" is its version |
| Crossing guard stop sign | Described in the text, not shown as a sign |
| Fuel / Food / Campground | Blue and brown service signs aren't in the guide's list |
| Keep right | Duplicate of "keep right of island" |

Kept despite not appearing in chapter 3: **maximum speed** signs, because
chapter 2 teaches the 50 and 80 km/h defaults and they are certain to be tested;
and the **King's Highway route marker**, referenced throughout.

### Added — handbook signs the app was missing

Both-directions school bus stop · school bus loading zone · road forks to the
right · keep right except to pass · hidden side road · fire truck entrance ·
maximum safe speed on ramp · construction 1 km ahead · construction zone begins ·
detour marker · construction fines doubled · VIA route sign · roundabout
destinations · variable message sign · passenger railway station · oversize load
(D sign) · long commercial vehicle placard · emergency response number ·
bilingual sign.

### Shape corrections

The school zone/crossing sign is a pentagon with **square bottom corners and
vertical sides**, cropped to a peak at the top — not a shape that is widest
across the middle.

## Diagrams — chapter 2

Every diagram in chapter 2 is there to make one point, so each point should be
askable. All **59 diagrams** (2-1 through 2-59) were extracted from the handbook
with their captions and cross-checked against the question bank. 51 of the 55
distinct teaching points were already covered; the gaps were closed with new
questions on:

- the white **X pavement marking** ahead of a railway crossing (2-25)
- older **traffic circles** vs modern roundabouts, and yield-to-the-left (2-42)
- **glare on a wet road** at night (2-59)
- cyclists' **road position** and the door zone beside parking bays (2-10, 2-11)
- staying ready to **take over from driver-assist technology** (2-1)
- **passing and climbing lanes** (2-48)
- left turn from a **one-way onto a two-way** road (2-33)
- where to stop with **no line, no crosswalk and no sidewalk** (2-24)
- **truck blind spots** and two vehicles **turning left across each other** (2-15/2-17, 2-20)

## Impairment

The handbook mentions drugs about 50 times and gives drowsy driving its own
section; neither was represented here, which left impairment reading as an
alcohol-only subject. Added 19 questions and two study decks covering:

- drug impairment as a Criminal Code offence, chargeable with the vehicle stationary
- what police may demand — field sobriety tests, a drug recognition evaluation,
  oral fluid, urine or blood — and that refusing is charged like failing
- prescription and over-the-counter medicines, and the days-long interaction with alcohol
- roadside spot checks, and blood samples where breath is impractical
- the 45-day impoundment for driving while suspended for a Criminal Code offence
- drowsiness: the eight warning signs, the 2–6 a.m. and 2–4 p.m. risk windows,
  that a tired driver can be as impaired as a drunk one, and that caffeine is
  never a substitute for sleep
- what to do when another driver's aggression makes you feel threatened

## Re-running the audit

`tools/` holds the scripts. The handbook text used for the check comes from
`https://www.ontario.ca/document/print/book/80362`, which is the whole book on
one page; the diagram list is recoverable by searching it for `Diagram 2-`.
