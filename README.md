# French Learning Hub

A small static site for working through a 16-module French curriculum (alphabet through interrogation). No build step, no framework — plain HTML/CSS/JS.

## Structure

```
/index.html              landing page — links to every tab below
/css/styles.css          shared design tokens (colors, fonts) and base styles used by every page
/css/nav.css             the shared top navigation bar
/js/nav.js               renders the nav bar on every page
/js/voice.js             shared French text-to-speech module, used by every tab (see below)

/verbes/                 Modules 11–15 — verb conjugation drills (676 verbs, ER/IR/RE)
/prononciation/          Modules 1–2  — alphabet & pronunciation
/noms-articles/          Modules 3, 4, 7 — gender, articles, plural
/adjectifs/               Modules 5, 6, 8 — demonstrative/possessive/descriptive adjectives
/nombres-temps/          Module 9    — days, months, seasons, numbers
/etre-avoir/              Module 10   — être & avoir + negation
/questions/               Module 16   — interrogation
/lecture/                 Bonus       — reading practice
/temps-verbaux/           Bonus       — verb tenses, starting with the passé composé
```

Each tab is a self-contained `index.html` + page-specific JS/CSS (where needed), sharing the site-wide nav, design tokens, and voice module above. Tabs not yet built are simple "content pending" stub pages linking to their tracking issue, so the nav never 404s.

## The shared voice module

`js/voice.js` exposes a single global `Voice` object so any page can add French audio playback without reimplementing `speechSynthesis` handling:

```html
<script src="../js/voice.js"></script>
<script>
  Voice.initWarning('voiceWarning');            // shows a fallback banner if unsupported, loads the fr-FR voice
  document.getElementById('word').innerHTML =
    Voice.button('speak-btn', 'bonjour');        // renders a round speaker button
  Voice.bindContainer(document.body);            // wires clicks on any .speak-btn/.conj-speak/.ex-speak inside
  Voice.setRate(0.75);                           // playback speed, shared across the whole page
</script>
```

## Running locally

No build step required — serve the repo root with any static file server, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`.
