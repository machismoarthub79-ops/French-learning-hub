  // Curated nouns covering every rule (and exception) from the gender table above.
  var GENDER_DRILLS = [
    { noun: 'café', en: 'coffee', answer: 'le', explain: '-é est masculin (le café).' },
    { noun: 'clé', en: 'key', answer: 'la', explain: '« clé » est l’exception à la règle du -é masculin.' },
    { noun: 'société', en: 'society/company', answer: 'la', explain: '-té est féminin (la société).' },
    { noun: 'village', en: 'village', answer: 'le', explain: '-age est masculin (le village).' },
    { noun: 'plage', en: 'beach', answer: 'la', explain: '« plage » est une exception à la règle du -age masculin.' },
    { noun: 'microscope', en: 'microscope', answer: 'le', explain: '-scope est masculin (le microscope).' },
    { noun: 'couleur', en: 'color', answer: 'la', explain: '-eur est féminin quand ce n’est pas une machine (la couleur).' },
    { noun: 'téléphone', en: 'telephone', answer: 'le', explain: '-phone est masculin (le téléphone).' },
    { noun: 'maison', en: 'house', answer: 'la', explain: '-ison est féminin (la maison).' },
    { noun: 'solution', en: 'solution', answer: 'la', explain: '-tion est féminin (la solution).' },
    { noun: 'crème', en: 'cream', answer: 'la', explain: '« crème » est l’exception à la règle du -ème masculin.' },
    { noun: 'problème', en: 'problem', answer: 'le', explain: '-ème est masculin (le problème).' }
  ];

  // Curated singulars covering every plural rule (and exception) above.
  var PLURAL_DRILLS = [
    { noun: 'cheval', en: 'horse', answer: 'chevaux', wrong: 'chevals', explain: '-al → -aux (des chevaux).' },
    { noun: 'journal', en: 'newspaper', answer: 'journaux', wrong: 'journals', explain: '-al → -aux (des journaux).' },
    { noun: 'bateau', en: 'boat', answer: 'bateaux', wrong: 'bateaus', explain: '-eau → + x (des bateaux).' },
    { noun: 'jeu', en: 'game', answer: 'jeux', wrong: 'jeus', explain: '-eu → + x (des jeux).' },
    { noun: 'genou', en: 'knee', answer: 'genoux', wrong: 'genous', explain: '« genou » fait partie des -ou qui prennent x (des genoux).' },
    { noun: 'bijou', en: 'jewel', answer: 'bijoux', wrong: 'bijous', explain: '« bijou » fait partie des -ou qui prennent x (des bijoux).' },
    { noun: 'clou', en: 'nail', answer: 'clous', wrong: 'cloux', explain: '« clou » suit la règle générale des -ou : + s (des clous).' },
    { noun: 'prix', en: 'price', answer: 'prix', wrong: 'prixs', explain: 'déjà en -x : aucun changement (des prix).' },
    { noun: 'nez', en: 'nose', answer: 'nez', wrong: 'nezs', explain: 'déjà en -z : aucun changement (des nez).' },
    { noun: 'français', en: 'French person', answer: 'français', wrong: 'françaises', explain: 'déjà en -s : aucun changement (des français).' },
    { noun: 'œil', en: 'eye', answer: 'yeux', wrong: 'œils', explain: 'pluriel totalement irrégulier : un œil → des yeux.' },
    { noun: 'ami', en: 'friend', answer: 'amis', wrong: 'ami', explain: 'règle par défaut : + s (des amis).' }
  ];

  function genderDrillHTML(item) {
    return '<div class="drill" data-answer="' + item.answer + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">' + Voice.escapeHtml(item.noun) + ' <span class="note">(' + Voice.escapeHtml(item.en) + ')</span> — le ou la ?</div>' +
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
      '<div class="prompt">le pluriel de « ' + Voice.escapeHtml(item.noun) + ' » <span class="note">(' + Voice.escapeHtml(item.en) + ')</span> ?</div>' +
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
