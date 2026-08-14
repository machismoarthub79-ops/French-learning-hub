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

  return {
    initSelfChecks: initSelfChecks
  };
})();
