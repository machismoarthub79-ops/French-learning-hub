  var CAT_NAMES  = {ALL:'Aléatoire', ER:'-er', IR:'-ir', RE:'-re / irr.', OIR:'-oir', PRONOM:'pronom.'};
  var TYPE_LABELS = {reflexive:'réfléchi', reciprocal:'réciproque', idiomatic:'idiomatique'};
  var PRON_LABELS = ['Je','Tu','Il','Elle','On','Nous','Vous','Ils','Elles'];
  var PRON_IDX    = [0,1,2,2,2,3,4,5,5];   // index into v.c[6] for each pronoun row
  var ASPIRATE_H  = {"haïr":1, "hanter":1, "hurler":1};
  var IMPERSONAL  = {"falloir":1, "pleuvoir":1};

  // All verbs the app can draw from: the main ER/IR/RE/OIR list plus the
  // pronominal (Module 15) list, so "Aléatoire" can mix in reflexive verbs too.
  var ALL_VERBS = VERBS.concat(PRONOMINAL_VERBS);

  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function vowelSoundStart(form, inf){
    return /^[aeiouyàâéèêëîïôùûü]/i.test(form) ||
           (form.charAt(0).toLowerCase() === 'h' && !ASPIRATE_H[inf]);
  }

  // subject + conjugated verb fragment, handling "je" -> "j'" elision
  function subjVerb(v, i, atStart){
    var label = PRON_LABELS[i];
    var form = v.c[PRON_IDX[i]];
    if (label === 'Je'){
      if (vowelSoundStart(form, v.i)) return (atStart ? "J'" : "j'") + form;
      return (atStart ? "Je " : "je ") + form;
    }
    return (atStart ? label : label.toLowerCase()) + ' ' + form;
  }

  // Same idea as subjVerb, but for pronominal verbs: inserts the reflexive
  // pronoun (me/te/se/nous/vous, eliding to m'/t'/s' before a vowel sound)
  // between the subject and the verb. "Je" itself never elides here, since
  // it's always followed by "me"/"m'" (both consonant-starting).
  function reflexivePronounFor(i, form, inf){
    if (i === 0) return vowelSoundStart(form, inf) ? "m'" : 'me ';
    if (i === 1) return vowelSoundStart(form, inf) ? "t'" : 'te ';
    if (i === 5) return 'nous ';
    if (i === 6) return 'vous ';
    return vowelSoundStart(form, inf) ? "s'" : 'se '; // il, elle, on, ils, elles
  }

  function subjVerbPronominal(v, i, atStart){
    var label = PRON_LABELS[i];
    var form = v.c[PRON_IDX[i]];
    return (atStart ? label : label.toLowerCase()) + ' ' + reflexivePronounFor(i, form, v.i) + form;
  }

  function jeForm(v){ return subjVerb(v, 0, true); }

  var IMPERSONAL_EXAMPLE = {
    "falloir":  {fr:"Il faut partir tôt.", en:"You need to leave early."},
    "pleuvoir": {fr:"Il pleut depuis ce matin.", en:"It has been raining since this morning."}
  };

  var wordsPerDay = 10;
  var category = 'ALL';
  var currentSet = [];

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function weekdayFr(){
    var d = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    return d.charAt(0).toUpperCase() + d.slice(1);
  }

  function pool(){
    return category === 'ALL' ? ALL_VERBS : ALL_VERBS.filter(function(v){ return v.g === category; });
  }

  function pickSet(){
    var n = Math.min(wordsPerDay, pool().length);
    currentSet = shuffle(pool()).slice(0, n);
  }

  function conjBlockHTML(v){
    if (IMPERSONAL[v.i]){
      var s = 'Il ' + v.c[2] + '.';
      var ex = IMPERSONAL_EXAMPLE[v.i];
      return '<div class="conj-block">' +
        '<div class="conj-group">' +
          '<div class="conj-row"><div class="pron">Il</div><div class="conj-fr">' + Voice.escapeHtml(s) + '</div>' + Voice.button('conj-speak', s) + '</div>' +
          '<div class="ex-row"><div class="txt"><div class="fr">' + Voice.escapeHtml(ex.fr) + '</div><div class="en">' + Voice.escapeHtml(ex.en) + '</div></div>' + Voice.button('ex-speak', ex.fr) + '</div>' +
        '</div>' +
        '<div class="impersonal-note">Verbe impersonnel — seule cette forme existe.</div>' +
        '</div>';
    }
    // Each verb has 9 fully hand-written sentences (one per pronoun), stored in
    // SENTENCES[infinitive] as [fr, en] pairs — no runtime generation.
    var sents = SENTENCES[v.i] || [];
    var rows = '';
    for (var i = 0; i < 9; i++){
      var label = PRON_LABELS[i];
      var conjSentence = (v.g === 'PRONOM' ? subjVerbPronominal(v, i, true) : subjVerb(v, i, true)) + '.';
      var pair = sents[i] || ['', ''];
      var ex = { fr: pair[0], en: pair[1] };

      rows += '<div class="conj-group">' +
        '<div class="conj-row"><div class="pron">' + label + '</div><div class="conj-fr">' + Voice.escapeHtml(conjSentence) + '</div>' + Voice.button('conj-speak', conjSentence) + '</div>' +
        '<div class="ex-row"><div class="txt"><div class="fr">' + Voice.escapeHtml(ex.fr) + '</div><div class="en">' + Voice.escapeHtml(ex.en) + '</div></div>' + Voice.button('ex-speak', ex.fr) + '</div>' +
      '</div>';
    }
    return '<div class="conj-block">' + rows + '</div>';
  }

  function cardHTML(v){
    var label = v.g === 'RE' ? 'irr.' : v.g === 'PRONOM' ? 'pronom.' : '-' + v.g.toLowerCase();
    var irrTag = v.r === 0 ? '<div class="irr-tag">⚠ ne suit pas le patron</div>' : '';
    var typeTag = v.type ? '<div class="pronom-type">' + (TYPE_LABELS[v.type] || v.type) + '</div>' : '';
    return '' +
      '<div class="card' + (v.r === 0 ? ' irregular' : '') + '">' +
        '<div class="stamp ' + v.g + '">' + label + '</div>' +
        '<div class="word-line">' +
          '<div class="infinitive">' + Voice.escapeHtml(v.i) + '</div>' +
          Voice.button('speak-btn', v.i) +
        '</div>' +
        '<div class="meaning">' + Voice.escapeHtml(v.e) + '</div>' +
        typeTag +
        irrTag +
        '<div class="divider"></div>' +
        conjBlockHTML(v) +
      '</div>';
  }

  function render(){
    document.getElementById('cards').innerHTML = currentSet.map(cardHTML).join('');
    document.getElementById('subtitle').textContent =
      wordsPerDay + ' verbes · ' + CAT_NAMES[category] + ' · ' + weekdayFr();
    document.getElementById('btn10').classList.toggle('active', wordsPerDay === 10);
    document.getElementById('btn20').classList.toggle('active', wordsPerDay === 20);
    document.querySelectorAll('[data-cat]').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
    });
  }

  function reshuffle(){
    pickSet();
    render();
  }

  function savePrefs(){
    try {
      if (window.storage && window.storage.set) {
        window.storage.set('verbeDuJour:prefs', JSON.stringify({c: wordsPerDay, cat: category}), false).catch(function(){});
      }
    } catch(e) {}
  }

  function init(){
    Voice.initWarning('voiceWarning');
    Interactive.initSelfChecks(document);

    try {
      if (window.storage && window.storage.get) {
        window.storage.get('verbeDuJour:prefs', false).then(function(res){
          if (res && res.value) {
            var p2 = JSON.parse(res.value);
            if (p2.c === 10 || p2.c === 20) wordsPerDay = p2.c;
            if (p2.cat && CAT_NAMES[p2.cat]) category = p2.cat;
            pickSet(); render();
          }
        }).catch(function(){});
      }
    } catch(e) {}

    pickSet();
    render();

    document.getElementById('shuffleBtn').addEventListener('click', reshuffle);

    document.getElementById('btn10').addEventListener('click', function(){
      wordsPerDay = 10; reshuffle(); savePrefs();
    });
    document.getElementById('btn20').addEventListener('click', function(){
      wordsPerDay = 20; reshuffle(); savePrefs();
    });

    document.querySelectorAll('[data-cat]').forEach(function(btn){
      btn.addEventListener('click', function(){
        category = btn.getAttribute('data-cat');
        reshuffle(); savePrefs();
      });
    });

    Voice.bindContainer(document.getElementById('cards'));
  }

  document.addEventListener('DOMContentLoaded', init);
