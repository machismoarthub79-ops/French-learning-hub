// Floating quick-translate bubble, present on every page regardless of
// scroll position. Self-mounting — just include this script (no HTML
// markup needed on the page):
//   <script src="../js/translate.js"></script>
//
// It does two things:
//  1. If the current page happens to have loaded this site's own verb data
//     (VERBS / PRONOMINAL_VERBS globals — currently only /verbes/), it
//     checks the typed word against that dataset first and shows an
//     instant "found on this site" match.
//  2. Always offers a one-tap handoff to Google Translate with the query
//     and language direction pre-filled, opened in a new tab — this site
//     has no translation engine or API of its own, so this is a shortcut
//     into an existing one rather than a fabricated in-site translator.
(function () {
  var STORAGE_KEY = 'translateWidget:direction';
  var direction = 'fr-en'; // 'fr-en' or 'en-fr'

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

  function googleTranslateUrl(query) {
    var sl = direction === 'fr-en' ? 'fr' : 'en';
    var tl = direction === 'fr-en' ? 'en' : 'fr';
    return 'https://translate.google.com/?sl=' + sl + '&tl=' + tl + '&text=' + encodeURIComponent(query) + '&op=translate';
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
        '<button type="button" class="translate-go-btn" id="translateGoBtn">Traduire sur Google Translate ↗</button>' +
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

  function openPanel(root) {
    root.querySelector('#translatePanel').classList.add('open');
    root.querySelector('#translateBubbleBtn').setAttribute('aria-expanded', 'true');
    root.querySelector('#translateInput').focus();
  }

  function closePanel(root) {
    root.querySelector('#translatePanel').classList.remove('open');
    root.querySelector('#translateBubbleBtn').setAttribute('aria-expanded', 'false');
  }

  function goTranslate(root) {
    var query = root.querySelector('#translateInput').value.trim();
    if (!query) return;
    window.open(googleTranslateUrl(query), '_blank', 'noopener');
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
      });
    });

    input.addEventListener('input', function () { updateLocalMatch(root); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') goTranslate(root);
      if (e.key === 'Escape') closePanel(root);
    });

    goBtn.addEventListener('click', function () { goTranslate(root); });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (root.contains(e.target)) return;
      closePanel(root);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
