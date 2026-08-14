// Shared "self-check" reveal-answer widget, used by every content tab.
// Markup contract:
//   <div class="self-check">
//     <div class="q">... question ...</div>
//     <button class="reveal-btn">Voir la réponse</button>
//     <div class="answer">... answer ...</div>
//   </div>
// Clicking the button adds `.revealed` to the `.self-check` block, which
// css/styles.css uses to hide the button and show the answer.
var Interactive = (function () {
  function initSelfChecks(root) {
    root = root || document;
    root.querySelectorAll('.self-check').forEach(function (block) {
      var btn = block.querySelector('.reveal-btn');
      if (!btn) return;
      btn.addEventListener('click', function () {
        block.classList.add('revealed');
      });
    });
  }

  // Generic single-answer multiple-choice drill widget, used by every content
  // tab's practice sections. Markup contract:
  //   <div class="drill" data-answer="la" data-explain="...">
  //     <div class="prompt">société — le ou la ?</div>
  //     <div class="drill-options">
  //       <button class="drill-option" data-choice="le">le</button>
  //       <button class="drill-option" data-choice="la">la</button>
  //     </div>
  //     <div class="drill-feedback"></div>
  //   </div>
  // First click locks the question: the correct option turns green, a wrong
  // pick turns red, and the explanation is shown.
  function initDrills(root) {
    root = root || document;
    root.querySelectorAll('.drill').forEach(function (drill) {
      var answer = drill.getAttribute('data-answer');
      var explain = drill.getAttribute('data-explain') || '';
      var feedback = drill.querySelector('.drill-feedback');
      var options = drill.querySelectorAll('.drill-option');
      var answered = false;
      options.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var isCorrect = opt.getAttribute('data-choice') === answer;
          options.forEach(function (o) {
            if (o.getAttribute('data-choice') === answer) o.classList.add('correct');
            else if (o === opt) o.classList.add('incorrect');
          });
          if (feedback) feedback.textContent = (isCorrect ? '✓ Correct — ' : '✗ Pas tout à fait — ') + explain;
        });
      });
    });
  }

  return {
    initSelfChecks: initSelfChecks,
    initDrills: initDrills
  };
})();
