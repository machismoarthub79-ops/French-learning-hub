  var SUBJECT_WORDS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

  var TENSE_BLOCKS = [
    { mood: 'Indicatif', label: 'Présent', key: 'indicatifPresent', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Imparfait', key: 'indicatifImparfait', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Futur', key: 'indicatifFutur', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Passé simple', key: 'indicatifPasseSimple', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Passé composé', key: 'indicatifPasseCompose', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Plus-que-parfait', key: 'indicatifPlusQueParfait', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Passé antérieur', key: 'indicatifPasseAnterieur', kind: 'pronoun' },
    { mood: 'Indicatif', label: 'Futur antérieur', key: 'indicatifFuturAnterieur', kind: 'pronoun' },
    { mood: 'Subjonctif', label: 'Présent', key: 'subjonctifPresent', kind: 'subjonctif' },
    { mood: 'Subjonctif', label: 'Imparfait', key: 'subjonctifImparfait', kind: 'subjonctif' },
    { mood: 'Subjonctif', label: 'Passé', key: 'subjonctifPasse', kind: 'subjonctif' },
    { mood: 'Subjonctif', label: 'Plus-que-parfait', key: 'subjonctifPlusQueParfait', kind: 'subjonctif' },
    { mood: 'Conditionnel', label: 'Présent', key: 'conditionnelPresent', kind: 'pronoun' },
    { mood: 'Conditionnel', label: 'Passé première forme', key: 'conditionnelPasse1', kind: 'pronoun' },
    { mood: 'Conditionnel', label: 'Passé deuxième forme', key: 'conditionnelPasse2', kind: 'pronoun' },
    { mood: 'Impératif', label: 'Présent', key: 'imperatifPresent', kind: 'imperative' },
    { mood: 'Impératif', label: 'Passé', key: 'imperatifPasse', kind: 'imperative' }
  ];

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function subjectWord(i, impersonal) {
    return (impersonal && i === 2) ? 'il' : SUBJECT_WORDS[i];
  }

  function pronounPhrase(i, form, reflexive, impersonal) {
    var word = subjectWord(i, impersonal);
    if (reflexive) return word + ' ' + Engine.reflexivePronoun(i, form) + form;
    if (i === 0 && Engine.VOWEL_SOUND.test(form)) return "j'" + form;
    return word + ' ' + form;
  }

  function subjonctifPhrase(i, form, reflexive, impersonal) {
    var word = subjectWord(i, impersonal);
    var que = (i === 2 || i === 5) ? "qu'" : 'que ';
    var subjPart = reflexive ? (word + ' ' + Engine.reflexivePronoun(i, form) + form) :
      (i === 0 && Engine.VOWEL_SOUND.test(form)) ? "j'" + form : word + ' ' + form;
    return que + subjPart;
  }

  function imperativePhrase(idx, form, reflexive) {
    if (!reflexive) return form;
    var suffix = idx === 0 ? 'toi' : idx === 1 ? 'nous' : 'vous';
    return form + '-' + suffix;
  }

  function tenseCardHTML(block, tenses, reflexive, impersonal) {
    var row = tenses[block.key];
    if (!row) return '';
    // Reflexive impératif passé ("sois levé" + a reflexive pronoun) isn't a
    // reliably-formed, commonly-taught construction — skip it rather than
    // show something wrong.
    if (reflexive && block.key === 'imperatifPasse') return '';
    var rows = '';
    if (block.kind === 'imperative') {
      for (var idx = 0; idx < 3; idx++) {
        if (!row[idx]) continue;
        var iPhrase = imperativePhrase(idx, row[idx], reflexive);
        rows += '<div class="conj-group imperative-row"><div class="conj-row">' +
          '<div class="conj-fr">' + Voice.escapeHtml(iPhrase) + '</div>' + Voice.button('conj-speak', iPhrase) +
          '</div></div>';
      }
    } else {
      for (var i = 0; i < 6; i++) {
        if (!row[i]) continue;
        var phrase = block.kind === 'subjonctif' ? subjonctifPhrase(i, row[i], reflexive, impersonal) : pronounPhrase(i, row[i], reflexive, impersonal);
        rows += '<div class="conj-group"><div class="conj-row">' +
          '<div class="pron">' + cap(subjectWord(i, impersonal)) + '</div>' +
          '<div class="conj-fr">' + Voice.escapeHtml(phrase) + '</div>' + Voice.button('conj-speak', phrase) +
          '</div></div>';
      }
    }
    if (!rows) return '';
    return '<div class="tense-card"><h3>' + Voice.escapeHtml(block.label) + '</h3><div class="conj-block">' + rows + '</div></div>';
  }

  // Groups TENSE_BLOCKS by mood, rendering a heading + a responsive grid of
  // tense-cards for each mood in turn.
  function moodSectionsHTML(tenses, reflexive, impersonal) {
    var out = '';
    var currentMood = null;
    var headingPending = '';
    var gridBuffer = '';
    function flush() {
      if (gridBuffer) out += headingPending + '<div class="tense-grid">' + gridBuffer + '</div>';
      gridBuffer = '';
    }
    TENSE_BLOCKS.forEach(function (block) {
      if (block.mood !== currentMood) {
        flush();
        headingPending = '<div class="mood-heading">' + Voice.escapeHtml(block.mood) + '</div>';
        currentMood = block.mood;
      }
      gridBuffer += tenseCardHTML(block, tenses, reflexive, impersonal);
    });
    flush();
    return out;
  }

  function participleAndInfinitifHTML(result) {
    var reflexive = result.reflexive;
    var partPresent = result.participlePresent;
    var partCompose = result.participleComposePhrase;
    var infPasse = result.infinitifPasse;

    if (reflexive && partPresent) {
      partPresent = (Engine.VOWEL_SOUND.test(partPresent) ? "s'" : 'se ') + partPresent;
    }
    if (reflexive) {
      partCompose = "s'étant " + result.participle;
      infPasse = "s'être " + result.participle;
    }

    var pf = result.participleForms;
    var html = '<div class="mood-heading">Participe</div><div class="tense-grid">';
    if (partPresent) {
      html += '<div class="tense-card"><h3>Présent</h3><div class="conj-block"><div class="conj-group"><div class="conj-row">' +
        '<div class="conj-fr">' + Voice.escapeHtml(partPresent) + '</div>' + Voice.button('conj-speak', partPresent) +
        '</div></div></div></div>';
    }
    html += '<div class="tense-card"><h3>Passé composé</h3><div class="conj-block"><div class="conj-group"><div class="conj-row">' +
      '<div class="conj-fr">' + Voice.escapeHtml(partCompose) + '</div>' + Voice.button('conj-speak', partCompose) +
      '</div></div></div></div>';
    html += '<div class="single-form-card"><h3>Passé</h3>' +
      ['ms:masc. sg.', 'mp:masc. pl.', 'fs:fém. sg.', 'fp:fém. pl.'].map(function (pair) {
        var parts = pair.split(':');
        var form = pf[parts[0]];
        return '<div class="gendered-row"><span class="g-label">' + parts[1] + '</span>' +
          '<span>' + Voice.escapeHtml(form) + '</span>' + Voice.button('speak-btn small', form) + '</div>';
      }).join('') +
      '</div>';
    html += '</div>';

    html += '<div class="mood-heading">Infinitif</div><div class="tense-grid">' +
      '<div class="tense-card"><h3>Présent</h3><div class="conj-block"><div class="conj-group"><div class="conj-row">' +
        '<div class="conj-fr">' + Voice.escapeHtml(result.infinitifPresent) + '</div>' + Voice.button('conj-speak', result.infinitifPresent) +
      '</div></div></div></div>' +
      '<div class="tense-card"><h3>Passé</h3><div class="conj-block"><div class="conj-group"><div class="conj-row">' +
        '<div class="conj-fr">' + Voice.escapeHtml(infPasse) + '</div>' + Voice.button('conj-speak', infPasse) +
      '</div></div></div></div>' +
      '</div>';
    return html;
  }

  function resultHTML(result) {
    var meaning = result.meaning ? ' — ' + Voice.escapeHtml(result.meaning) : '';
    var auxTag = '<span class="identify-tag">aux. ' + (result.aux === 'etre' ? 'être' : 'avoir') + '</span>';
    var guessedNote = result.isGuessed ?
      '<div class="guessed-note">Verbe non répertorié — conjugué par les règles régulières (à vérifier pour un verbe irrégulier rare).</div>' : '';
    var html = '<div class="verb-header">' +
      '<div class="infinitive">' + Voice.escapeHtml(cap(result.infinitive)) + '</div>' +
      Voice.button('speak-btn', result.infinitive) +
      auxTag +
    '</div>' + meaning + guessedNote;
    html += moodSectionsHTML(result.tenses, result.reflexive, result.impersonal);
    html += participleAndInfinitifHTML(result);
    return html;
  }

  function render(raw) {
    var out = document.getElementById('conj-result');
    var result = Engine.conjugate(raw);
    if (result.error === 'empty') {
      out.innerHTML = '<div class="conjugueur-empty">Tape un verbe à l\'infinitif pour voir sa conjugaison.</div>';
      return;
    }
    if (result.error === 'not-found') {
      out.innerHTML = '<div class="conjugueur-error">Verbe non reconnu — vérifie l\'orthographe. Les verbes en -er/-ir/-re inconnus sont conjugués automatiquement ; les verbes en -oir doivent être dans la liste vérifiée.</div>';
      return;
    }
    out.innerHTML = resultHTML(result);
  }

  function init() {
    Voice.initWarning('voiceWarning');
    var input = document.getElementById('conj-input');
    var form = document.getElementById('conj-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      render(input.value);
    });
    render(input.value);
    Voice.bindContainer(document.querySelector('main'));
  }

  document.addEventListener('DOMContentLoaded', init);
