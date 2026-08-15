  // Third field is the letter's actual French name, spelled as a real French
  // word — this is what gets sent to speech synthesis. A bare single Latin
  // character (e.g. "W") has no reliable French pronunciation a TTS engine
  // can infer on its own; some letters (W = "double vé", Y = "i grec") bear
  // no resemblance at all to the character and can only come out right if
  // the actual name is spoken. The second field (English-style phonetic
  // hint, e.g. "doo-blay-vay") is unchanged and only for on-screen reading.
  var ALPHABET = [
    ['A','ah','a'], ['B','bay','bé'], ['C','say','cé'], ['D','day','dé'], ['E','euh','euh'], ['F','eff','effe'],
    ['G','jeh','gé'], ['H','ash','hache'], ['I','eeh','i'], ['J','jee','ji'], ['K','kah','ka'], ['L','ell','elle'],
    ['M','emm','emme'], ['N','enn','enne'], ['O','oh','o'], ['P','pay','pé'], ['Q','ku','ku'], ['R','air','erre'],
    ['S','ess','esse'], ['T','tay','té'], ['U','uuh','u'], ['V','vay','vé'], ['W','doo-blay-vay','double vé'],
    ['X','eeks','iks'], ['Y','eeh-greyk','i grec'], ['Z','zed','zède']
  ];

  var DESPOTIX_WORDS = ['canard', 'Paris', 'beaucoup', 'chocolat', 'prix', 'riz'];
  var H_WORDS = ['homme', 'hôpital', 'hôtel'];
  var S_WORDS = ['maison', 'chose'];
  var C_K_WORDS = ['cadeau', 'comme', 'cube'];
  var C_S_WORDS = ['ceci', 'cinéma'];
  var C_CEDILLE_WORDS = ['ça', 'français'];
  var CH_SH_WORDS = ['chat', 'chien'];
  var CH_K_WORDS = ['Christian', 'écho'];
  var QU_WORDS = ['quatre', 'quel', 'qui'];

  var NASAL_GROUPS = [
    { pattern: 'am / an / em / en', words: ['maman', 'quand', 'temps'] },
    { pattern: 'om / on', words: ['bonjour', 'nom'] },
    { pattern: 'im / in / ain / aim', words: ['matin', 'pain', 'faim'] },
    { pattern: 'um / un', words: ['un', 'parfum'] }
  ];

  function wordChip(word) {
    return '<span class="word-chip"><span>' + Voice.escapeHtml(word) + '</span>' + Voice.button('speak-btn small', word) + '</span>';
  }

  function wordList(words) {
    return words.map(wordChip).join('');
  }

  function letterChip(pair) {
    var letter = pair[0], phon = pair[1], speakAs = pair[2];
    return '<div class="letter-chip"><span class="letter">' + letter + '</span><span class="phon">[' + phon + ']</span>' + Voice.button('speak-btn small', speakAs) + '</div>';
  }

  function nasalGroupHTML(group) {
    return '<h3>' + Voice.escapeHtml(group.pattern) + '</h3><div class="word-list">' + wordList(group.words) + '</div>';
  }

  function render() {
    document.getElementById('alphabet-grid').innerHTML = ALPHABET.map(letterChip).join('');
    document.getElementById('despotix-words').innerHTML = wordList(DESPOTIX_WORDS);
    document.getElementById('h-words').innerHTML = wordList(H_WORDS);
    document.getElementById('s-words').innerHTML = wordList(S_WORDS);
    document.getElementById('c-k-words').innerHTML = wordList(C_K_WORDS);
    document.getElementById('c-s-words').innerHTML = wordList(C_S_WORDS);
    document.getElementById('c-cedille-words').innerHTML = wordList(C_CEDILLE_WORDS);
    document.getElementById('ch-sh-words').innerHTML = wordList(CH_SH_WORDS);
    document.getElementById('ch-k-words').innerHTML = wordList(CH_K_WORDS);
    document.getElementById('qu-words').innerHTML = wordList(QU_WORDS);
    document.getElementById('nasal-groups').innerHTML = NASAL_GROUPS.map(nasalGroupHTML).join('');
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    Voice.bindContainer(document.querySelector('main'));
    Interactive.initSelfChecks(document);
  }

  document.addEventListener('DOMContentLoaded', init);
