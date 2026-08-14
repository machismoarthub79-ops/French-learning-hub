  // The six passages named in the curriculum's Bonus "Reading Practice"
  // section. Their actual French text lives only in the user's physical
  // class notes, not in this repo — `text` is deliberately left empty
  // rather than inventing prose and attributing it to those notes. The
  // rendering below is written to handle real text once it's transcribed
  // (splits into speakable sentences, enables the whole-passage speak
  // button) without any further changes needed here.
  var PASSAGES = [
    { id: 'le-soir', title: 'Le soir', text: '' },
    { id: 'le-sommeil', title: 'Le sommeil', text: '' },
    { id: 'assistant', title: 'Assistant', text: '' },
    { id: 'le-diner-en-famille', title: 'Le dîner en famille', text: '' },
    { id: 'une-journee-de-sport', title: 'Une journée de sport', text: '' },
    { id: 'la-cuisine', title: 'La cuisine', text: '' }
  ];

  var STORAGE_PREFIX = 'lecture:';

  function loadState(id) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveState(id, state) {
    try { localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(state)); } catch (e) {}
  }

  function emptyState() {
    return { vocab: [{}, {}, {}, {}, {}], sentence: '' };
  }

  // Splits on sentence-ending punctuation while keeping the punctuation
  // attached to each sentence, without relying on regex lookbehind.
  function splitSentences(text) {
    var parts = text.split(/([.!?])(?:\s+|$)/);
    var sentences = [];
    for (var i = 0; i < parts.length; i += 2) {
      var chunk = (parts[i] || '').trim();
      var punct = parts[i + 1] || '';
      if (chunk) sentences.push(chunk + punct);
    }
    return sentences;
  }

  function wholeSpeakButton(passage) {
    var hasText = !!(passage.text && passage.text.trim());
    if (!hasText) {
      return '<button class="speak-btn" disabled title="Texte à venir" aria-label="Écouter">' + Voice.SPEAKER_SVG + '</button>';
    }
    return Voice.button('speak-btn', passage.text);
  }

  function passageBodyHTML(passage) {
    if (!passage.text || !passage.text.trim()) {
      return '<div class="passage-pending">Contenu à venir — à recopier depuis tes notes de cours.</div>';
    }
    var rows = splitSentences(passage.text).map(function (s) {
      return '<div class="ex-row"><div class="txt"><div class="fr">' + Voice.escapeHtml(s) + '</div></div>' + Voice.button('ex-speak', s) + '</div>';
    }).join('');
    return '<div class="passage-text">' + rows + '</div>';
  }

  function vocabRowsHTML(passageId, vocab) {
    var rows = '';
    for (var i = 0; i < 5; i++) {
      var pair = vocab[i] || {};
      rows += '<div class="vocab-row">' +
        '<input type="text" data-passage="' + passageId + '" data-field="word" data-idx="' + i + '" placeholder="mot ' + (i + 1) + '" value="' + Voice.escapeHtml(pair.word || '') + '">' +
        '<input type="text" data-passage="' + passageId + '" data-field="def" data-idx="' + i + '" placeholder="définition" value="' + Voice.escapeHtml(pair.def || '') + '">' +
      '</div>';
    }
    return rows;
  }

  function passageCardHTML(passage) {
    var saved = loadState(passage.id) || emptyState();
    var vocab = saved.vocab || [];
    while (vocab.length < 5) vocab.push({});

    return '<div class="card">' +
      '<div class="passage-title"><h2>' + Voice.escapeHtml(passage.title) + '</h2>' + wholeSpeakButton(passage) + '</div>' +
      passageBodyHTML(passage) +
      '<div class="section-label">5 mots inconnus</div>' +
      vocabRowsHTML(passage.id, vocab) +
      '<div class="section-label">Ta phrase (même schéma grammatical)</div>' +
      '<textarea class="sentence-textarea" data-passage="' + passage.id + '" data-field="sentence" placeholder="Écris une phrase qui copie la structure du texte...">' + Voice.escapeHtml(saved.sentence || '') + '</textarea>' +
      '<div class="save-note" data-save-note="' + passage.id + '">Enregistré</div>' +
    '</div>';
  }

  function render() {
    document.getElementById('passages').innerHTML = PASSAGES.map(passageCardHTML).join('');
  }

  var saveTimers = {};

  function flashSaveNote(passageId) {
    var note = document.querySelector('[data-save-note="' + passageId + '"]');
    if (!note) return;
    note.classList.add('visible');
    clearTimeout(saveTimers[passageId]);
    saveTimers[passageId] = setTimeout(function () { note.classList.remove('visible'); }, 1200);
  }

  function handleInput(e) {
    var el = e.target;
    var passageId = el.getAttribute('data-passage');
    if (!passageId) return;
    var field = el.getAttribute('data-field');

    var state = loadState(passageId) || emptyState();
    if (!state.vocab) state.vocab = [{}, {}, {}, {}, {}];
    while (state.vocab.length < 5) state.vocab.push({});

    if (field === 'sentence') {
      state.sentence = el.value;
    } else if (field === 'word' || field === 'def') {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      state.vocab[idx] = state.vocab[idx] || {};
      state.vocab[idx][field] = el.value;
    }

    saveState(passageId, state);
    flashSaveNote(passageId);
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    var container = document.getElementById('passages');
    Voice.bindContainer(container);
    container.addEventListener('input', handleInput);
  }

  document.addEventListener('DOMContentLoaded', init);
