// Verb database for the full conjugator ("Conjugueur"). Two parts:
//
//  - AVOIR_PARADIGM / ETRE_PARADIGM: complete hand-verified conjugations of
//    the two auxiliaries, needed to build every compound tense (passé
//    composé, plus-que-parfait, etc.) of ANY verb.
//
//  - IRREGULAR_VERBS: a curated table of common irregular verbs. Each entry
//    only needs to give the forms that can't be predicted by rule — present
//    tense, past participle, passé simple, and (where the verb is truly
//    suppletive) a handful of overrides. Everything else — imparfait,
//    futur/conditionnel endings, subjonctif présent, participe présent,
//    impératif, all compound tenses — is derived mechanically by
//    js/engine.js from those few irregular forms, the same way it derives
//    them from scratch for a fully regular verb.
//
// Any infinitive not found here and ending in -er/-ir/-re is conjugated by
// engine.js's regular rules (including the -cer/-ger/-e_er/-é_er/-yer
// spelling-change families for -er verbs). Verbs ending in -oir not listed
// here have no reliable regular pattern and are reported as unrecognized.

// Each present/passeSimple/subjPresent array is [je, tu, il/elle, nous, vous, ils/elles].
// impersonal verbs (falloir, pleuvoir) only fill the il/elle slot (index 2) —
// every other slot stays null, and the engine skips null rows everywhere.

var AVOIR_PARADIGM = {
  present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
  imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
  futur: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
  passeSimple: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'],
  subjPresent: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
  subjImparfait: ['eusse', 'eusses', 'eût', 'eussions', 'eussiez', 'eussent'],
  conditionnelPresent: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'],
  imperative: ['aie', 'ayons', 'ayez'],
  participlePresent: 'ayant',
  participle: 'eu'
};

var ETRE_PARADIGM = {
  present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
  imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
  futur: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
  passeSimple: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'],
  subjPresent: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
  subjImparfait: ['fusse', 'fusses', 'fût', 'fussions', 'fussiez', 'fussent'],
  conditionnelPresent: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
  imperative: ['sois', 'soyons', 'soyez'],
  participlePresent: 'étant',
  participle: 'été',
  participleOverride: { ms: 'été', mp: 'été', fs: 'été', fp: 'été' } // always invariable
};

