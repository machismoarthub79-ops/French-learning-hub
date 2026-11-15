// Verb practice: 5 multiple-choice questions (one per group: -er, -ir,
// -re/irr., -oir, pronominal). Shows the French infinitive; the learner picks
// its English translation (the `e` field of the verbs data) from 4 options.
(function () {
  var GROUPS = ['ER', 'IR', 'RE', 'OIR', 'PRONOM'];
  var ALL_VERBS = VERBS.concat(PRONOMINAL_VERBS);
  var NUM_OPTIONS = 4;
  var questions = [];
  var correctCount = 0;
  var answeredCount = 0;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function label(v) {
    return v.g === 'RE' ? 'irr.' : v.g === 'PRONOM' ? 'pronom.' : '-' + v.g.toLowerCase();
  }

  // 4 options: the right meaning + 3 wrong ones from other verbs
  // (preferring the same group, so options look equally plausible).
  function buildQuestion(v) {
    var seen = {}; seen[v.e] = true;
    var same = shuffle(ALL_VERBS.filter(function (x) { return x.g === v.g; }));
    var other = shuffle(ALL_VERBS.filter(function (x) { return x.g !== v.g; }));
    var wrong = [];
    same.concat(other).forEach(function (x) {
      if (wrong.length < NUM_OPTIONS - 1 && !seen[x.e]) { seen[x.e] = true; wrong.push(x.e); }
    });
    return { verb: v, options: shuffle([v.e].concat(wrong)) };
  }

  function newSet() {
    questions = shuffle(GROUPS).map(function (g) {
      var pool = ALL_VERBS.filter(function (v) { return v.g === g; });
      return buildQuestion(pool[Math.floor(Math.random() * pool.length)]);
    });
    correctCount = 0; answeredCount = 0;
    render();
  }

  function updateScore() {
    document.getElementById('score').textContent =
      answeredCount ? 'Score : ' + correctCount + ' / ' + answeredCount : '';
  }

  function render() {
    var esc = Voice.escapeHtml;
    document.getElementById('quiz').innerHTML = questions.map(function (q, n) {
      var v = q.verb;
      var opts = q.options.map(function (o) {
        return '<button type="button" class="drill-option" data-choice="' + esc(o) + '">' + esc(o) + '</button>';
      }).join('');
      return '<div class="drill" data-n="' + n + '">' +
        '<div class="prompt">' + (n + 1) + '. <span class="practice-verb">' + esc(v.i) + '</span> ' +
          '<span class="stamp ' + v.g + ' practice-stamp">' + label(v) + '</span> ' +
          Voice.button('speak-btn', v.i) + '</div>' +
        '<div class="drill-options">' + opts + '</div>' +
        '<div class="self-check practice-reveal">' +
          '<button type="button" class="reveal-btn">Voir la réponse</button>' +
          '<div class="answer">' + esc(v.i) + ' = <strong>' + esc(v.e) + '</strong></div>' +
        '</div>' +
        '<div class="drill-feedback"></div>' +
      '</div>';
    }).join('');
    updateScore();
  }

  function lock(drill, chosen) {
    var q = questions[+drill.getAttribute('data-n')];
    var wasAnswered = drill.classList.contains('done');
    drill.classList.add('done');
    drill.querySelectorAll('.drill-option').forEach(function (o) {
      var isRight = o.getAttribute('data-choice') === q.verb.e;
      if (isRight) o.classList.add('correct');
      else if (chosen && o === chosen) o.classList.add('incorrect');
    });
    return !wasAnswered;
  }

  function init() {
    Voice.initWarning && Voice.initWarning('voiceWarning');
    var quiz = document.getElementById('quiz');

    quiz.addEventListener('click', function (e) {
      var drill = e.target.closest('.drill');
      if (!drill) return;

      var reveal = e.target.closest('.reveal-btn');
      if (reveal) {
        drill.querySelector('.self-check').classList.add('revealed');
        var first = lock(drill, null);
        if (first) { answeredCount++; updateScore(); }   // revealed = answered, no point
        return;
      }

      var opt = e.target.closest('.drill-option');
      if (opt && !drill.classList.contains('done')) {
        var q = questions[+drill.getAttribute('data-n')];
        var ok = opt.getAttribute('data-choice') === q.verb.e;
        lock(drill, opt);
        answeredCount++; if (ok) correctCount++;
        drill.querySelector('.drill-feedback').textContent =
          ok ? '✓ Correct — ' + q.verb.i + ' = ' + q.verb.e : '✗ Pas tout à fait — ' + q.verb.i + ' = ' + q.verb.e;
        updateScore();
      }
    });

    Voice.bindContainer(quiz);
    document.getElementById('shuffleBtn').addEventListener('click', newSet);
    newSet();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
