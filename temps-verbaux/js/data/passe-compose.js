// Passé composé verb index — sourced from the course's Passé Composé grammar
// notes (auxiliary rules, regular participle endings, DR MRS VANDERTRAMP,
// reflexive verbs, irregular participles).
//
// Each entry: { i: infinitive, e: English meaning, p: past participle,
//               aux: 'avoir' | 'etre', g: group code, reflexive?: true, impersonal?: true }
// Groups: ER / IR / RE (regular, avoir) · ETRE (DR MRS VANDERTRAMP) ·
//         REFL (reflexive, always être) · IRR (irregular participle, avoir).
var PASSE_COMPOSE_VERBS = [
  // -- Regular -ER (participle -é), avoir --
  { i: 'aimer', e: 'to like / to love', p: 'aimé', aux: 'avoir', g: 'ER' },
  { i: 'danser', e: 'to dance', p: 'dansé', aux: 'avoir', g: 'ER' },
  { i: 'demander', e: 'to ask', p: 'demandé', aux: 'avoir', g: 'ER' },
  { i: 'commencer', e: 'to begin / to start', p: 'commencé', aux: 'avoir', g: 'ER' },
  { i: 'écouter', e: 'to listen', p: 'écouté', aux: 'avoir', g: 'ER' },
  { i: 'manger', e: 'to eat', p: 'mangé', aux: 'avoir', g: 'ER' },
  { i: 'dessiner', e: 'to draw', p: 'dessiné', aux: 'avoir', g: 'ER' },

  // -- Regular -IR (participle -i), avoir --
  { i: 'choisir', e: 'to choose', p: 'choisi', aux: 'avoir', g: 'IR' },
  { i: 'rougir', e: 'to blush', p: 'rougi', aux: 'avoir', g: 'IR' },
  { i: 'vieillir', e: 'to get old', p: 'vieilli', aux: 'avoir', g: 'IR' },
  { i: 'dormir', e: 'to sleep', p: 'dormi', aux: 'avoir', g: 'IR' },
  { i: 'servir', e: 'to serve', p: 'servi', aux: 'avoir', g: 'IR' },
  { i: 'mentir', e: 'to lie', p: 'menti', aux: 'avoir', g: 'IR' },
  { i: 'contenir', e: 'to contain', p: 'contenu', aux: 'avoir', g: 'IR' },

  // -- Regular -RE (participle -u), avoir --
  { i: 'perdre', e: 'to lose', p: 'perdu', aux: 'avoir', g: 'RE' },
  { i: 'attendre', e: 'to wait', p: 'attendu', aux: 'avoir', g: 'RE' },
  { i: 'vendre', e: 'to sell', p: 'vendu', aux: 'avoir', g: 'RE' },
  { i: 'rendre', e: 'to give back', p: 'rendu', aux: 'avoir', g: 'RE' },
  { i: 'répondre', e: 'to answer', p: 'répondu', aux: 'avoir', g: 'RE' },
  { i: 'entendre', e: 'to hear', p: 'entendu', aux: 'avoir', g: 'RE' },
  { i: 'défendre', e: 'to defend', p: 'défendu', aux: 'avoir', g: 'RE' },
  { i: 'mordre', e: 'to bite', p: 'mordu', aux: 'avoir', g: 'RE' },

  // -- ÊTRE verbs: DR MRS VANDERTRAMP --
  { i: 'devenir', e: 'to become', p: 'devenu', aux: 'etre', g: 'ETRE' },
  { i: 'revenir', e: 'to come back', p: 'revenu', aux: 'etre', g: 'ETRE' },
  { i: 'monter', e: 'to go up', p: 'monté', aux: 'etre', g: 'ETRE' },
  { i: 'rester', e: 'to stay', p: 'resté', aux: 'etre', g: 'ETRE' },
  { i: 'sortir', e: 'to go out', p: 'sorti', aux: 'etre', g: 'ETRE' },
  { i: 'venir', e: 'to come', p: 'venu', aux: 'etre', g: 'ETRE' },
  { i: 'aller', e: 'to go', p: 'allé', aux: 'etre', g: 'ETRE' },
  { i: 'naître', e: 'to be born', p: 'né', aux: 'etre', g: 'ETRE' },
  { i: 'descendre', e: 'to go down', p: 'descendu', aux: 'etre', g: 'ETRE' },
  { i: 'entrer', e: 'to enter', p: 'entré', aux: 'etre', g: 'ETRE' },
  { i: 'rentrer', e: 'to re-enter', p: 'rentré', aux: 'etre', g: 'ETRE' },
  { i: 'tomber', e: 'to fall', p: 'tombé', aux: 'etre', g: 'ETRE' },
  { i: 'retourner', e: 'to return', p: 'retourné', aux: 'etre', g: 'ETRE' },
  { i: 'arriver', e: 'to arrive', p: 'arrivé', aux: 'etre', g: 'ETRE' },
  { i: 'mourir', e: 'to die', p: 'mort', aux: 'etre', g: 'ETRE' },
  { i: 'partir', e: 'to leave', p: 'parti', aux: 'etre', g: 'ETRE' },

  // -- Reflexive verbs (always être) --
  { i: 'se baigner', e: 'to bathe / to swim', p: 'baigné', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se brosser', e: 'to brush', p: 'brossé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se marier', e: 'to get married', p: 'marié', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se reposer', e: 'to rest', p: 'reposé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se réveiller', e: 'to wake up', p: 'réveillé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se noyer', e: 'to drown', p: 'noyé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se lever', e: 'to get up', p: 'levé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se laver', e: 'to wash (oneself)', p: 'lavé', aux: 'etre', g: 'REFL', reflexive: true },
  { i: 'se fâcher', e: 'to get angry', p: 'fâché', aux: 'etre', g: 'REFL', reflexive: true },

  // -- Irregular past participles (avoir) --
  { i: 'apprendre', e: 'to learn', p: 'appris', aux: 'avoir', g: 'IRR' },
  { i: 'avoir', e: 'to have / had', p: 'eu', aux: 'avoir', g: 'IRR' },
  { i: 'boire', e: 'to drink', p: 'bu', aux: 'avoir', g: 'IRR' },
  { i: 'comprendre', e: 'to understand', p: 'compris', aux: 'avoir', g: 'IRR' },
  { i: 'conduire', e: 'to drive', p: 'conduit', aux: 'avoir', g: 'IRR' },
  { i: 'connaître', e: 'to know', p: 'connu', aux: 'avoir', g: 'IRR' },
  { i: 'construire', e: 'to build', p: 'construit', aux: 'avoir', g: 'IRR' },
  { i: 'courir', e: 'to run', p: 'couru', aux: 'avoir', g: 'IRR' },
  { i: 'couvrir', e: 'to cover', p: 'couvert', aux: 'avoir', g: 'IRR' },
  { i: 'croire', e: 'to believe', p: 'cru', aux: 'avoir', g: 'IRR' },
  { i: 'cuire', e: 'to cook', p: 'cuit', aux: 'avoir', g: 'IRR' },
  { i: 'décrire', e: 'to describe', p: 'décrit', aux: 'avoir', g: 'IRR' },
  { i: 'découvrir', e: 'to discover', p: 'découvert', aux: 'avoir', g: 'IRR' },
  { i: 'dire', e: 'to say', p: 'dit', aux: 'avoir', g: 'IRR' },
  { i: 'écrire', e: 'to write', p: 'écrit', aux: 'avoir', g: 'IRR' },
  { i: 'être', e: 'to be / was', p: 'été', aux: 'avoir', g: 'IRR' },
  { i: 'lire', e: 'to read', p: 'lu', aux: 'avoir', g: 'IRR' },
  { i: 'mettre', e: 'to put', p: 'mis', aux: 'avoir', g: 'IRR' },
  { i: 'obtenir', e: 'to obtain', p: 'obtenu', aux: 'avoir', g: 'IRR' },
  { i: 'offrir', e: 'to offer', p: 'offert', aux: 'avoir', g: 'IRR' },
  { i: 'ouvrir', e: 'to open', p: 'ouvert', aux: 'avoir', g: 'IRR' },
  { i: 'pleuvoir', e: 'to rain', p: 'plu', aux: 'avoir', g: 'IRR', impersonal: true },
  { i: 'prendre', e: 'to take', p: 'pris', aux: 'avoir', g: 'IRR' },
  { i: 'recevoir', e: 'to receive', p: 'reçu', aux: 'avoir', g: 'IRR' },
  { i: 'rire', e: 'to laugh', p: 'ri', aux: 'avoir', g: 'IRR' },
  { i: 'savoir', e: 'to know', p: 'su', aux: 'avoir', g: 'IRR' },
  { i: 'souffrir', e: 'to suffer', p: 'souffert', aux: 'avoir', g: 'IRR' },
  { i: 'suivre', e: 'to follow', p: 'suivi', aux: 'avoir', g: 'IRR' },
  { i: 'tenir', e: 'to hold', p: 'tenu', aux: 'avoir', g: 'IRR' },
  { i: 'traduire', e: 'to translate', p: 'traduit', aux: 'avoir', g: 'IRR' },
  { i: 'vivre', e: 'to live / lived', p: 'vécu', aux: 'avoir', g: 'IRR' },
  { i: 'vouloir', e: 'to want', p: 'voulu', aux: 'avoir', g: 'IRR' },
  { i: 'voir', e: 'to see', p: 'vu', aux: 'avoir', g: 'IRR' }
];
