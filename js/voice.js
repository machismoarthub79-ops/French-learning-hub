// Shared French text-to-speech module, used by every tab on the site.
// Exposes a single global `Voice` object so any page can do:
//   <script src="../js/voice.js"></script>
//   Voice.initWarning('voiceWarning');
//   el.innerHTML = Voice.button('speak-btn', 'bonjour');
//   Voice.bindContainer(document.getElementById('cards'));
var Voice = (function () {
  var SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 6a9 9 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>';

  var RATE_STORAGE_KEY = 'voice:rate';
  var VALID_RATES = [1, 0.75, 0.5];

  var playbackRate = 1;
  try {
    var savedRate = parseFloat(localStorage.getItem(RATE_STORAGE_KEY));
    if (VALID_RATES.indexOf(savedRate) !== -1) playbackRate = savedRate;
  } catch (e) {}

  var frVoice = null;
  var voicesChecked = false; // true once we've looked at a non-empty voice list at least once

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  // Some voice packs report lang as "fr-FR"/"fr-CA"/etc, others report an odd
  // or missing lang but a recognizable name ("Google français", "Amelie").
  // Try the reliable lang match first, fall back to a name-based guess.
  function findFrenchVoice(voices) {
    return voices.find(function (v) { return v.lang && v.lang.toLowerCase() === 'fr-fr'; }) ||
           voices.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf('fr') === 0; }) ||
           voices.find(function (v) { return v.name && /fran[çc]ais|french/i.test(v.name); }) ||
           null;
  }

  function loadVoices() {
    if (!isSupported()) return;
    var voices = window.speechSynthesis.getVoices();
    if (!voices.length) return; // list not populated yet, wait for onvoiceschanged
    voicesChecked = true;
    frVoice = findFrenchVoice(voices);
  }

  // True once we've actually found a French voice to use. False either while
  // the voice list is still loading, or once loaded with no French voice found.
  function hasFrenchVoice() {
    return !!frVoice;
  }

  // True once the browser's voice list has been inspected at least once,
  // whether or not a French voice was in it — used to tell "still loading"
  // apart from "loaded, but nothing French available".
  function voicesReady() {
    return voicesChecked;
  }

  function setRate(rate) {
    playbackRate = rate;
    try { localStorage.setItem(RATE_STORAGE_KEY, rate); } catch (e) {}
  }

  function getRate() {
    return playbackRate;
  }

  function speak(text, btn) {
    if (!isSupported()) return;
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    if (frVoice) utter.voice = frVoice;
    utter.rate = 0.92 * playbackRate;
    if (btn) {
      utter.onstart = function () { btn.classList.add('playing'); };
      utter.onend = function () { btn.classList.remove('playing'); };
      utter.onerror = function () { btn.classList.remove('playing'); };
    }
    window.speechSynthesis.speak(utter);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Renders a round speak button with the given class and data-text payload.
  function button(cls, text) {
    return '<button class="' + cls + '" data-text="' + escapeHtml(text) + '" aria-label="Écouter">' + SPEAKER_SVG + '</button>';
  }

  // Delegated click handler: wire once on a container and every current/future
  // speak button inside it (matching `selector`) will play its data-text.
  function bindContainer(containerEl, selector) {
    selector = selector || '.speak-btn, .conj-speak, .ex-speak';
    containerEl.addEventListener('click', function (e) {
      var btn = e.target.closest(selector);
      if (btn) speak(btn.getAttribute('data-text'), btn);
    });
  }

  function showWarning(warningElId, message) {
    var el = document.getElementById(warningElId);
    if (!el) return;
    if (message) el.textContent = message;
    el.style.display = 'block';
  }

  function hideWarning(warningElId) {
    var el = document.getElementById(warningElId);
    if (el) el.style.display = 'none';
  }

  // Re-checks the voice list once it's had a chance to load, and shows a
  // banner explaining that playback will sound wrong if no French voice was
  // found — this is what produces the "half English, half French" pronunciation
  // some browsers/OSes fall back to when speaking fr-FR text with an English voice.
  function checkFrenchVoiceAndWarn(warningElId) {
    if (!voicesReady()) return;
    if (hasFrenchVoice()) {
      hideWarning(warningElId);
    } else {
      showWarning(warningElId, "Aucune voix française trouvée sur cet appareil — la prononciation sera approximative (accent anglais). Essaie d'installer une voix/langue française dans les paramètres de synthèse vocale de ton système ou navigateur.");
    }
  }

  // Shows the "not supported at all" banner (if present on the page) and,
  // when supported, loads the French voice list and watches for a French
  // voice actually being available, warning if not. Returns whether speech
  // synthesis itself is supported (not whether a French voice was found —
  // use hasFrenchVoice()/voicesReady() for that once the check has run).
  function initWarning(warningElId) {
    if (!isSupported()) {
      showWarning(warningElId, "La lecture vocale n'est pas prise en charge par ce navigateur.");
      return false;
    }
    loadVoices();
    checkFrenchVoiceAndWarn(warningElId);
    window.speechSynthesis.onvoiceschanged = function () {
      loadVoices();
      checkFrenchVoiceAndWarn(warningElId);
    };
    // Chrome in particular can populate the voice list without firing
    // onvoiceschanged on some platforms — re-check shortly after as a fallback.
    setTimeout(function () {
      loadVoices();
      checkFrenchVoiceAndWarn(warningElId);
    }, 400);
    return true;
  }

  return {
    SPEAKER_SVG: SPEAKER_SVG,
    isSupported: isSupported,
    loadVoices: loadVoices,
    hasFrenchVoice: hasFrenchVoice,
    voicesReady: voicesReady,
    setRate: setRate,
    getRate: getRate,
    speak: speak,
    escapeHtml: escapeHtml,
    button: button,
    bindContainer: bindContainer,
    initWarning: initWarning
  };
})();
