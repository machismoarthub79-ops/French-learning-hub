// Adds a small "×" button to every text input / textarea on the site so
// typed text can be cleared in one tap, instead of select-all-delete.
// Usage:
//   <script src="../js/clearable-input.js"></script>   // wires static markup on load
//   ClearableInput.wireAll(root)                        // call again after re-rendering
//                                                        // dynamic fields (e.g. innerHTML swaps)
var ClearableInput = (function () {
  function wire(el) {
    if (el.dataset.clearableWired || el.readOnly || el.disabled) return;
    el.dataset.clearableWired = '1';

    var wrap = document.createElement('span');
    wrap.className = 'clearable-wrap' + (el.tagName === 'TEXTAREA' ? ' is-textarea' : '');
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clearable-btn';
    btn.setAttribute('aria-label', 'Effacer');
    btn.hidden = !el.value;
    btn.textContent = '×';
    wrap.appendChild(btn);

    el.addEventListener('input', function () { btn.hidden = !el.value; });

    btn.addEventListener('click', function () {
      el.value = '';
      btn.hidden = true;
      el.focus();
      // Let whatever page-level listener owns this field (search filters,
      // autosave, etc.) react exactly as if the user had deleted the text.
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function wireAll(root) {
    (root || document).querySelectorAll('input[type="text"], input[type="search"], textarea').forEach(wire);
  }

  document.addEventListener('DOMContentLoaded', function () { wireAll(document); });

  return { wire: wire, wireAll: wireAll };
})();
