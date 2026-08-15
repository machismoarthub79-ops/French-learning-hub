// Floating quick-translate bubble, present on every page regardless of
// scroll position. Self-mounting — just include this script (no HTML
// markup needed on the page):
//   <script src="../js/translate.js"></script>
//
// It does two things:
//  1. If the current page happens to have loaded this site's own verb data
//     (VERBS / PRONOMINAL_VERBS globals — currently only /verbes/), it
//     checks the typed word against that dataset first and shows an
//     instant "found on this site" match, with no network call.
//  2. Otherwise (or in addition) it fetches a translation from MyMemory
//     (api.mymemory.translated.net) — a free, keyless, CORS-enabled
//     translation API — and shows the result inline in a read-only box,
//     rather than sending the user off to a separate site/tab. This site
//     has no translation engine of its own, so this is a thin client for
//     an existing free one; if the fetch fails (offline, rate-limited,
//     API down) a fallback link to Google Translate is shown instead of
//     just failing silently.
(function () {
  var STORAGE_KEY = 'translateWidget:direction';
  var direction = 'fr-en'; // 'fr-en' or 'en-fr'
  var requestSeq = 0; // guards against a slow stale response clobbering a newer one

  try {
    var savedDir = localStorage.getItem(STORAGE_KEY);
    if (savedDir === 'fr-en' || savedDir === 'en-fr') direction = savedDir;
  } catch (e) {}

  function siteVerbs() {
    var list = [];
    if (typeof VERBS !== 'undefined') list = list.concat(VERBS);
    if (typeof PRONOMINAL_VERBS !== 'undefined') list = list.concat(PRONOMINAL_VERBS);
    return list;
  }

  function localLookup(query) {
    query = query.trim().toLowerCase();
    if (!query) return null;
    var verbs = siteVerbs();
    if (!verbs.length) return null;

    if (direction === 'fr-en') {
      var frMatch = verbs.find(function (v) { return v.i.toLowerCase() === query; });
      return frMatch ? { fr: frMatch.i, en: frMatch.e } : null;
    }
    var enMatch = verbs.find(function (v) { return v.e.toLowerCase().replace(/^to /, '') === query.replace(/^to /, ''); });
    return enMatch ? { fr: enMatch.i, en: enMatch.e } : null;
  }

  function langPair() {
    return direction === 'fr-en' ? { sl: 'fr', tl: 'en' } : { sl: 'en', tl: 'fr' };
  }

  function myMemoryUrl(query) {
    var lp = langPair();
    return 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(query) + '&langpair=' + lp.sl + '|' + lp.tl;
  }

  function googleTranslateUrl(query) {
    var lp = langPair();
    return 'https://translate.google.com/?sl=' + lp.sl + '&tl=' + lp.tl + '&text=' + encodeURIComponent(query) + '&op=translate';
  }

  // Rejects if MyMemory has nothing usable — including its own in-band
  // "you've used today's free quota" text, which otherwise looks like a
  // normal (wrong) translation if not filtered out.
  function fetchTranslation(query) {
    return fetch(myMemoryUrl(query)).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      var text = data && data.responseData && data.responseData.translatedText;
      if (!text || /MYMEMORY WARNING/i.test(text)) throw new Error('no usable translation');
      return text;
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var BUBBLE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"/></svg>';

  // A speak button is only ever offered next to text that's actually French
  // — Voice.speak() always synthesizes with lang="fr-FR", so playing it back
  // on English text would mispronounce it (the same class of bug fixed for
  // the alphabet grid). Which box holds French text depends on direction:
  // the input in fr-en mode, the result in en-fr mode. The local-match box
  // is always French (it's always the verb's infinitive), regardless of direction.
  function build() {
    var root = document.createElement('div');
    root.id = 'translate-widget';
    root.innerHTML =
      '<button class="translate-bubble" id="translateBubbleBtn" aria-label="Traduction rapide" aria-expanded="false">' + BUBBLE_SVG + '</button>' +
      '<div class="translate-panel" id="translatePanel" role="dialog" aria-label="Traduction rapide">' +
        '<div class="translate-panel-head">' +
          '<div class="translate-direction" role="group" aria-label="Sens">' +
            '<button type="button" class="translate-dir-btn" data-dir="fr-en">FR → EN</button>' +
            '<button type="button" class="translate-dir-btn" data-dir="en-fr">EN → FR</button>' +
          '</div>' +
          '<button type="button" class="translate-close" id="translateCloseBtn" aria-label="Fermer">×</button>' +
        '</div>' +
        '<div class="translate-input-row">' +
          '<input type="text" class="translate-input" id="translateInput" placeholder="mot ou phrase...">' +
          Voice.button('speak-btn small', '').replace('<button ', '<button id="translateInputSpeak" style="display:none;" ') +
        '</div>' +
        '<div class="translate-local-match" id="translateLocalMatch"></div>' +
        '<button type="button" class="translate-go-btn" id="translateGoBtn">Traduire</button>' +
        '<div class="translate-result-row" id="translateResultRow" style="display:none;">' +
          '<textarea class="translate-result" id="translateResult" readonly placeholder="La traduction apparaîtra ici..." rows="2"></textarea>' +
          Voice.button('speak-btn small', '').replace('<button ', '<button id="translateResultSpeak" style="display:none;" ') +
        '</div>' +
        '<div class="translate-source-note" id="translateSourceNote" style="display:none;">Traduction automatique (MyMemory) — à vérifier.</div>' +
        '<div class="translate-error" id="translateError" style="display:none;"></div>' +
      '</div>';
    document.body.appendChild(root);
    return root;
  }

  function updateDirectionButtons(root) {
    root.querySelectorAll('.translate-dir-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-dir') === direction);
    });
  }

  function updateLocalMatch(root) {
    var input = root.querySelector('#translateInput');
    var out = root.querySelector('#translateLocalMatch');
    var match = localLookup(input.value);
    if (match) {
      out.innerHTML = '<span class="found-tag">trouvé sur ce site</span> ' + escapeHtml(match.fr) + ' — ' + escapeHtml(match.en) + ' ' + Voice.button('speak-btn small', match.fr);
      out.style.display = 'block';
    } else {
      out.style.display = 'none';
      out.innerHTML = '';
    }
  }

  // The input speak button only ever appears in fr-en mode (the input holds
  // French text then); it's rebuilt on every keystroke so its data-text
  // always matches what's currently typed.
  function updateInputSpeakButton(root) {
    var input = root.querySelector('#translateInput');
    var btn = root.querySelector('#translateInputSpeak');
    var text = input.value.trim();
    if (direction === 'fr-en' && text) {
      btn.setAttribute('data-text', text);
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }

  // The result speak button only ever appears in en-fr mode (the result
  // holds French text then), and only once a result actually exists.
  function updateResultSpeakButton(root) {
    var btn = root.querySelector('#translateResultSpeak');
    var result = root.querySelector('#translateResult');
    var text = result.value.trim();
    if (direction === 'en-fr' && text) {
      btn.setAttribute('data-text', text);
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }

  function resetResult(root) {
    var resultRow = root.querySelector('#translateResultRow');
    var result = root.querySelector('#translateResult');
    var note = root.querySelector('#translateSourceNote');
    var errorBox = root.querySelector('#translateError');
    resultRow.style.display = 'none';
    result.value = '';
    note.style.display = 'none';
    errorBox.style.display = 'none';
    errorBox.innerHTML = '';
    updateResultSpeakButton(root);
  }

  function openPanel(root) {
    root.querySelector('#translatePanel').classList.add('open');
    root.querySelector('#translateBubbleBtn').setAttribute('aria-expanded', 'true');
    root.querySelector('#translateInput').focus();
  }

  function closePanel(root) {
    root.querySelector('#translatePanel').classList.remove('open');
    root.querySelector('#translateBubbleBtn').setAttribute('aria-expanded', 'false');
  }

  function runTranslate(root) {
    var input = root.querySelector('#translateInput');
    var query = input.value.trim();
    if (!query) return;

    var goBtn = root.querySelector('#translateGoBtn');
    var resultRow = root.querySelector('#translateResultRow');
    var result = root.querySelector('#translateResult');
    var note = root.querySelector('#translateSourceNote');
    var errorBox = root.querySelector('#translateError');

    resetResult(root);
    goBtn.disabled = true;
    goBtn.textContent = 'Traduction…';

    var myRequest = ++requestSeq;

    fetchTranslation(query).then(function (text) {
      if (myRequest !== requestSeq) return; // a newer request already superseded this one
      result.value = text;
      resultRow.style.display = 'flex';
      note.style.display = 'block';
      updateResultSpeakButton(root);
    }).catch(function () {
      if (myRequest !== requestSeq) return;
      errorBox.style.display = 'block';
      errorBox.innerHTML = 'Impossible de récupérer la traduction (hors ligne, ou service indisponible). ' +
        '<a href="' + googleTranslateUrl(query) + '" target="_blank" rel="noopener">Ouvrir dans Google Translate ↗</a>';
    }).finally(function () {
      if (myRequest !== requestSeq) return;
      goBtn.disabled = false;
      goBtn.textContent = 'Traduire';
    });
  }

  function init() {
    var root = build();
    updateDirectionButtons(root);
    updateInputSpeakButton(root);
    Voice.bindContainer(root); // wires every current & future .speak-btn inside the widget

    var bubbleBtn = root.querySelector('#translateBubbleBtn');
    var panel = root.querySelector('#translatePanel');
    var closeBtn = root.querySelector('#translateCloseBtn');
    var input = root.querySelector('#translateInput');
    var goBtn = root.querySelector('#translateGoBtn');

    bubbleBtn.addEventListener('click', function () {
      panel.classList.contains('open') ? closePanel(root) : openPanel(root);
    });
    closeBtn.addEventListener('click', function () { closePanel(root); });

    root.querySelectorAll('.translate-dir-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        direction = btn.getAttribute('data-dir');
        try { localStorage.setItem(STORAGE_KEY, direction); } catch (e) {}
        updateDirectionButtons(root);
        updateLocalMatch(root);
        updateInputSpeakButton(root);
        resetResult(root);
      });
    });

    input.addEventListener('input', function () {
      updateLocalMatch(root);
      updateInputSpeakButton(root);
      resetResult(root);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runTranslate(root);
      if (e.key === 'Escape') closePanel(root);
    });

    goBtn.addEventListener('click', function () { runTranslate(root); });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (root.contains(e.target)) return;
      closePanel(root);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
