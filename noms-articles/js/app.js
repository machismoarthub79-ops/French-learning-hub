  // Curated nouns covering every rule (and exception) from the gender table above.
  var GENDER_DRILLS = [
    { noun: 'café', answer: 'le', explain: '-é est masculin (le café).' },
    { noun: 'clé', answer: 'la', explain: '« clé » est l’exception à la règle du -é masculin.' },
    { noun: 'société', answer: 'la', explain: '-té est féminin (la société).' },
    { noun: 'village', answer: 'le', explain: '-age est masculin (le village).' },
    { noun: 'plage', answer: 'la', explain: '« plage » est une exception à la règle du -age masculin.' },
    { noun: 'microscope', answer: 'le', explain: '-scope est masculin (le microscope).' },
    { noun: 'couleur', answer: 'la', explain: '-eur est féminin quand ce n’est pas une machine (la couleur).' },
    { noun: 'téléphone', answer: 'le', explain: '-phone est masculin (le téléphone).' },
    { noun: 'maison', answer: 'la', explain: '-ison est féminin (la maison).' },
    { noun: 'solution', answer: 'la', explain: '-tion est féminin (la solution).' },
    { noun: 'crème', answer: 'la', explain: '« crème » est l’exception à la règle du -ème masculin.' },
    { noun: 'problème', answer: 'le', explain: '-ème est masculin (le problème).' }
  ];

  // Curated singulars covering every plural rule (and exception) above.
  var PLURAL_DRILLS = [
    { noun: 'cheval', answer: 'chevaux', wrong: 'chevals', explain: '-al → -aux (des chevaux).' },
    { noun: 'journal', answer: 'journaux', wrong: 'journals', explain: '-al → -aux (des journaux).' },
    { noun: 'bateau', answer: 'bateaux', wrong: 'bateaus', explain: '-eau → + x (des bateaux).' },
    { noun: 'jeu', answer: 'jeux', wrong: 'jeus', explain: '-eu → + x (des jeux).' },
    { noun: 'genou', answer: 'genoux', wrong: 'genous', explain: '« genou » fait partie des -ou qui prennent x (des genoux).' },
    { noun: 'bijou', answer: 'bijoux', wrong: 'bijous', explain: '« bijou » fait partie des -ou qui prennent x (des bijoux).' },
    { noun: 'clou', answer: 'clous', wrong: 'cloux', explain: '« clou » suit la règle générale des -ou : + s (des clous).' },
    { noun: 'prix', answer: 'prix', wrong: 'prixs', explain: 'déjà en -x : aucun changement (des prix).' },
    { noun: 'nez', answer: 'nez', wrong: 'nezs', explain: 'déjà en -z : aucun changement (des nez).' },
    { noun: 'français', answer: 'français', wrong: 'françaises', explain: 'déjà en -s : aucun changement (des français).' },
    { noun: 'œil', answer: 'yeux', wrong: 'œils', explain: 'pluriel totalement irrégulier : un œil → des yeux.' },
    { noun: 'ami', answer: 'amis', wrong: 'ami', explain: 'règle par défaut : + s (des amis).' }
  ];

  function genderDrillHTML(item) {
    return '<div class="drill" data-answer="' + item.answer + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">' + Voice.escapeHtml(item.noun) + ' — le ou la ?</div>' +
      '<div class="drill-options">' +
        '<button class="drill-option" data-choice="le">le</button>' +
        '<button class="drill-option" data-choice="la">la</button>' +
      '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function pluralDrillHTML(item) {
    // Shuffle the two options per question so the correct answer isn't always first.
    var options = Math.random() < 0.5 ? [item.answer, item.wrong] : [item.wrong, item.answer];
    var buttons = options.map(function (opt) {
      return '<button class="drill-option" data-choice="' + Voice.escapeHtml(opt) + '">' + Voice.escapeHtml(opt) + '</button>';
    }).join('');
    return '<div class="drill" data-answer="' + Voice.escapeHtml(item.answer) + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">le pluriel de « ' + Voice.escapeHtml(item.noun) + ' » ?</div>' +
      '<div class="drill-options">' + buttons + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function render() {
    document.getElementById('gender-drills').innerHTML = GENDER_DRILLS.map(genderDrillHTML).join('');
    document.getElementById('plural-drills').innerHTML = PLURAL_DRILLS.map(pluralDrillHTML).join('');
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    Interactive.initSelfChecks(document);
    Interactive.initDrills(document);
  }

  document.addEventListener('DOMContentLoaded', init);
