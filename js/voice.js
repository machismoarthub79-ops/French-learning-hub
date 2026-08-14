// Shared French text-to-speech module, used by every tab on the site.
// Exposes a single global `Voice` object so any page can do:
//   <script src="../js/voice.js"></script>
//   Voice.initWarning('voiceWarning');
//   el.innerHTML = Voice.button('speak-btn', 'bonjour');
//   Voice.bindContainer(document.getElementById('cards'));
var Voice = (function () {
  var SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 6a9 9 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>';

  var playbackRate = 1;
  var frVoice = null;

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  function loadVoices() {
    if (!isSupported()) return;
    var voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    frVoice = voices.find(function (v) { return v.lang === 'fr-FR'; }) ||
              voices.find(function (v) { return v.lang && v.lang.indexOf('fr') === 0; }) || null;
  }

  function setRate(rate) {
    playbackRate = rate;
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

  // Shows the "not supported" banner (if present on the page) and, when
  // supported, loads the French voice list. Returns whether speech is supported.
  function initWarning(warningElId) {
    if (!isSupported()) {
      var el = document.getElementById(warningElId);
      if (el) el.style.display = 'block';
      return false;
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return true;
  }

  return {
    SPEAKER_SVG: SPEAKER_SVG,
    isSupported: isSupported,
    loadVoices: loadVoices,
    setRate: setRate,
    getRate: getRate,
    speak: speak,
    escapeHtml: escapeHtml,
    button: button,
    bindContainer: bindContainer,
    initWarning: initWarning
  };
})();
