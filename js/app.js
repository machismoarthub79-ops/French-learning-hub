  var SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 6a9 9 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>';

  var CAT_NAMES  = {ALL:'Aléatoire', ER:'-er', IR:'-ir', RE:'-re / irr.'};
  var PRON_LABELS = ['Je','Tu','Il','Elle','On','Nous','Vous','Ils','Elles'];
  var PRON_IDX    = [0,1,2,2,2,3,4,5,5];   // index into v.c[6] for each pronoun row
  var ASPIRATE_H  = {"haïr":1, "hanter":1, "hurler":1};
  var IMPERSONAL  = {"falloir":1, "pleuvoir":1};

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

  function jeForm(v){ return subjVerb(v, 0, true); }

  var IMPERSONAL_EXAMPLE = {
    "falloir":  {fr:"Il faut partir tôt.", en:"You need to leave early."},
    "pleuvoir": {fr:"Il pleut depuis ce matin.", en:"It has been raining since this morning."}
  };

  var wordsPerDay = 10;
  var category = 'ALL';
  var playbackRate = 1;
  var currentSet = [];
  var frVoice = null;

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

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function pool(){
    return category === 'ALL' ? VERBS : VERBS.filter(function(v){ return v.g === category; });
  }

  function pickSet(){
    var n = Math.min(wordsPerDay, pool().length);
    currentSet = shuffle(pool()).slice(0, n);
  }

  function speakBtn(cls, text){
    return '<button class="' + cls + '" data-text="' + escapeHtml(text) + '" aria-label="Écouter">' + SPEAKER_SVG + '</button>';
  }

  function conjBlockHTML(v){
    if (IMPERSONAL[v.i]){
      var s = 'Il ' + v.c[2] + '.';
      var ex = IMPERSONAL_EXAMPLE[v.i];
      return '<div class="conj-block">' +
        '<div class="conj-group">' +
          '<div class="conj-row"><div class="pron">Il</div><div class="conj-fr">' + escapeHtml(s) + '</div>' + speakBtn('conj-speak', s) + '</div>' +
          '<div class="ex-row"><div class="txt"><div class="fr">' + escapeHtml(ex.fr) + '</div><div class="en">' + escapeHtml(ex.en) + '</div></div>' + speakBtn('ex-speak', ex.fr) + '</div>' +
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
      var conjSentence = subjVerb(v, i, true) + '.';
      var pair = sents[i] || ['', ''];
      var ex = { fr: pair[0], en: pair[1] };

      rows += '<div class="conj-group">' +
        '<div class="conj-row"><div class="pron">' + label + '</div><div class="conj-fr">' + escapeHtml(conjSentence) + '</div>' + speakBtn('conj-speak', conjSentence) + '</div>' +
        '<div class="ex-row"><div class="txt"><div class="fr">' + escapeHtml(ex.fr) + '</div><div class="en">' + escapeHtml(ex.en) + '</div></div>' + speakBtn('ex-speak', ex.fr) + '</div>' +
      '</div>';
    }
    return '<div class="conj-block">' + rows + '</div>';
  }

  function cardHTML(v){
    var label = v.g === 'RE' ? 'irr.' : '-' + v.g.toLowerCase();
    var irrTag = v.r === 0 ? '<div class="irr-tag">⚠ ne suit pas le patron</div>' : '';
    return '' +
      '<div class="card' + (v.r === 0 ? ' irregular' : '') + '">' +
        '<div class="stamp ' + v.g + '">' + label + '</div>' +
        '<div class="word-line">' +
          '<div class="infinitive">' + escapeHtml(v.i) + '</div>' +
          '<button class="speak-btn" data-text="' + escapeHtml(v.i) + '" aria-label="Écouter">' + SPEAKER_SVG + '</button>' +
        '</div>' +
        '<div class="meaning">' + escapeHtml(v.e) + '</div>' +
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

  function loadVoices(){
    if (!('speechSynthesis' in window)) return;
    var voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    frVoice = voices.find(function(v){ return v.lang === 'fr-FR'; }) ||
              voices.find(function(v){ return v.lang && v.lang.indexOf('fr') === 0; }) || null;
  }

  function speak(text, btn){
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    if (frVoice) utter.voice = frVoice;
    utter.rate = 0.92 * playbackRate;
    if (btn){
      utter.onstart = function(){ btn.classList.add('playing'); };
      utter.onend = function(){ btn.classList.remove('playing'); };
      utter.onerror = function(){ btn.classList.remove('playing'); };
    }
    window.speechSynthesis.speak(utter);
  }

  function savePrefs(){
    try {
      if (window.storage && window.storage.set) {
        window.storage.set('verbeDuJour:prefs', JSON.stringify({c: wordsPerDay, cat: category, rate: playbackRate}), false).catch(function(){});
      }
    } catch(e) {}
  }

  function init(){
    var supported = 'speechSynthesis' in window;
    if (!supported){
      document.getElementById('voiceWarning').style.display = 'block';
    } else {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    try {
      if (window.storage && window.storage.get) {
        window.storage.get('verbeDuJour:prefs', false).then(function(res){
          if (res && res.value) {
            var p2 = JSON.parse(res.value);
            if (p2.c === 10 || p2.c === 20) wordsPerDay = p2.c;
            if (p2.cat && CAT_NAMES[p2.cat]) category = p2.cat;
            if (p2.rate === 1 || p2.rate === 0.75 || p2.rate === 0.5) {
              playbackRate = p2.rate;
              document.querySelectorAll('.speed-btn').forEach(function(btn){
                btn.classList.toggle('active', parseFloat(btn.getAttribute('data-speed')) === playbackRate);
              });
            }
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

    document.querySelectorAll('.speed-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        playbackRate = parseFloat(btn.getAttribute('data-speed'));
        document.querySelectorAll('.speed-btn').forEach(function(b){
          b.classList.toggle('active', b === btn);
        });
        savePrefs();
      });
    });

    document.getElementById('cards').addEventListener('click', function(e){
      var btn = e.target.closest('.speak-btn, .conj-speak, .ex-speak');
      if (btn) speak(btn.getAttribute('data-text'), btn);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
