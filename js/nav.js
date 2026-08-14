// Shared top navigation bar, rendered into <div id="site-nav"></div> on every page.
// Each page sets two globals before loading this script:
//   window.NAV_BASE   = ''      on root index.html, '../' on every subpage
//   window.NAV_ACTIVE = 'verbes' (etc.) — the current tab's id, for highlighting
(function () {
  var NAV_ITEMS = [
    { id: 'home', path: 'index.html', label: 'Accueil' },
    { id: 'verbes', path: 'verbes/index.html', label: 'Verbes' },
    { id: 'prononciation', path: 'prononciation/index.html', label: 'Prononciation' },
    { id: 'noms-articles', path: 'noms-articles/index.html', label: 'Noms & Articles' },
    { id: 'adjectifs', path: 'adjectifs/index.html', label: 'Adjectifs' },
    { id: 'nombres-temps', path: 'nombres-temps/index.html', label: 'Nombres & Temps' },
    { id: 'etre-avoir', path: 'etre-avoir/index.html', label: 'Être & Avoir' },
    { id: 'questions', path: 'questions/index.html', label: 'Questions' },
    { id: 'lecture', path: 'lecture/index.html', label: 'Lecture' }
  ];

  function render() {
    var mount = document.getElementById('site-nav');
    if (!mount) return;

    var base = typeof window.NAV_BASE === 'string' ? window.NAV_BASE : '';
    var active = window.NAV_ACTIVE || 'home';

    var links = NAV_ITEMS.map(function (item) {
      var cls = 'nav-link' + (item.id === active ? ' active' : '');
      return '<a class="' + cls + '" href="' + base + item.path + '">' + item.label + '</a>';
    }).join('');

    mount.innerHTML =
      '<div class="nav-wrap">' +
        '<a class="nav-brand" href="' + base + 'index.html">French Learning Hub</a>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        '</button>' +
        '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
      '</div>';

    var toggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
