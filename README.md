# G1 Night Drive

**▶ Play: https://k00ka.github.io/g1-night-drive/**

An arcade-styled study guide for the Ontario G1 knowledge test, built from
*The Official MTO Driver's Handbook* (ISBN 978-1-4868-8628-9), chapters 1 and 2,
plus the traffic signs, lights and pavement markings the test also covers.

Ships as **one self-contained HTML file** — no server, no network calls, no
external assets. Fonts are embedded as base64 woff2. Progress saves to
`localStorage` on the player's own device.

## Contents

| Piece | Count |
|---|---|
| Road signs (hand-drawn SVG) | 114 — every sign in the handbook |
| Rules-of-the-road questions | 292 |
| Distance / number facts | 38 |
| Right-of-way scenarios | 16 |
| Shape & colour decoder items | 14 |
| Study card decks | 41 |

## Games

- **Sign Sprint** — 90-second timed sign identification with a streak multiplier
- **Shape & Colour** — read a sign you have never seen, from its shape and colour alone
- **Rapid Fire** — rules questions, whole book or one topic at a time
- **Right of Way** — plan-view intersection puzzles
- **Distance Dial** — every number the G1 likes to ask
- **Licence Ladder** — Chapter 1, climb G1 → G2 → G
- **Mock G1 Exam** — the real shape: 20 signs + 20 rules, 16/20 needed in *each* half
- **Fix-It Garage** — Leitner-style review; three correct answers retires an item
- **Pit Stop** / **Sign Shop** — the chapters in short lines, and all 108 signs

## Build

```sh
node tools/measure.js   # only after changing glyph geometry (see below)
node build.js
```

Reads `src/*` and writes:

- `docs/index.html` — the standalone page GitHub Pages serves (committed)
- `dist/g1-night-drive.html` — page content only, for publishing as a Claude artifact
- `dist/preview.html` — full document for opening locally during development

`docs/index.html` is the one to host: it carries its own `<head>` with a
description, theme colour, inline favicon and the iOS meta tags, so it can be
added to an iPad home screen and run like an app. It makes **no external
requests at all** — fonts are embedded — so it works offline.

## Source layout

```
src/glyphs.js   91 sign pictograms, drawn in a 100×100 box
src/gbox.js     GENERATED — each pictogram's measured ink bounds
src/signs.js    sign renderer (shape + colour + symbol) and the 108-sign catalogue
src/bank*.js    the rules question bank (bank5 closes the chapter 2 diagram gaps)
src/extras.js   right-of-way scenarios and the distance facts
src/cards.js    Pit Stop study decks
src/app.js      engine: rounds, scoring, mastery, review boxes, views
src/style.css   the night-drive visual system
src/fonts.css   generated — Barlow, Barlow Condensed, Overpass as data URIs (SIL OFL)
```

The extracted handbook text used while writing the content is kept locally and
git-ignored rather than published — see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## How symbols get aligned

A pictogram drawn by hand rarely fills its 100×100 box evenly, so placing symbols
by that box makes them drift off-centre and vary in optical size. Instead
`tools/measure.js` renders every glyph in headless Chrome, reads its real ink
bounds with `getBoundingClientRect()` (strokes included), and writes them to
`src/gbox.js`. The renderer centres each symbol on those bounds and scales it so
its longest side matches one reference size — so alignment no longer depends on
how tightly a path happened to be drawn.

**Re-run `node tools/measure.js` after editing any glyph**, otherwise the stored
bounds no longer match the artwork.

Symbols also read `var(--cut)`, which the renderer sets to the sign's own
background colour. Vehicle windows use it so they punch through to the sign face
the way real signage does, instead of being a slightly lighter shade of the body.

`tools/sheet.js` renders a contact sheet of all 108 signs with the embedded fonts,
for reviewing the artwork at size:

```sh
node tools/sheet.js /tmp/sheet.html && open /tmp/sheet.html
```

## Scope

The sign catalogue is reconciled against chapter 3 of the handbook, and every
chapter 2 diagram has a question behind it. See
[HANDBOOK-COVERAGE.md](HANDBOOK-COVERAGE.md) for what was removed, what was
added, and why.

## Notes

- Unofficial study aid, not affiliated with the MTO or DriveTest. Always confirm
  current rules at [ontario.ca](https://www.ontario.ca/document/official-mto-drivers-handbook).
- Progress (XP, badges, mastery, the Fix-It list) is stored per-device in
  `localStorage`. There is no account and no server, so every player keeps their own.
- Attribution and licensing for the embedded fonts and the source material:
  [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
