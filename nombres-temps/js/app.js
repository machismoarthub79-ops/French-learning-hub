  var DAYS = [
    ['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'], ['jeudi', 'Thursday'],
    ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday']
  ];
  var MONTHS = [
    ['janvier', 'January'], ['février', 'February'], ['mars', 'March'], ['avril', 'April'],
    ['mai', 'May'], ['juin', 'June'], ['juillet', 'July'], ['août', 'August'],
    ['septembre', 'September'], ['octobre', 'October'], ['novembre', 'November'], ['décembre', 'December']
  ];
  var SEASONS = [
    ['au printemps', 'in spring'], ['en été', 'in summer'], ['en automne', 'in autumn'], ['en hiver', 'in winter']
  ];

  var ONES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  var TEENS = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  var TENS_WORD = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

  var ONES_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var TEENS_EN = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS_WORD_EN = { 2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty', 7: 'seventy', 8: 'eighty', 9: 'ninety' };

  // French 1-100 plus the two milestones just past it (100, 1000), including
  // the irregular 70-99 zone (60+10, 4x20, 4x20+10).
  function numberToFrench(n) {
    if (n === 1000) return 'mille';
    if (n === 100) return 'cent';
    if (n < 10) return ONES[n];
    if (n < 20) return TEENS[n - 10];
    if (n < 70) {
      var tenDigit = Math.floor(n / 10);
      var unit = n % 10;
      var word = TENS_WORD[tenDigit];
      if (unit === 0) return word;
      if (unit === 1) return word + ' et un';
      return word + '-' + ONES[unit];
    }
    if (n < 80) {
      var rem = n - 60; // 10..19
      if (rem === 11) return 'soixante et onze';
      return 'soixante-' + TEENS[rem - 10];
    }
    if (n < 90) {
      if (n === 80) return 'quatre-vingts';
      return 'quatre-vingt-' + ONES[n - 80];
    }
    return 'quatre-vingt-' + TEENS[n - 90]; // 90-99
  }

  // English reference translation for the same range, for learners checking
  // their understanding rather than translating word-for-word (French's
  // "quatre-vingt-dix-neuf" isn't built the same way as "ninety-nine").
  function numberToEnglish(n) {
    if (n === 1000) return 'one thousand';
    if (n === 100) return 'one hundred';
    if (n < 10) return ONES_EN[n];
    if (n < 20) return TEENS_EN[n - 10];
    var tenDigit = Math.floor(n / 10);
    var unit = n % 10;
    var word = TENS_WORD_EN[tenDigit];
    return unit === 0 ? word : word + '-' + ONES_EN[unit];
  }

  // Plausible wrong answers: a mix of Belgian/Swiss regionalisms (septante,
  // huitante, nonante) and off-by-one/mis-hyphenated forms, weighted toward
  // the 70-99 zone the curriculum flags as the hardest.
  var QUIZ_ITEMS = [
    { n: 12, wrong: 'onze' },
    { n: 25, wrong: 'vingt et cinq' },
    { n: 44, wrong: 'quarante et quatre' },
    { n: 71, wrong: 'septante et un' },
    { n: 72, wrong: 'soixante-deux' },
    { n: 75, wrong: 'soixante-cinq' },
    { n: 79, wrong: 'soixante-neuf' },
    { n: 80, wrong: 'huitante' },
    { n: 81, wrong: 'quatre-vingt-et-un' },
    { n: 85, wrong: 'quatre-vingt-quinze' },
    { n: 89, wrong: 'quatre-vingt-dix-neuf' },
    { n: 90, wrong: 'nonante' },
    { n: 91, wrong: 'quatre-vingt-un' },
    { n: 95, wrong: 'quatre-vingt-cinq' },
    { n: 99, wrong: 'quatre-vingt-neuf' }
  ];

  function wordChip(pair) {
    var word = pair[0], en = pair[1];
    return '<span class="word-chip"><span>' + Voice.escapeHtml(word) + ' <span class="note">(' + Voice.escapeHtml(en) + ')</span></span>' + Voice.button('speak-btn small', word) + '</span>';
  }

  function numberChip(n) {
    var words = numberToFrench(n);
    var en = numberToEnglish(n);
    var zoneClass = (n >= 70 && n <= 99) ? ' irregular-zone' : '';
    return '<div class="number-chip' + zoneClass + '">' +
      '<span class="digit">' + n + '</span>' +
      '<span class="words">' + Voice.escapeHtml(words) + '</span>' +
      '<span class="en-gloss">' + Voice.escapeHtml(en) + '</span>' +
      Voice.button('speak-btn small', words) +
    '</div>';
  }

  function choiceButtons(options) {
    return options.map(function (opt) {
      return '<button class="drill-option" data-choice="' + Voice.escapeHtml(opt) + '">' + Voice.escapeHtml(opt) + '</button>';
    }).join('');
  }

  function numberDrillHTML(item) {
    var answer = numberToFrench(item.n);
    var options = Math.random() < 0.5 ? [answer, item.wrong] : [item.wrong, answer];
    return '<div class="drill" data-answer="' + Voice.escapeHtml(answer) + '" data-explain="' + item.n + ' = ' + Voice.escapeHtml(answer) + '.">' +
      '<div class="prompt">' + item.n + '</div>' +
      '<div class="drill-options">' + choiceButtons(options) + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function render() {
    document.getElementById('days-list').innerHTML = DAYS.map(wordChip).join('');
    document.getElementById('months-list').innerHTML = MONTHS.map(wordChip).join('');
    document.getElementById('seasons-list').innerHTML = SEASONS.map(wordChip).join('');

    var numbersHTML = '';
    for (var n = 1; n <= 100; n++) numbersHTML += numberChip(n);
    document.getElementById('numbers-grid').innerHTML = numbersHTML;

    document.getElementById('big-numbers').innerHTML = numberChip(100) + numberChip(1000);

    document.getElementById('number-drills').innerHTML = QUIZ_ITEMS.map(numberDrillHTML).join('');
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    Voice.bindContainer(document.querySelector('main'));
    Interactive.initSelfChecks(document);
    Interactive.initDrills(document);
  }

  document.addEventListener('DOMContentLoaded', init);
