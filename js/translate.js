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
        '<input type="text" class="translate-input" id="translateInput" placeholder="mot ou phrase...">' +
        '<div class="translate-local-match" id="translateLocalMatch"></div>' +
        '<button type="button" class="translate-go-btn" id="translateGoBtn">Traduire</button>' +
        '<textarea class="translate-result" id="translateResult" readonly placeholder="La traduction apparaîtra ici..." rows="2" style="display:none;"></textarea>' +
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
      out.innerHTML = '<span class="found-tag">trouvé sur ce site</span> ' + escapeHtml(match.fr) + ' — ' + escapeHtml(match.en);
      out.style.display = 'block';
    } else {
      out.style.display = 'none';
      out.innerHTML = '';
    }
  }

  function resetResult(root) {
    var result = root.querySelector('#translateResult');
    var note = root.querySelector('#translateSourceNote');
    var errorBox = root.querySelector('#translateError');
    result.style.display = 'none';
    result.value = '';
    note.style.display = 'none';
    errorBox.style.display = 'none';
    errorBox.innerHTML = '';
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
      result.style.display = 'block';
      note.style.display = 'block';
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
        resetResult(root);
      });
    });

    input.addEventListener('input', function () {
      updateLocalMatch(root);
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
