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
    { id: 'lecture', path: 'lecture/index.html', label: 'Lecture' },
    { id: 'temps-verbaux', path: 'temps-verbaux/index.html', label: 'Temps Verbaux' },
    { id: 'conjugueur', path: 'conjugueur/index.html', label: 'Conjugueur' }
  ];

  // The nav bar is sticky (see css/nav.css), and every page's own <header> is
  // sticky right below it — so the page header needs to know the nav's actual
  // rendered height (it varies by viewport width, and by open/closed state on
  // mobile) rather than a guessed pixel value. Exposed as --nav-height on the
  // root element; css/styles.css reads it for the page header's `top` offset.
  function updateNavHeight(mount) {
    document.documentElement.style.setProperty('--nav-height', mount.offsetHeight + 'px');
  }

  // Theme: dark by default, switchable to light via the nav toggle.
  // A tiny inline script in each page's <head> already applies the stored
  // preference to <html data-theme> before first paint, so this module just
  // has to render the button and flip the attribute (+ localStorage) on click.
  var SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setThemeToggleIcon(btn, theme) {
    // Icon shows the theme a click will switch *to*.
    btn.innerHTML = theme === 'light' ? MOON_ICON : SUN_ICON;
    btn.setAttribute('aria-label', theme === 'light' ? 'Passer au thème sombre' : 'Passer au thème clair');
  }

  function wireThemeToggle(mount) {
    var btn = mount.querySelector('.theme-toggle');
    if (!btn) return;
    setThemeToggleIcon(btn, currentTheme());
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      setThemeToggleIcon(btn, next);
    });
  }

  var SPEEDS = [1, 0.75, 0.5];

  // The audio-speed control affects every speak button on every page (via
  // Voice.setRate, which now persists to localStorage itself), so it lives
  // once in the shared nav instead of being duplicated per tab.
  function speedButtonsHTML() {
    var supported = typeof Voice !== 'undefined';
    var current = supported ? Voice.getRate() : 1;
    return SPEEDS.map(function (rate) {
      var cls = 'nav-speed-btn' + (rate === current ? ' active' : '');
      return '<button type="button" class="' + cls + '" data-speed="' + rate + '">' + rate + 'x</button>';
    }).join('');
  }

  function wireSpeedButtons(mount) {
    if (typeof Voice === 'undefined') return;
    var buttons = mount.querySelectorAll('.nav-speed-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        Voice.setRate(parseFloat(btn.getAttribute('data-speed')));
        buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
      });
    });
  }

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
        '<div class="nav-speed" role="group" aria-label="Vitesse audio">' + speedButtonsHTML() + '</div>' +
        '<button type="button" class="theme-toggle"></button>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        '</button>' +
        '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
      '</div>';

    wireSpeedButtons(mount);
    wireThemeToggle(mount);

    var toggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      updateNavHeight(mount);
    });

    updateNavHeight(mount);
    // Re-measure once webfonts finish swapping in (can shift line height)
    // and whenever the viewport is resized across the mobile/desktop nav breakpoint.
    window.addEventListener('load', function () { updateNavHeight(mount); });
    window.addEventListener('resize', function () { updateNavHeight(mount); });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
