// Conjugation engine: pure functions, no DOM. Given any French infinitive
// (from the irregular table in data/verbs.js, or a regular -er/-ir/-re verb
// derived by rule), produces the full set of tenses/moods shown by
// traditional French conjugation references — indicatif, subjonctif,
// conditionnel, participe, impératif, infinitif — including every compound
// tense, built from the auxiliary paradigms plus the verb's own past
// participle.
//
// Design: every irregular verb only stores the handful of forms that truly
// can't be predicted (present tense, past participle, passé simple, and a
// few suppletive overrides). Everything else is derived by the same rules
// used for a fully regular verb — imparfait from the "nous" present stem,
// futur/conditionnel from a future stem, subjonctif présent from the
// present tense's two stems, subjonctif imparfait from passé simple, and
// every compound tense from the auxiliary's own paradigm + the participle.
var Engine = (function () {
  var VOWEL_SOUND = /^[aeiouyàâéèêëîïôùûüh]/i;

  function stripAccents(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalize(s) {
    return stripAccents(s).toLowerCase().replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // ---- lookup table, keyed by accent-stripped infinitive ----
  var TABLE = {};
  IRREGULAR_VERBS.forEach(function (v) { TABLE[normalize(v.i)] = v; });

  // ---- regular verb derivation (used when the infinitive isn't in the table) ----

  // -er verbs: detect the spelling-change family from the stem (infinitive
  // minus "er") and apply it only to the mute-ending forms (je/tu/il/ils);
  // nous/vous keep the base stem since their endings are pronounced.
  function erPresent(stem) {
    var last = stem.charAt(stem.length - 1);
    var last2 = stem.charAt(stem.length - 2);
    if (last === 'c') {
      var cBase = stem.slice(0, -1);
      return [stem + 'e', stem + 'es', stem + 'e', cBase + 'çons', stem + 'ez', stem + 'ent'];
    }
    if (last === 'g') {
      return [stem + 'e', stem + 'es', stem + 'e', stem + 'eons', stem + 'ez', stem + 'ent'];
    }
    if (last === 'y') {
      var iStem = stem.slice(0, -1) + 'i';
      return [iStem + 'e', iStem + 'es', iStem + 'e', stem + 'ons', stem + 'ez', iStem + 'ent'];
    }
    if (last2 === 'é') {
      var eBase = stem.slice(0, -2) + 'è' + last;
      return [eBase + 'e', eBase + 'es', eBase + 'e', stem + 'ons', stem + 'ez', eBase + 'ent'];
    }
    if (last2 === 'e' && /[bcdfgjklmnpqrstvz]/.test(last)) {
      var accBase = stem.slice(0, -2) + 'è' + last;
      return [accBase + 'e', accBase + 'es', accBase + 'e', stem + 'ons', stem + 'ez', accBase + 'ent'];
    }
    return [stem + 'e', stem + 'es', stem + 'e', stem + 'ons', stem + 'ez', stem + 'ent'];
  }

  function regularPresent(infinitive) {
    // Check -oir before -ir: every -oir infinitive also ends in "ir" as its
    // last two letters (pouvoir, savoir, avoir...), and there's no reliable
    // regular pattern for -oir verbs, so it must be excluded first.
    if (infinitive.length > 3 && infinitive.slice(-3) === 'oir') {
      return null;
    }
    if (infinitive.length > 2 && infinitive.slice(-2) === 'er') {
      return erPresent(infinitive.slice(0, -2));
    }
    if (infinitive.length > 2 && infinitive.slice(-2) === 'ir') {
      var irStem = infinitive.slice(0, -2);
      return [irStem + 'is', irStem + 'is', irStem + 'it', irStem + 'issons', irStem + 'issez', irStem + 'issent'];
    }
    if (infinitive.length > 2 && infinitive.slice(-2) === 're') {
      var reStem = infinitive.slice(0, -2);
      return [reStem + 's', reStem + 's', reStem, reStem + 'ons', reStem + 'ez', reStem + 'ent'];
    }
    return null; // anything else has no reliable regular pattern
  }

  function regularFutureStem(infinitive) {
    return infinitive.slice(-2) === 're' ? infinitive.slice(0, -1) : infinitive;
  }

  function regularPasseSimple(infinitive) {
    if (infinitive.slice(-2) === 'er') {
      var s = infinitive.slice(0, -2);
      return [s + 'ai', s + 'as', s + 'a', s + 'âmes', s + 'âtes', s + 'èrent'];
    }
    var s2 = infinitive.slice(0, -2);
    return [s2 + 'is', s2 + 'is', s2 + 'it', s2 + 'îmes', s2 + 'îtes', s2 + 'irent'];
  }

  // ---- mechanical derivations, shared by regular and irregular verbs ----

  function mapRow(arr, fn) {
    return arr.map(function (x) { return x === null || x === undefined ? null : fn(x); });
  }

  function deriveImparfait(present) {
    var nous = present[3];
    if (!nous) return [null, null, null, null, null, null];
    var stem = nous.slice(0, -3); // strip "ons"
    var end = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
    return end.map(function (e) { return stem + e; });
  }

  function deriveFutureAndConditional(futureStem) {
    var futEnd = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
    var condEnd = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
    return {
      futur: futEnd.map(function (e) { return futureStem + e; }),
      conditionnelPresent: condEnd.map(function (e) { return futureStem + e; })
    };
  }

  function deriveSubjPresent(present) {
    var ils = present[5], nous = present[3];
    if (!ils || !nous) return [null, null, null, null, null, null];
    var ilsStem = ils.slice(0, -3); // strip "ent"
    var nousStem = nous.slice(0, -3); // strip "ons"
    return [ilsStem + 'e', ilsStem + 'es', ilsStem + 'e', nousStem + 'ions', nousStem + 'iez', ilsStem + 'ent'];
  }

  var CIRCUMFLEX = { a: 'â', i: 'î', u: 'û' };
  // Puts a circumflex on the last a/i/u in `base` — not necessarily its
  // last character (e.g. "vin" -> "vîn", for venir's "il vînt").
  function circumflexLastVowel(base) {
    for (var idx = base.length - 1; idx >= 0; idx--) {
      var ch = base.charAt(idx);
      if (CIRCUMFLEX[ch]) return base.slice(0, idx) + CIRCUMFLEX[ch] + base.slice(idx + 1);
    }
    return base;
  }
  function deriveSubjImparfait(passeSimple) {
    var tu = passeSimple[1];
    if (!tu) return [null, null, null, null, null, null];
    var base = tu.slice(0, -1); // drop trailing "s"
    var circumBase = circumflexLastVowel(base);
    return [base + 'sse', base + 'sses', circumBase + 't', base + 'ssions', base + 'ssiez', base + 'ssent'];
  }

  function deriveParticiplePresent(present) {
    var nous = present[3];
    if (!nous) return null;
    return nous.slice(0, -3) + 'ant';
  }

  function deriveImperative(present) {
    var tu = present[1], nous = present[3], vous = present[4];
    if (!tu) return [null, null, null];
    var tuForm = tu.slice(-2) === 'es' ? tu.slice(0, -1) : tu;
    return [tuForm, nous, vous];
  }

  function deriveParticipleForms(participle, override) {
    if (override) return override;
    var ms = participle;
    var mp = (/[sx]$/.test(ms)) ? ms : ms + 's';
    var fs = (/e$/.test(ms)) ? ms : ms + 'e';
    var fp = (/s$/.test(fs)) ? fs : fs + 's';
    return { ms: ms, mp: mp, fs: fs, fp: fp };
  }

  // ---- reflexive pronoun handling ----
  function reflexivePronoun(i, followingForm) {
    var vowel = followingForm && VOWEL_SOUND.test(followingForm);
    if (i === 0) return vowel ? "m'" : 'me ';
    if (i === 1) return vowel ? "t'" : 'te ';
    if (i === 3) return 'nous ';
    if (i === 4) return 'vous ';
    return vowel ? "s'" : 'se '; // il/elle, ils/elles
  }

  // ---- assemble one verb's complete conjugation ----
  function buildVerb(entry) {
    var present = entry.present;
    var participle = entry.participle;
    var participleForms = deriveParticipleForms(participle, entry.participleOverride);
    var futureStem = entry.futureStem || regularFutureStem(entry.infinitiveForDerivation || '');
    var imparfait = entry.imparfait || deriveImparfait(present);
    var fc = deriveFutureAndConditional(futureStem);
    var passeSimple = entry.passeSimple;
    var subjPresent = entry.subjPresent || deriveSubjPresent(present);
    var subjImparfait = deriveSubjImparfait(passeSimple);
    var participlePresent = entry.participlePresent || deriveParticiplePresent(present);
    var imperative = entry.imperative || deriveImperative(present);

    var aux = entry.aux === 'etre' ? ETRE_PARADIGM : AVOIR_PARADIGM;
    var auxParticiplePresent = aux.participlePresent;

    function compound(auxForms) {
      return mapRow(auxForms, function (f) { return f + ' ' + participle; });
    }

    var tenses = {
      indicatifPresent: present,
      indicatifImparfait: imparfait,
      indicatifFutur: fc.futur,
      indicatifPasseSimple: passeSimple,
      indicatifPasseCompose: compound(aux.present),
      indicatifPlusQueParfait: compound(aux.imparfait),
      indicatifPasseAnterieur: compound(aux.passeSimple),
      indicatifFuturAnterieur: compound(aux.futur),
      subjonctifPresent: subjPresent,
      subjonctifImparfait: subjImparfait,
      subjonctifPasse: compound(aux.subjPresent),
      subjonctifPlusQueParfait: compound(aux.subjImparfait),
      conditionnelPresent: fc.conditionnelPresent,
      conditionnelPasse1: compound(aux.conditionnelPresent),
      conditionnelPasse2: compound(aux.subjImparfait),
      imperatifPresent: imperative,
      imperatifPasse: imperative[0] === null ? [null, null, null] : mapRow(
        aux.imperative,
        function (f) { return f + ' ' + participle; }
      )
    };

    // Impersonal verbs (falloir, pleuvoir) only ever have an il/elle form —
    // the auxiliary's own full paradigm would otherwise leak nonsense
    // compound forms ("j'ai fallu") into every other row.
    if (entry.impersonal) {
      Object.keys(tenses).forEach(function (key) {
        var row = tenses[key];
        if (Array.isArray(row) && row.length === 6) {
          tenses[key] = [null, null, row[2], null, null, null];
        }
      });
    }

    return {
      infinitive: entry.i,
      meaning: entry.e,
      aux: entry.aux,
      reflexive: !!entry.reflexive,
      impersonal: !!entry.impersonal,
      participle: participle,
      participleForms: participleForms,
      tenses: tenses,
      participlePresent: participlePresent,
      participleComposePhrase: auxParticiplePresent + ' ' + participle,
      infinitifPresent: entry.i,
      infinitifPasse: (entry.aux === 'etre' ? 'être' : 'avoir') + ' ' + participle
    };
  }

  // Public entry point: takes raw user input, returns either
  // { error: 'empty' | 'not-found' } or a built verb result (see buildVerb).
  function conjugate(raw) {
    var trimmed = (raw || '').trim();
    if (!trimmed) return { error: 'empty' };

    // Two views of the input: `lookupKey` is accent-stripped (forgiving of
    // "etre" for "être") and used only to find a table entry, which then
    // supplies its own correctly-accented infinitive. `accented` keeps
    // whatever accents the user actually typed, and is what regular-verb
    // derivation runs on — otherwise a correctly-typed regular verb like
    // "préférer" would lose its accents before the spelling rules even ran.
    var lookupKey = normalize(trimmed);
    var accented = trimmed.toLowerCase().replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();

    var reflexive = false;
    if (lookupKey.slice(0, 3) === 'se ') {
      reflexive = true;
      lookupKey = lookupKey.slice(3).trim();
      accented = accented.slice(3).trim();
    } else if (lookupKey.slice(0, 2) === 's ') {
      reflexive = true;
      lookupKey = lookupKey.slice(2).trim();
      accented = accented.slice(2).trim();
    }

    var entry = TABLE[lookupKey];
    if (!entry) {
      var present = regularPresent(accented);
      if (!present) return { error: 'not-found' };
      entry = {
        i: accented,
        e: '',
        aux: 'avoir',
        present: present,
        infinitiveForDerivation: accented,
        passeSimple: regularPasseSimple(accented),
        participle: accented.slice(-2) === 'er' ? accented.slice(0, -2) + 'é' :
                    accented.slice(-2) === 'ir' ? accented.slice(0, -2) + 'i' :
                    accented.slice(0, -2) + 'u'
      };
      entry.isGuessed = true;
    } else {
      entry = Object.assign({ infinitiveForDerivation: entry.i }, entry);
    }

    if (reflexive) entry = Object.assign({}, entry, { reflexive: true, aux: 'etre' });

    var result = buildVerb(entry);
    result.isGuessed = !!entry.isGuessed;
    if (reflexive) result.infinitive = 'se ' + result.infinitive;
    return result;
  }

  return {
    normalize: normalize,
    reflexivePronoun: reflexivePronoun,
    VOWEL_SOUND: VOWEL_SOUND,
    conjugate: conjugate
  };
})();
