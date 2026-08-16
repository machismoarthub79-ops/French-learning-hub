  var PRON_LABELS = ['Je', 'Tu', 'Il', 'Elle', 'On', 'Nous', 'Vous', 'Ils', 'Elles'];
  var PRON_IDX = [0, 1, 2, 2, 2, 3, 4, 5, 5]; // index into the 6-form [je,tu,il,nous,vous,ils] array

  var ETRE_FORMS = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];
  var AVOIR_FORMS = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];

  function subjVerb(forms, i, atStart) {
    var label = PRON_LABELS[i];
    var form = forms[PRON_IDX[i]];
    if (label === 'Je') {
      if (/^[aeiouyàâéèêëîïôùûü]/i.test(form)) return (atStart ? "J'" : "j'") + form;
      return (atStart ? 'Je ' : 'je ') + form;
    }
    return (atStart ? label : label.toLowerCase()) + ' ' + form;
  }

  function conjRowHTML(forms, i) {
    var label = PRON_LABELS[i];
    var sentence = subjVerb(forms, i, true) + '.';
    return '<div class="conj-group"><div class="conj-row">' +
      '<div class="pron">' + label + '</div>' +
      '<div class="conj-fr">' + Voice.escapeHtml(sentence) + '</div>' +
      Voice.button('conj-speak', sentence) +
      '</div></div>';
  }

  function renderConj(elId, forms) {
    var rows = '';
    for (var i = 0; i < 9; i++) rows += conjRowHTML(forms, i);
    document.getElementById(elId).innerHTML = rows;
  }

  // Six avoir examples testing the un/une/des/du/de-la -> de collapse, and six
  // être examples testing plain ne...pas placement (including je -> j' elision).
  var NEGATION_DRILLS = [
    { affirmative: "J'ai un chat.", en: 'I have a cat.', answer: "Je n'ai pas de chat.", wrong: "Je n'ai pas un chat.", explain: "après un avoir négatif, un/une/des/du/de la deviennent « de »." },
    { affirmative: 'Tu as une voiture.', en: 'You have a car.', answer: "Tu n'as pas de voiture.", wrong: "Tu n'as pas une voiture.", explain: "après un avoir négatif, un/une/des/du/de la deviennent « de »." },
    { affirmative: 'Il a des amis.', en: 'He has friends.', answer: "Il n'a pas d'amis.", wrong: "Il n'a pas des amis.", explain: "« des » devient « de » (élidé en « d' » devant voyelle)." },
    { affirmative: 'Nous avons du temps.', en: 'We have time.', answer: "Nous n'avons pas de temps.", wrong: "Nous n'avons pas du temps.", explain: "« du » devient « de »." },
    { affirmative: 'Vous avez de la chance.', en: 'You are lucky.', answer: "Vous n'avez pas de chance.", wrong: "Vous n'avez pas de la chance.", explain: "« de la » devient « de »." },
    { affirmative: 'Elles ont un problème.', en: 'They have a problem.', answer: "Elles n'ont pas de problème.", wrong: "Elles n'ont pas un problème.", explain: "« un » devient « de »." },
    { affirmative: 'Je suis content.', en: 'I am happy.', answer: 'Je ne suis pas content.', wrong: 'Je suis ne pas content.', explain: 'ne se place avant le verbe, pas se place après.' },
    { affirmative: 'Tu es prêt.', en: 'You are ready.', answer: "Tu n'es pas prêt.", wrong: 'Tu es ne pas prêt.', explain: "ne (élidé en n') avant le verbe, pas après." },
    { affirmative: 'Il est fatigué.', en: 'He is tired.', answer: "Il n'est pas fatigué.", wrong: "Il n'est fatigué pas.", explain: '« pas » se place juste après le verbe conjugué.' },
    { affirmative: 'Nous sommes en retard.', en: 'We are late.', answer: 'Nous ne sommes pas en retard.', wrong: 'Nous sommes pas en retard.', explain: "ne ne doit jamais être oublié à l'écrit." },
    { affirmative: 'Vous êtes libres.', en: 'You are free.', answer: "Vous n'êtes pas libres.", wrong: "Vous n'êtes libres pas.", explain: '« pas » se place juste après le verbe conjugué.' },
    { affirmative: 'Elles sont fatiguées.', en: 'They are tired.', answer: 'Elles ne sont pas fatiguées.', wrong: 'Elles sont ne pas fatiguées.', explain: 'ne se place avant le verbe, pas se place après.' }
  ];

  function choiceButtons(options) {
    return options.map(function (opt) {
      return '<button class="drill-option" data-choice="' + Voice.escapeHtml(opt) + '">' + Voice.escapeHtml(opt) + '</button>';
    }).join('');
  }

  function negationDrillHTML(item) {
    var options = Math.random() < 0.5 ? [item.answer, item.wrong] : [item.wrong, item.answer];
    return '<div class="drill" data-answer="' + Voice.escapeHtml(item.answer) + '" data-explain="' + Voice.escapeHtml(item.explain) + '">' +
      '<div class="prompt">' + Voice.escapeHtml(item.affirmative) + ' <span class="note">(' + Voice.escapeHtml(item.en) + ')</span></div>' +
      '<div class="drill-options">' + choiceButtons(options) + '</div>' +
      '<div class="drill-feedback"></div>' +
    '</div>';
  }

  function render() {
    renderConj('etre-conj', ETRE_FORMS);
    renderConj('avoir-conj', AVOIR_FORMS);
    document.getElementById('negation-drills').innerHTML = NEGATION_DRILLS.map(negationDrillHTML).join('');
  }

  function init() {
    Voice.initWarning('voiceWarning');
    render();
    Voice.bindContainer(document.querySelector('main'));
    Interactive.initSelfChecks(document);
    Interactive.initDrills(document);
  }

  document.addEventListener('DOMContentLoaded', init);
