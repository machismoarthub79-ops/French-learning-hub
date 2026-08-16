  // Curated pairs covering every row of the feminine-formation table, including irregulars.
  var FEMININE_DRILLS = [
    { masc: 'grand', en: 'big/tall', answer: 'grande', wrong: 'grand', explain: '(consonne) + e → grande.' },
    { masc: 'moderne', en: 'modern', answer: 'moderne', wrong: 'modernee', explain: 'déjà en -e : inchangé.' },
    { masc: 'actif', en: 'active', answer: 'active', wrong: 'actife', explain: '-f → -ve : active.' },
    { masc: 'premier', en: 'first', answer: 'première', wrong: 'premierre', explain: '-er → -ère : première.' },
    { masc: 'heureux', en: 'happy', answer: 'heureuse', wrong: 'heureuxe', explain: '-x → -se : heureuse.' },
    { masc: 'bon', en: 'good', answer: 'bonne', wrong: 'bone', explain: 'consonne doublée + e : bonne.' },
    { masc: 'gros', en: 'big/fat', answer: 'grosse', wrong: 'grose', explain: 'consonne doublée + e : grosse.' },
    { masc: 'complet', en: 'complete', answer: 'complète', wrong: 'completee', explain: '-et → -ète : complète.' },
    { masc: 'menteur', en: 'lying/deceitful', answer: 'menteuse', wrong: 'menteure', explain: '-eur → -euse : menteuse.' },
    { masc: 'blanc', en: 'white', answer: 'blanche', wrong: 'blance', explain: 'irrégulier : blanche.' },
    { masc: 'sec', en: 'dry', answer: 'sèche', wrong: 'sece', explain: 'irrégulier : sèche.' },
    { masc: 'long', en: 'long', answer: 'longue', wrong: 'longe', explain: 'irrégulier : longue.' }
  ];

  // Adjectives that unambiguously go before or after — the meaning-changing
  // ones (ancien, cher, dernier, grand, pauvre, propre, seul) are covered
  // separately above since their position depends on the intended meaning.
  var POSITION_DRILLS = [
    { adj: 'joli', adjEn: 'pretty', noun: 'jardin', nounEn: 'garden', answer: 'avant', explain: '« joli » fait partie de la courte liste placée avant le nom.' },
    { adj: 'rouge', adjEn: 'red', noun: 'voiture', nounEn: 'car', answer: 'après', explain: 'la plupart des adjectifs de couleur se placent après le nom.' },
    { adj: 'beau', adjEn: 'beautiful', noun: 'paysage', nounEn: 'landscape', answer: 'avant', explain: '« beau » fait partie de la courte liste placée avant le nom.' },
    { adj: 'intéressant', adjEn: 'interesting', noun: 'livre', nounEn: 'book', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'petit', adjEn: 'small', noun: 'chien', nounEn: 'dog', answer: 'avant', explain: '« petit » fait partie de la courte liste placée avant le nom.' },
    { adj: 'français', adjEn: 'French', noun: 'film', nounEn: 'film', answer: 'après', explain: 'les adjectifs de nationalité se placent après le nom.' },
    { adj: 'bon', adjEn: 'good', noun: 'restaurant', nounEn: 'restaurant', answer: 'avant', explain: '« bon » fait partie de la courte liste placée avant le nom.' },
    { adj: 'difficile', adjEn: 'difficult', noun: 'examen', nounEn: 'exam', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'jeune', adjEn: 'young', noun: 'homme', nounEn: 'man', answer: 'avant', explain: '« jeune » fait partie de la courte liste placée avant le nom.' },
    { adj: 'intelligent', adjEn: 'intelligent', noun: 'étudiant', nounEn: 'student', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'vieux', adjEn: 'old', noun: 'arbre', nounEn: 'tree', answer: 'avant', explain: '« vieux » fait partie de la courte liste placée avant le nom.' },
    { adj: 'chinois', adjEn: 'Chinese', noun: 'thé', nounEn: 'tea', answer: 'après', explain: 'les adjectifs de nationalité/origine se placent après le nom.' }
  ];

  function shuffledPair(a, b) {
    return Math.random() < 0.5 ? [a, b] : [b, a];
  }

  function choiceButtons(options) {
    return options.map(function (opt) {
      return '<button class="drill-option" data-choice="' + Voice.escapeHtml(opt) + '">' + Voice.escapeHtml(opt) + '</button>';
    }).join('');
  }

  function feminineDrillHTML(item) {
    var options = shuffledPair(item.answer, item.wrong);
    return '<div class="drill" data-answer="' + Voice.escapeHtml(item.answer) + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">le féminin de « ' + Voice.escapeHtml(item.masc) + ' » <span class="note">(' + Voice.escapeHtml(item.en) + ')</span> ?</div>' +
      '<div class="drill-options">' + choiceButtons(options) + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function positionDrillHTML(item) {
    return '<div class="drill" data-answer="' + item.answer + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">« ' + Voice.escapeHtml(item.adj) + ' » <span class="note">(' + Voice.escapeHtml(item.adjEn) + ')</span> + « ' + Voice.escapeHtml(item.noun) + ' » <span class="note">(' + Voice.escapeHtml(item.nounEn) + ')</span> — avant ou après le nom ?</div>' +
      '<div class="drill-options">' +
        '<button class="drill-option" data-choice="avant">avant</button>' +
        '<button class="drill-option" data-choice="après">après</button>' +
      '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function render() {
    document.getElementById('feminine-drills').innerHTML = FEMININE_DRILLS.map(feminineDrillHTML).join('');
    document.getElementById('position-drills').innerHTML = POSITION_DRILLS.map(positionDrillHTML).join('');
  }

  function init() {
    render();
    Interactive.initSelfChecks(document);
    Interactive.initDrills(document);
  }

  document.addEventListener('DOMContentLoaded', init);
