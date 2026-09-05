  var PRON_LABELS = ['Je', 'Tu', 'Il', 'Elle', 'On', 'Nous', 'Vous', 'Ils', 'Elles'];
  var PRON_IDX = [0, 1, 2, 2, 2, 3, 4, 5, 5]; // index into the 6-form [je,tu,il,nous,vous,ils] array

  var AVOIR_FORMS = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
  var ETRE_FORMS = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

  var GROUP_LABELS = { ER: '-er', IR: '-ir', RE: '-re', ETRE: 'être', REFL: 'réfléchi', IRR: 'irr.' };

  function vowelSoundStart(form) {
    return /^[aeiouyàâéèêëîïôùûü]/i.test(form);
  }

  // Gender/number agreement on the past participle for être-auxiliary verbs.
  // Ambiguous slots (je/tu/on/nous/vous) show the "(e)"/"(e)s" notation used
  // in the course notes; il/elle/ils/elles get their unambiguous form.
  function participleFor(i, participle, aux) {
    if (aux === 'avoir') return participle;
    switch (i) {
      case 0: case 1: case 4: return participle + '(e)';   // je, tu, on
      case 2: return participle;                            // il
      case 3: return participle + 'e';                       // elle
      case 5: case 6: return participle + '(e)s';            // nous, vous
      case 7: return participle + 's';                       // ils
      case 8: return participle + 'es';                      // elles
    }
  }

  function auxFormFor(i, aux) {
    return (aux === 'avoir' ? AVOIR_FORMS : ETRE_FORMS)[PRON_IDX[i]];
  }

  // me/te/se, eliding to m'/t'/s' before a vowel-sound auxiliary; nous/vous
  // never elide.
  function reflexivePronounFor(i, auxForm) {
    if (i === 0) return vowelSoundStart(auxForm) ? "m'" : 'me ';
    if (i === 1) return vowelSoundStart(auxForm) ? "t'" : 'te ';
    if (i === 5) return 'nous ';
    if (i === 6) return 'vous ';
    return vowelSoundStart(auxForm) ? "s'" : 'se '; // il, elle, on, ils, elles
  }

  // Builds the full "Sujet + (pronom réfléchi) + auxiliaire + participe"
  // phrase for pronoun row i, e.g. "j'ai aimé", "elle est allée",
  // "tu t'es brossé(e)".
  function buildPhrase(v, i, atStart) {
    var label = PRON_LABELS[i];
    var auxForm = auxFormFor(i, v.aux);
    var participleForm = participleFor(i, v.p, v.aux);

    if (v.reflexive) {
      var subject = (label === 'Je') ? (atStart ? 'Je' : 'je') : (atStart ? label : label.toLowerCase());
      return subject + ' ' + reflexivePronounFor(i, auxForm) + auxForm + ' ' + participleForm;
    }

    if (label === 'Je') {
      var jePrefix = vowelSoundStart(auxForm) ? (atStart ? "J'" : "j'") : (atStart ? 'Je ' : 'je ');
      return jePrefix + auxForm + ' ' + participleForm;
    }
    return (atStart ? label : label.toLowerCase()) + ' ' + auxForm + ' ' + participleForm;
  }

  function normalize(s) {
    return s
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[().]/g, '') // drop the (e)/(e)s agreement markers so "alle" matches "allé(e)"
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ---- Search index for the "Identifier un mot" tool ----
  var byPhrase = {};     // normalized full phrase -> {v, i}
  var byInfinitive = {}; // normalized infinitive -> v
  var byParticiple = {}; // normalized bare participle -> [v, ...]
  var suggestionPool = []; // {norm, display} for substring suggestions

  function buildIndex() {
    PASSE_COMPOSE_VERBS.forEach(function (v) {
      byInfinitive[normalize(v.i)] = v;
      suggestionPool.push({ norm: normalize(v.i), display: v.i });

      var participleKey = normalize(v.p);
      (byParticiple[participleKey] = byParticiple[participleKey] || []).push(v);

      if (v.impersonal) {
        var phrase = buildPhrase(v, 2, true); // "Il a plu"
        byPhrase[normalize(phrase)] = { v: v, i: 2 };
        suggestionPool.push({ norm: normalize(phrase), display: phrase });
        return;
      }
      for (var i = 0; i < 9; i++) {
        var ph = buildPhrase(v, i, true);
        byPhrase[normalize(ph)] = { v: v, i: i };
        suggestionPool.push({ norm: normalize(ph), display: ph });
      }
    });
  }

  function conjRowHTML(v, i) {
    var phrase = buildPhrase(v, i, true) + '.';
    return '<div class="conj-group"><div class="conj-row">' +
      '<div class="pron">' + PRON_LABELS[i] + '</div>' +
      '<div class="conj-fr">' + Voice.escapeHtml(phrase) + '</div>' +
      Voice.button('conj-speak', phrase) +
      '</div></div>';
  }

  function conjBlockHTML(v) {
    if (v.impersonal) {
      var phrase = buildPhrase(v, 2, true) + '.';
      return '<div class="conj-block"><div class="conj-group"><div class="conj-row">' +
        '<div class="pron">Il</div><div class="conj-fr">' + Voice.escapeHtml(phrase) + '</div>' +
        Voice.button('conj-speak', phrase) +
        '</div></div><div class="impersonal-note">Verbe impersonnel — seule cette forme existe.</div></div>';
    }
    var rows = '';
    for (var i = 0; i < 9; i++) rows += conjRowHTML(v, i);
    return '<div class="conj-block">' + rows + '</div>';
  }

  function verbCardHTML(v) {
    var label = GROUP_LABELS[v.g];
    return '' +
      '<div class="card" id="verb-' + Voice.escapeHtml(normalize(v.i).replace(/ /g, '-')) + '">' +
        '<div class="stamp ' + v.g + '">' + label + '</div>' +
        '<div class="word-line">' +
          '<div class="infinitive">' + Voice.escapeHtml(cap(v.i)) + '</div>' +
          Voice.button('speak-btn', v.i) +
        '</div>' +
        '<div class="meaning">' + Voice.escapeHtml(v.e) + ' · auxiliaire ' + v.aux + '</div>' +
        '<div class="divider"></div>' +
        conjBlockHTML(v) +
      '</div>';
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var currentGroup = 'ALL';

  function pool() {
    return currentGroup === 'ALL' ? PASSE_COMPOSE_VERBS : PASSE_COMPOSE_VERBS.filter(function (v) { return v.g === currentGroup; });
  }

  function renderVerbList() {
    document.getElementById('verb-list').innerHTML = pool().map(verbCardHTML).join('');
    document.querySelectorAll('[data-group]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-group') === currentGroup);
    });
  }

  function reflexiveChipHTML(v) {
    return '<span class="word-chip"><span>' + Voice.escapeHtml(cap(v.i)) +
      ' <span class="note">(' + Voice.escapeHtml(v.e) + ')</span></span>' +
      Voice.button('speak-btn small', v.i) + '</span>';
  }

  function renderReflexiveList() {
    var refl = PASSE_COMPOSE_VERBS.filter(function (v) { return v.g === 'REFL'; });
    document.getElementById('reflexive-list').innerHTML = refl.map(reflexiveChipHTML).join('');
  }

  // ---- Identifier un mot ----
  function identifyResultHTML(v, i) {
    var isImpersonal = !!v.impersonal;
    var phrase = buildPhrase(v, isImpersonal ? 2 : i, true) + '.';
    var pronounLabel = isImpersonal ? 'Il (impersonnel)' : PRON_LABELS[i];
    return '' +
      '<div class="identify-card">' +
        '<div class="identify-head">' +
          '<div class="identify-phrase">' + Voice.escapeHtml(phrase) + '</div>' +
          Voice.button('speak-btn', phrase) +
        '</div>' +
        '<div class="identify-meta">' +
          '<span class="identify-tag">' + Voice.escapeHtml(pronounLabel) + '</span>' +
          '<span class="identify-tag">passé composé</span>' +
          '<span class="identify-tag">aux. ' + v.aux + '</span>' +
          '<span class="identify-tag">' + Voice.escapeHtml(GROUP_LABELS[v.g]) + '</span>' +
        '</div>' +
        '<div class="identify-meaning"><strong>' + Voice.escapeHtml(cap(v.i)) + '</strong> — ' + Voice.escapeHtml(v.e) + '</div>' +
        '<div class="identify-note">Participe passé : ' + Voice.escapeHtml(v.p) + (v.reflexive ? ' · verbe réfléchi' : '') + '</div>' +
        conjBlockHTML(v) +
      '</div>';
  }

  function suggestionsHTML(query) {
    var seen = {};
    var matches = suggestionPool.filter(function (s) {
      if (s.norm.indexOf(query) === -1) return false;
      if (seen[s.display]) return false;
      seen[s.display] = true;
      return true;
    }).slice(0, 8);
    if (!matches.length) {
      return '<div class="identify-empty">Aucune correspondance. Vérifie l\'orthographe, ou essaie juste l\'infinitif (ex. « manger »).</div>';
    }
    return '<div class="identify-empty">Aucune correspondance exacte. Essaie :</div>' +
      '<div class="identify-suggestions">' +
        matches.map(function (s) {
          return '<button type="button" class="identify-chip" data-suggest="' + Voice.escapeHtml(s.display) + '">' + Voice.escapeHtml(s.display) + '</button>';
        }).join('') +
      '</div>';
  }

  function runIdentify(raw) {
    var out = document.getElementById('identify-result');
    var query = normalize(raw);
    if (!query) {
      out.innerHTML = '<div class="identify-empty">Tape un mot ou une phrase au passé composé pour commencer.</div>';
      return;
    }

    if (byPhrase[query]) {
      var hit = byPhrase[query];
      out.innerHTML = identifyResultHTML(hit.v, hit.i);
      return;
    }
    if (byInfinitive[query]) {
      var v = byInfinitive[query];
      out.innerHTML = identifyResultHTML(v, 0);
      return;
    }
    if (byParticiple[query]) {
      out.innerHTML = byParticiple[query].map(function (v) { return identifyResultHTML(v, 0); }).join('');
      return;
    }

    out.innerHTML = suggestionsHTML(query);
  }

  function init() {
    buildIndex();
    Voice.initWarning('voiceWarning');
    Interactive.initSelfChecks(document);

    renderVerbList();
    renderReflexiveList();
    document.querySelectorAll('[data-group]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentGroup = btn.getAttribute('data-group');
        renderVerbList();
      });
    });

    var input = document.getElementById('identify-input');
    var form = document.getElementById('identify-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      runIdentify(input.value);
    });
    document.getElementById('identify-result').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-suggest]');
      if (!chip) return;
      input.value = chip.getAttribute('data-suggest');
      runIdentify(input.value);
    });
    runIdentify('');

    // Single delegated listener covers every current and future speak
    // button in the page (identifier results, filtered verb cards).
    Voice.bindContainer(document.querySelector('main'));
  }

  document.addEventListener('DOMContentLoaded', init);