var IRREGULAR_VERBS = [
  { i: 'aller', e: 'to go', aux: 'etre',
    present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    futureStem: 'ir',
    passeSimple: ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'],
    subjPresent: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
    imperative: ['va', 'allons', 'allez'],
    participle: 'allé' },

  { i: 'apprendre', e: 'to learn', aux: 'avoir',
    present: ['apprends', 'apprends', 'apprend', 'apprenons', 'apprenez', 'apprennent'],
    passeSimple: ['appris', 'appris', 'apprit', 'apprîmes', 'apprîtes', 'apprirent'],
    participle: 'appris' },

  { i: 'avoir', e: 'to have', aux: 'avoir',
    present: AVOIR_PARADIGM.present,
    futureStem: 'aur',
    passeSimple: AVOIR_PARADIGM.passeSimple,
    subjPresent: AVOIR_PARADIGM.subjPresent,
    imperative: ['aie', 'ayons', 'ayez'],
    participlePresent: 'ayant',
    participle: 'eu' },

  { i: 'boire', e: 'to drink', aux: 'avoir',
    present: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    passeSimple: ['bus', 'bus', 'but', 'bûmes', 'bûtes', 'burent'],
    participle: 'bu' },

  { i: 'comprendre', e: 'to understand', aux: 'avoir',
    present: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'],
    passeSimple: ['compris', 'compris', 'comprit', 'comprîmes', 'comprîtes', 'comprirent'],
    participle: 'compris' },

  { i: 'conduire', e: 'to drive', aux: 'avoir',
    present: ['conduis', 'conduis', 'conduit', 'conduisons', 'conduisez', 'conduisent'],
    passeSimple: ['conduisis', 'conduisis', 'conduisit', 'conduisîmes', 'conduisîtes', 'conduisirent'],
    participle: 'conduit' },

  { i: 'connaître', e: 'to know', aux: 'avoir',
    present: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    passeSimple: ['connus', 'connus', 'connut', 'connûmes', 'connûtes', 'connurent'],
    participle: 'connu' },

  { i: 'construire', e: 'to build', aux: 'avoir',
    present: ['construis', 'construis', 'construit', 'construisons', 'construisez', 'construisent'],
    passeSimple: ['construisis', 'construisis', 'construisit', 'construisîmes', 'construisîtes', 'construisirent'],
    participle: 'construit' },

  { i: 'courir', e: 'to run', aux: 'avoir',
    present: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'],
    futureStem: 'courr',
    passeSimple: ['courus', 'courus', 'courut', 'courûmes', 'courûtes', 'coururent'],
    participle: 'couru' },

  { i: 'couvrir', e: 'to cover', aux: 'avoir',
    present: ['couvre', 'couvres', 'couvre', 'couvrons', 'couvrez', 'couvrent'],
    passeSimple: ['couvris', 'couvris', 'couvrit', 'couvrîmes', 'couvrîtes', 'couvrirent'],
    participle: 'couvert' },

  { i: 'craindre', e: 'to fear', aux: 'avoir',
    present: ['crains', 'crains', 'craint', 'craignons', 'craignez', 'craignent'],
    passeSimple: ['craignis', 'craignis', 'craignit', 'craignîmes', 'craignîtes', 'craignirent'],
    participle: 'craint' },

  { i: 'croire', e: 'to believe', aux: 'avoir',
    present: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'],
    passeSimple: ['crus', 'crus', 'crut', 'crûmes', 'crûtes', 'crurent'],
    participle: 'cru' },

  { i: 'cueillir', e: 'to pick / to gather', aux: 'avoir',
    present: ['cueille', 'cueilles', 'cueille', 'cueillons', 'cueillez', 'cueillent'],
    futureStem: 'cueiller',
    passeSimple: ['cueillis', 'cueillis', 'cueillit', 'cueillîmes', 'cueillîtes', 'cueillirent'],
    participle: 'cueilli' },

  { i: 'découvrir', e: 'to discover', aux: 'avoir',
    present: ['découvre', 'découvres', 'découvre', 'découvrons', 'découvrez', 'découvrent'],
    passeSimple: ['découvris', 'découvris', 'découvrit', 'découvrîmes', 'découvrîtes', 'découvrirent'],
    participle: 'découvert' },

  { i: 'devenir', e: 'to become', aux: 'etre',
    present: ['deviens', 'deviens', 'devient', 'devenons', 'devenez', 'deviennent'],
    futureStem: 'deviendr',
    passeSimple: ['devins', 'devins', 'devint', 'devînmes', 'devîntes', 'devinrent'],
    participle: 'devenu' },

  { i: 'devoir', e: 'to have to / must', aux: 'avoir',
    present: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    futureStem: 'devr',
    passeSimple: ['dus', 'dus', 'dut', 'dûmes', 'dûtes', 'durent'],
    participle: 'dû',
    participleOverride: { ms: 'dû', mp: 'dus', fs: 'due', fp: 'dues' } },

  { i: 'dire', e: 'to say', aux: 'avoir',
    present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    passeSimple: ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent'],
    participle: 'dit' },

  { i: 'disparaître', e: 'to disappear', aux: 'avoir',
    present: ['disparais', 'disparais', 'disparaît', 'disparaissons', 'disparaissez', 'disparaissent'],
    passeSimple: ['disparus', 'disparus', 'disparut', 'disparûmes', 'disparûtes', 'disparurent'],
    participle: 'disparu' },

  { i: 'dormir', e: 'to sleep', aux: 'avoir',
    present: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    passeSimple: ['dormis', 'dormis', 'dormit', 'dormîmes', 'dormîtes', 'dormirent'],
    participle: 'dormi' },

  { i: 'écrire', e: 'to write', aux: 'avoir',
    present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    passeSimple: ['écrivis', 'écrivis', 'écrivit', 'écrivîmes', 'écrivîtes', 'écrivirent'],
    participle: 'écrit' },

  { i: 'envoyer', e: 'to send', aux: 'avoir',
    present: ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient'],
    futureStem: 'enverr',
    passeSimple: ['envoyai', 'envoyas', 'envoya', 'envoyâmes', 'envoyâtes', 'envoyèrent'],
    participle: 'envoyé' },

  { i: 'être', e: 'to be', aux: 'avoir',
    present: ETRE_PARADIGM.present,
    imparfait: ETRE_PARADIGM.imparfait,
    futureStem: 'ser',
    passeSimple: ETRE_PARADIGM.passeSimple,
    subjPresent: ETRE_PARADIGM.subjPresent,
    imperative: ['sois', 'soyons', 'soyez'],
    participlePresent: 'étant',
    participle: 'été',
    participleOverride: { ms: 'été', mp: 'été', fs: 'été', fp: 'été' } },

  { i: 'faire', e: 'to do / to make', aux: 'avoir',
    present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    futureStem: 'fer',
    passeSimple: ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'],
    subjPresent: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
    participle: 'fait' },

  { i: 'falloir', e: 'to be necessary', aux: 'avoir', impersonal: true,
    present: [null, null, 'faut', null, null, null],
    imparfait: [null, null, 'fallait', null, null, null],
    futureStem: 'faudr',
    passeSimple: [null, null, 'fallut', null, null, null],
    subjPresent: [null, null, 'faille', null, null, null],
    participle: 'fallu' },

  { i: 'fuir', e: 'to flee', aux: 'avoir',
    present: ['fuis', 'fuis', 'fuit', 'fuyons', 'fuyez', 'fuient'],
    passeSimple: ['fuis', 'fuis', 'fuit', 'fuîmes', 'fuîtes', 'fuirent'],
    participle: 'fui' },

  { i: 'haïr', e: 'to hate', aux: 'avoir',
    present: ['hais', 'hais', 'hait', 'haïssons', 'haïssez', 'haïssent'],
    passeSimple: ['haïs', 'haïs', 'haït', 'haïmes', 'haïtes', 'haïrent'],
    participle: 'haï' },

  { i: 'joindre', e: 'to join', aux: 'avoir',
    present: ['joins', 'joins', 'joint', 'joignons', 'joignez', 'joignent'],
    passeSimple: ['joignis', 'joignis', 'joignit', 'joignîmes', 'joignîtes', 'joignirent'],
    participle: 'joint' },

  { i: 'lire', e: 'to read', aux: 'avoir',
    present: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    passeSimple: ['lus', 'lus', 'lut', 'lûmes', 'lûtes', 'lurent'],
    participle: 'lu' },

  { i: 'mentir', e: 'to lie', aux: 'avoir',
    present: ['mens', 'mens', 'ment', 'mentons', 'mentez', 'mentent'],
    passeSimple: ['mentis', 'mentis', 'mentit', 'mentîmes', 'mentîtes', 'mentirent'],
    participle: 'menti' },

  { i: 'mettre', e: 'to put', aux: 'avoir',
    present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    passeSimple: ['mis', 'mis', 'mit', 'mîmes', 'mîtes', 'mirent'],
    participle: 'mis' },

  { i: 'mourir', e: 'to die', aux: 'etre',
    present: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'],
    futureStem: 'mourr',
    passeSimple: ['mourus', 'mourus', 'mourut', 'mourûmes', 'mourûtes', 'moururent'],
    participle: 'mort' },

  { i: 'naître', e: 'to be born', aux: 'etre',
    present: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'],
    passeSimple: ['naquis', 'naquis', 'naquit', 'naquîmes', 'naquîtes', 'naquirent'],
    participle: 'né' },

  { i: 'obtenir', e: 'to obtain', aux: 'avoir',
    present: ['obtiens', 'obtiens', 'obtient', 'obtenons', 'obtenez', 'obtiennent'],
    futureStem: 'obtiendr',
    passeSimple: ['obtins', 'obtins', 'obtint', 'obtînmes', 'obtîntes', 'obtinrent'],
    participle: 'obtenu' },

  { i: 'offrir', e: 'to offer', aux: 'avoir',
    present: ['offre', 'offres', 'offre', 'offrons', 'offrez', 'offrent'],
    passeSimple: ['offris', 'offris', 'offrit', 'offrîmes', 'offrîtes', 'offrirent'],
    participle: 'offert' },

  { i: 'paraître', e: 'to seem / to appear', aux: 'avoir',
    present: ['parais', 'parais', 'paraît', 'paraissons', 'paraissez', 'paraissent'],
    passeSimple: ['parus', 'parus', 'parut', 'parûmes', 'parûtes', 'parurent'],
    participle: 'paru' },

  { i: 'partir', e: 'to leave', aux: 'etre',
    present: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    passeSimple: ['partis', 'partis', 'partit', 'partîmes', 'partîtes', 'partirent'],
    participle: 'parti' },

  { i: 'peindre', e: 'to paint', aux: 'avoir',
    present: ['peins', 'peins', 'peint', 'peignons', 'peignez', 'peignent'],
    passeSimple: ['peignis', 'peignis', 'peignit', 'peignîmes', 'peignîtes', 'peignirent'],
    participle: 'peint' },

  { i: 'permettre', e: 'to allow', aux: 'avoir',
    present: ['permets', 'permets', 'permet', 'permettons', 'permettez', 'permettent'],
    passeSimple: ['permis', 'permis', 'permit', 'permîmes', 'permîtes', 'permirent'],
    participle: 'permis' },

  { i: 'plaire', e: 'to please', aux: 'avoir',
    present: ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent'],
    passeSimple: ['plus', 'plus', 'plut', 'plûmes', 'plûtes', 'plurent'],
    participle: 'plu',
    participleOverride: { ms: 'plu', mp: 'plu', fs: 'plu', fp: 'plu' } },

  { i: 'pleuvoir', e: 'to rain', aux: 'avoir', impersonal: true,
    present: [null, null, 'pleut', null, null, null],
    imparfait: [null, null, 'pleuvait', null, null, null],
    futureStem: 'pleuvr',
    passeSimple: [null, null, 'plut', null, null, null],
    subjPresent: [null, null, 'pleuve', null, null, null],
    participle: 'plu' },

  { i: 'pouvoir', e: 'to be able to', aux: 'avoir',
    present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    futureStem: 'pourr',
    passeSimple: ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent'],
    subjPresent: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
    imperative: [null, null, null], // no imperative in practice
    participle: 'pu' },

  { i: 'prendre', e: 'to take', aux: 'avoir',
    present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    passeSimple: ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent'],
    participle: 'pris' },

  { i: 'promettre', e: 'to promise', aux: 'avoir',
    present: ['promets', 'promets', 'promet', 'promettons', 'promettez', 'promettent'],
    passeSimple: ['promis', 'promis', 'promit', 'promîmes', 'promîtes', 'promirent'],
    participle: 'promis' },

  { i: 'recevoir', e: 'to receive', aux: 'avoir',
    present: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'],
    futureStem: 'recevr',
    passeSimple: ['reçus', 'reçus', 'reçut', 'reçûmes', 'reçûtes', 'reçurent'],
    participle: 'reçu' },

  { i: 'reconnaître', e: 'to recognize', aux: 'avoir',
    present: ['reconnais', 'reconnais', 'reconnaît', 'reconnaissons', 'reconnaissez', 'reconnaissent'],
    passeSimple: ['reconnus', 'reconnus', 'reconnut', 'reconnûmes', 'reconnûtes', 'reconnurent'],
    participle: 'reconnu' },

  { i: 'relire', e: 'to reread', aux: 'avoir',
    present: ['relis', 'relis', 'relit', 'relisons', 'relisez', 'relisent'],
    passeSimple: ['relus', 'relus', 'relut', 'relûmes', 'relûtes', 'relurent'],
    participle: 'relu' },

  { i: 'remettre', e: 'to put back / to postpone', aux: 'avoir',
    present: ['remets', 'remets', 'remet', 'remettons', 'remettez', 'remettent'],
    passeSimple: ['remis', 'remis', 'remit', 'remîmes', 'remîtes', 'remirent'],
    participle: 'remis' },

  { i: 'retenir', e: 'to retain / to hold back', aux: 'avoir',
    present: ['retiens', 'retiens', 'retient', 'retenons', 'retenez', 'retiennent'],
    futureStem: 'retiendr',
    passeSimple: ['retins', 'retins', 'retint', 'retînmes', 'retîntes', 'retinrent'],
    participle: 'retenu' },

  { i: 'revenir', e: 'to come back', aux: 'etre',
    present: ['reviens', 'reviens', 'revient', 'revenons', 'revenez', 'reviennent'],
    futureStem: 'reviendr',
    passeSimple: ['revins', 'revins', 'revint', 'revînmes', 'revîntes', 'revinrent'],
    participle: 'revenu' },

  { i: 'revoir', e: 'to see again', aux: 'avoir',
    present: ['revois', 'revois', 'revoit', 'revoyons', 'revoyez', 'revoient'],
    futureStem: 'reverr',
    passeSimple: ['revis', 'revis', 'revit', 'revîmes', 'revîtes', 'revirent'],
    participle: 'revu' },

  { i: 'rire', e: 'to laugh', aux: 'avoir',
    present: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'],
    passeSimple: ['ris', 'ris', 'rit', 'rîmes', 'rîtes', 'rirent'],
    participle: 'ri' },

  { i: 'résoudre', e: 'to solve', aux: 'avoir',
    present: ['résous', 'résous', 'résout', 'résolvons', 'résolvez', 'résolvent'],
    passeSimple: ['résolus', 'résolus', 'résolut', 'résolûmes', 'résolûtes', 'résolurent'],
    participle: 'résolu' },

  { i: 'savoir', e: 'to know', aux: 'avoir',
    present: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    futureStem: 'saur',
    passeSimple: ['sus', 'sus', 'sut', 'sûmes', 'sûtes', 'surent'],
    subjPresent: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
    imperative: ['sache', 'sachons', 'sachez'],
    participlePresent: 'sachant',
    participle: 'su' },

  { i: 'sentir', e: 'to feel / to smell', aux: 'avoir',
    present: ['sens', 'sens', 'sent', 'sentons', 'sentez', 'sentent'],
    passeSimple: ['sentis', 'sentis', 'sentit', 'sentîmes', 'sentîtes', 'sentirent'],
    participle: 'senti' },

  { i: 'servir', e: 'to serve', aux: 'avoir',
    present: ['sers', 'sers', 'sert', 'servons', 'servez', 'servent'],
    passeSimple: ['servis', 'servis', 'servit', 'servîmes', 'servîtes', 'servirent'],
    participle: 'servi' },

  { i: 'sortir', e: 'to go out', aux: 'etre',
    present: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'],
    passeSimple: ['sortis', 'sortis', 'sortit', 'sortîmes', 'sortîtes', 'sortirent'],
    participle: 'sorti' },

  { i: 'souffrir', e: 'to suffer', aux: 'avoir',
    present: ['souffre', 'souffres', 'souffre', 'souffrons', 'souffrez', 'souffrent'],
    passeSimple: ['souffris', 'souffris', 'souffrit', 'souffrîmes', 'souffrîtes', 'souffrirent'],
    participle: 'souffert' },

  { i: 'suivre', e: 'to follow', aux: 'avoir',
    present: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'],
    passeSimple: ['suivis', 'suivis', 'suivit', 'suivîmes', 'suivîtes', 'suivirent'],
    participle: 'suivi' },

  { i: 'surprendre', e: 'to surprise', aux: 'avoir',
    present: ['surprends', 'surprends', 'surprend', 'surprenons', 'surprenez', 'surprennent'],
    passeSimple: ['surpris', 'surpris', 'surprit', 'surprîmes', 'surprîtes', 'surprirent'],
    participle: 'surpris' },

  { i: 'tenir', e: 'to hold', aux: 'avoir',
    present: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'],
    futureStem: 'tiendr',
    passeSimple: ['tins', 'tins', 'tint', 'tînmes', 'tîntes', 'tinrent'],
    participle: 'tenu' },

  { i: 'traduire', e: 'to translate', aux: 'avoir',
    present: ['traduis', 'traduis', 'traduit', 'traduisons', 'traduisez', 'traduisent'],
    passeSimple: ['traduisis', 'traduisis', 'traduisit', 'traduisîmes', 'traduisîtes', 'traduisirent'],
    participle: 'traduit' },

  { i: 'vaincre', e: 'to defeat', aux: 'avoir',
    present: ['vaincs', 'vaincs', 'vainc', 'vainquons', 'vainquez', 'vainquent'],
    passeSimple: ['vainquis', 'vainquis', 'vainquit', 'vainquîmes', 'vainquîtes', 'vainquirent'],
    participle: 'vaincu' },

  { i: 'valoir', e: 'to be worth', aux: 'avoir',
    present: ['vaux', 'vaux', 'vaut', 'valons', 'valez', 'valent'],
    futureStem: 'vaudr',
    passeSimple: ['valus', 'valus', 'valut', 'valûmes', 'valûtes', 'valurent'],
    subjPresent: ['vaille', 'vailles', 'vaille', 'valions', 'valiez', 'vaillent'],
    participle: 'valu' },

  { i: 'venir', e: 'to come', aux: 'etre',
    present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    futureStem: 'viendr',
    passeSimple: ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent'],
    participle: 'venu' },

  { i: 'vivre', e: 'to live', aux: 'avoir',
    present: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'],
    passeSimple: ['vécus', 'vécus', 'vécut', 'vécûmes', 'vécûtes', 'vécurent'],
    participle: 'vécu' },

  { i: 'voir', e: 'to see', aux: 'avoir',
    present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    futureStem: 'verr',
    passeSimple: ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent'],
    participle: 'vu' },

  { i: 'vouloir', e: 'to want', aux: 'avoir',
    present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    futureStem: 'voudr',
    passeSimple: ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent'],
    subjPresent: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
    imperative: ['veuille', 'veuillons', 'veuillez'],
    participle: 'voulu' },

  // Doubling-consonant -eler/-eter exceptions (the default regular -e_er
  // rule accents instead of doubles — see engine.js — so these two common
  // ones need an explicit override).
  { i: 'appeler', e: 'to call', aux: 'avoir',
    present: ['appelle', 'appelles', 'appelle', 'appelons', 'appelez', 'appellent'],
    passeSimple: ['appelai', 'appelas', 'appela', 'appelâmes', 'appelâtes', 'appelèrent'],
    participle: 'appelé' },

  { i: 'jeter', e: 'to throw', aux: 'avoir',
    present: ['jette', 'jettes', 'jette', 'jetons', 'jetez', 'jettent'],
    passeSimple: ['jetai', 'jetas', 'jeta', 'jetâmes', 'jetâtes', 'jetèrent'],
    participle: 'jeté' }
];
