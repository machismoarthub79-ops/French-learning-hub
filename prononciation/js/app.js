  var ALPHABET = [
    ['A','ah'], ['B','bay'], ['C','say'], ['D','day'], ['E','euh'], ['F','eff'],
    ['G','jeh'], ['H','ash'], ['I','eeh'], ['J','jee'], ['K','kah'], ['L','ell'],
    ['M','emm'], ['N','enn'], ['O','oh'], ['P','pay'], ['Q','ku'], ['R','air'],
    ['S','ess'], ['T','tay'], ['U','uuh'], ['V','vay'], ['W','doo-blay-vay'],
    ['X','eeks'], ['Y','eeh-greyk'], ['Z','zed']
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
    var letter = pair[0], phon = pair[1];
    return '<div class="letter-chip"><span class="letter">' + letter + '</span><span class="phon">[' + phon + ']</span>' + Voice.button('speak-btn small', letter) + '</div>';
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
