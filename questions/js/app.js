  var EXAMPLE_SENTENCES = [
    ['Est-ce que tu as faim ?', 'Are you hungry?'],
    ["Qu'est-ce que tu veux ?", 'What do you want?'],
    ['Où est le jardin ?', 'Where is the garden?'],
    ['Qui est ton frère ?', 'Who is your brother?'],
    ['Comment ça va ?', "How's it going?"],
    ['Quand est ton anniversaire ?', 'When is your birthday?'],
    ['Pourquoi es-tu en retard ?', 'Why are you late?'],
    ['Combien ça coûte ?', 'How much does it cost?'],
    ["Quelle heure est-il ?", 'What time is it?']
  ];

  // Nouns covering all four quel/quelle/quels/quelles forms.
  var QUEL_DRILLS = [
    { noun: 'heure', en: 'hour', answer: 'quelle', explain: 'heure est féminin singulier.' },
    { noun: 'prix', en: 'price', answer: 'quel', explain: 'prix est masculin singulier.' },
    { noun: 'jours', en: 'days', answer: 'quels', explain: 'jours est masculin pluriel.' },
    { noun: 'couleurs', en: 'colors', answer: 'quelles', explain: 'couleurs est féminin pluriel.' },
    { noun: 'adresse', en: 'address', answer: 'quelle', explain: 'adresse est féminin singulier.' },
    { noun: 'nom', en: 'name', answer: 'quel', explain: 'nom est masculin singulier.' },
    { noun: 'livres', en: 'books', answer: 'quels', explain: 'livres est masculin pluriel.' },
    { noun: 'vacances', en: 'vacation', answer: 'quelles', explain: 'vacances est féminin pluriel.' },
    { noun: 'âge', en: 'age', answer: 'quel', explain: 'âge est masculin singulier.' },
    { noun: 'ville', en: 'city', answer: 'quelle', explain: 'ville est féminin singulier.' },
    { noun: 'amis', en: 'friends', answer: 'quels', explain: 'amis est masculin pluriel.' },
    { noun: 'saisons', en: 'seasons', answer: 'quelles', explain: 'saisons est féminin pluriel.' }
  ];

  // English prompt -> a model answer (self-graded: compare your own attempt
  // to the reveal, since several phrasings — inversion vs. est-ce que — are
  // equally correct). Covers every question word at least twice.
  var QUESTION_DRILLS = [
    { en: 'Do you have time?', fr: 'Est-ce que tu as le temps ?' },
    { en: 'Are you coming tonight?', fr: 'Est-ce que tu viens ce soir ?' },
    { en: 'What do you want?', fr: "Qu'est-ce que tu veux ?" },
    { en: 'What are you doing this weekend?', fr: "Qu'est-ce que tu fais ce week-end ?" },
    { en: 'Where is the train station?', fr: 'Où est la gare ?' },
    { en: 'Where do you live?', fr: 'Où habites-tu ? (ou : Où est-ce que tu habites ?)' },
    { en: 'Who is that?', fr: 'Qui est-ce ?' },
    { en: 'Who is coming with us?', fr: 'Qui vient avec nous ?' },
    { en: 'How are you?', fr: 'Comment vas-tu ? (ou : Comment ça va ?)' },
    { en: 'How do you say that in French?', fr: 'Comment dit-on ça en français ?' },
    { en: 'When does the movie start?', fr: 'Quand commence le film ?' },
    { en: 'When are you leaving?', fr: 'Quand pars-tu ? (ou : Quand est-ce que tu pars ?)' },
    { en: 'Why are you late?', fr: 'Pourquoi es-tu en retard ? (ou : Pourquoi est-ce que tu es en retard ?)' },
    { en: 'Why not?', fr: 'Pourquoi pas ?' },
    { en: 'How much is this?', fr: 'Combien ça coûte ?' },
    { en: 'How many books do you have?', fr: 'Combien de livres as-tu ?' },
    { en: 'What time is it?', fr: 'Quelle heure est-il ?' },
    { en: 'Which restaurant do you prefer?', fr: 'Quel restaurant préfères-tu ?' }
  ];

  function wordChip(pair) {
    var fr = pair[0], en = pair[1];
    return '<span class="word-chip"><span>' + Voice.escapeHtml(fr) + ' <span class="note">(' + Voice.escapeHtml(en) + ')</span></span>' + Voice.button('speak-btn small', fr) + '</span>';
  }

  function quelDrillHTML(item) {
    var options = ['quel', 'quelle', 'quels', 'quelles'];
    var buttons = options.map(function (opt) {
      return '<button class="drill-option" data-choice="' + opt + '">' + opt + '</button>';
    }).join('');
    return '<div class="drill" data-answer="' + item.answer + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">' + Voice.escapeHtml(item.noun) + ' <span class="note">(' + Voice.escapeHtml(item.en) + ')</span></div>' +
      '<div class="drill-options">' + buttons + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function questionDrillHTML(item) {
    return '<div class="self-check">' +
      '<div class="q">' + Voice.escapeHtml(item.en) + '</div>' +
      '<button class="reveal-btn">Voir la réponse</button>' +
      '<div class="answer">' + Voice.escapeHtml(item.fr) + '</div>' +
    '</div>';
  }

  function render() {
    document.getElementById('example-words').innerHTML = EXAMPLE_SENTENCES.map(wordChip).join('');
    document.getElementById('quel-drills').innerHTML = QUEL_DRILLS.map(quelDrillHTML).join('');
    document.getElementById('question-drills').innerHTML = QUESTION_DRILLS.map(questionDrillHTML).join('');
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    Voice.bindContainer(document.querySelector('main'));
    Interactive.initSelfChecks(document);
    Interactive.initDrills(document);
  }

  document.addEventListener('DOMContentLoaded', init);
