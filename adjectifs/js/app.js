  // Curated pairs covering every row of the feminine-formation table, including irregulars.
  var FEMININE_DRILLS = [
    { masc: 'grand', answer: 'grande', wrong: 'grand', explain: '(consonne) + e → grande.' },
    { masc: 'moderne', answer: 'moderne', wrong: 'modernee', explain: 'déjà en -e : inchangé.' },
    { masc: 'actif', answer: 'active', wrong: 'actife', explain: '-f → -ve : active.' },
    { masc: 'premier', answer: 'première', wrong: 'premierre', explain: '-er → -ère : première.' },
    { masc: 'heureux', answer: 'heureuse', wrong: 'heureuxe', explain: '-x → -se : heureuse.' },
    { masc: 'bon', answer: 'bonne', wrong: 'bone', explain: 'consonne doublée + e : bonne.' },
    { masc: 'gros', answer: 'grosse', wrong: 'grose', explain: 'consonne doublée + e : grosse.' },
    { masc: 'complet', answer: 'complète', wrong: 'completee', explain: '-et → -ète : complète.' },
    { masc: 'menteur', answer: 'menteuse', wrong: 'menteure', explain: '-eur → -euse : menteuse.' },
    { masc: 'blanc', answer: 'blanche', wrong: 'blance', explain: 'irrégulier : blanche.' },
    { masc: 'sec', answer: 'sèche', wrong: 'sece', explain: 'irrégulier : sèche.' },
    { masc: 'long', answer: 'longue', wrong: 'longe', explain: 'irrégulier : longue.' }
  ];

  // Adjectives that unambiguously go before or after — the meaning-changing
  // ones (ancien, cher, dernier, grand, pauvre, propre, seul) are covered
  // separately above since their position depends on the intended meaning.
  var POSITION_DRILLS = [
    { adj: 'joli', noun: 'jardin', answer: 'avant', explain: '« joli » fait partie de la courte liste placée avant le nom.' },
    { adj: 'rouge', noun: 'voiture', answer: 'après', explain: 'la plupart des adjectifs de couleur se placent après le nom.' },
    { adj: 'beau', noun: 'paysage', answer: 'avant', explain: '« beau » fait partie de la courte liste placée avant le nom.' },
    { adj: 'intéressant', noun: 'livre', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'petit', noun: 'chien', answer: 'avant', explain: '« petit » fait partie de la courte liste placée avant le nom.' },
    { adj: 'français', noun: 'film', answer: 'après', explain: 'les adjectifs de nationalité se placent après le nom.' },
    { adj: 'bon', noun: 'restaurant', answer: 'avant', explain: '« bon » fait partie de la courte liste placée avant le nom.' },
    { adj: 'difficile', noun: 'examen', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'jeune', noun: 'homme', answer: 'avant', explain: '« jeune » fait partie de la courte liste placée avant le nom.' },
    { adj: 'intelligent', noun: 'étudiant', answer: 'après', explain: 'position par défaut : après le nom.' },
    { adj: 'vieux', noun: 'arbre', answer: 'avant', explain: '« vieux » fait partie de la courte liste placée avant le nom.' },
    { adj: 'chinois', noun: 'thé', answer: 'après', explain: 'les adjectifs de nationalité/origine se placent après le nom.' }
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
      '<div class="prompt">le féminin de « ' + Voice.escapeHtml(item.masc) + ' » ?</div>' +
      '<div class="drill-options">' + choiceButtons(options) + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function positionDrillHTML(item) {
    return '<div class="drill" data-answer="' + item.answer + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">« ' + Voice.escapeHtml(item.adj) + ' » + « ' + Voice.escapeHtml(item.noun) + ' » — avant ou après le nom ?</div>' +
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
