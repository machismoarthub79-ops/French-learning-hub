  // Module 15 — pronominal (reflexive) verbs. Same entry shape as VERBS
  // (i, g, e, r, c = [je,tu,il,nous,vous,ils]) plus `type`, one of
  // 'reflexive' | 'reciprocal' | 'idiomatic' — the three kinds the
  // curriculum calls out. `c` holds the bare conjugated forms; the
  // reflexive pronoun (me/te/se/nous/vous, eliding to m'/t'/s' before a
  // vowel sound) is added at render time in app.js, same way "je" -> "j'"
  // is handled for the main VERBS list.
  //
  // A first pass of 20 common verbs — the curriculum mentions a 50-verb
  // reference list in the source notes that isn't available in this repo;
  // expanding to the full list is a natural follow-up once that's transcribed.
  var PRONOMINAL_VERBS = [
    {i:"se laver",g:"PRONOM",type:"reflexive",e:"to wash (oneself)",r:1,c:["lave","laves","lave","lavons","lavez","lavent"]},
    {i:"se lever",g:"PRONOM",type:"reflexive",e:"to get up",r:0,c:["lève","lèves","lève","levons","levez","lèvent"]},
    {i:"se coucher",g:"PRONOM",type:"reflexive",e:"to go to bed",r:1,c:["couche","couches","couche","couchons","couchez","couchent"]},
    {i:"s'habiller",g:"PRONOM",type:"reflexive",e:"to get dressed",r:1,c:["habille","habilles","habille","habillons","habillez","habillent"]},
    {i:"se réveiller",g:"PRONOM",type:"reflexive",e:"to wake up",r:1,c:["réveille","réveilles","réveille","réveillons","réveillez","réveillent"]},
    {i:"se raser",g:"PRONOM",type:"reflexive",e:"to shave",r:1,c:["rase","rases","rase","rasons","rasez","rasent"]},
    {i:"se doucher",g:"PRONOM",type:"reflexive",e:"to shower",r:1,c:["douche","douches","douche","douchons","douchez","douchent"]},
    {i:"se maquiller",g:"PRONOM",type:"reflexive",e:"to put on makeup",r:1,c:["maquille","maquilles","maquille","maquillons","maquillez","maquillent"]},
    {i:"se regarder",g:"PRONOM",type:"reciprocal",e:"to look at each other",r:1,c:["regarde","regardes","regarde","regardons","regardez","regardent"]},
    {i:"se parler",g:"PRONOM",type:"reciprocal",e:"to talk to each other",r:1,c:["parle","parles","parle","parlons","parlez","parlent"]},
    {i:"s'aimer",g:"PRONOM",type:"reciprocal",e:"to love each other",r:1,c:["aime","aimes","aime","aimons","aimez","aiment"]},
    {i:"se rencontrer",g:"PRONOM",type:"reciprocal",e:"to meet (each other)",r:1,c:["rencontre","rencontres","rencontre","rencontrons","rencontrez","rencontrent"]},
    {i:"se disputer",g:"PRONOM",type:"reciprocal",e:"to argue (with each other)",r:1,c:["dispute","disputes","dispute","disputons","disputez","disputent"]},
    {i:"s'appeler",g:"PRONOM",type:"idiomatic",e:"to be called / named",r:0,c:["appelle","appelles","appelle","appelons","appelez","appellent"]},
    {i:"se souvenir de",g:"PRONOM",type:"idiomatic",e:"to remember",r:0,c:["souviens","souviens","souvient","souvenons","souvenez","souviennent"]},
    {i:"s'intéresser à",g:"PRONOM",type:"idiomatic",e:"to be interested in",r:1,c:["intéresse","intéresses","intéresse","intéressons","intéressez","intéressent"]},
    {i:"se dépêcher",g:"PRONOM",type:"idiomatic",e:"to hurry",r:1,c:["dépêche","dépêches","dépêche","dépêchons","dépêchez","dépêchent"]},
    {i:"s'ennuyer",g:"PRONOM",type:"idiomatic",e:"to be bored",r:0,c:["ennuie","ennuies","ennuie","ennuyons","ennuyez","ennuient"]},
    {i:"se demander",g:"PRONOM",type:"idiomatic",e:"to wonder",r:1,c:["demande","demandes","demande","demandons","demandez","demandent"]},
    {i:"se moquer de",g:"PRONOM",type:"idiomatic",e:"to make fun of",r:1,c:["moque","moques","moque","moquons","moquez","moquent"]}
  ];

  // Nine hand-written example sentences per verb (one per pronoun row: je,
  // tu, il, elle, on, nous, vous, ils, elles), merged into the shared
  // SENTENCES map from js/data/sentences.js so the existing lookup
  // (SENTENCES[v.i]) works unchanged for pronominal cards too.
  Object.assign(SENTENCES, {
    "se laver": [
      ["Je me lave avant de partir.", "I wash up before leaving."],
      ["Tu te laves les mains avant de manger.", "You wash your hands before eating."],
      ["Il se lave rapidement le matin.", "He washes up quickly in the morning."],
      ["Elle se lave les cheveux tous les jours.", "She washes her hair every day."],
      ["On se lave après le sport.", "We wash up after sports."],
      ["Nous nous lavons ensemble le matin.", "We wash up together in the morning."],
      ["Vous vous lavez avant le dîner.", "You wash up before dinner."],
      ["Ils se lavent après le match.", "They wash up after the game."],
      ["Elles se lavent avant de sortir.", "They wash up before going out."]
    ],
    "se lever": [
      ["Je me lève tôt tous les matins.", "I get up early every morning."],
      ["Tu te lèves toujours en retard.", "You always get up late."],
      ["Il se lève à six heures.", "He gets up at six o'clock."],
      ["Elle se lève avant le soleil.", "She gets up before sunrise."],
      ["On se lève ensemble le week-end.", "We get up together on weekends."],
      ["Nous nous levons pour partir au travail.", "We get up to leave for work."],
      ["Vous vous levez déjà ?", "Are you getting up already?"],
      ["Ils se lèvent en même temps chaque jour.", "They get up at the same time every day."],
      ["Elles se lèvent tard le dimanche.", "They get up late on Sundays."]
    ],
    "se coucher": [
      ["Je me couche avant minuit.", "I go to bed before midnight."],
      ["Tu te couches trop tard.", "You go to bed too late."],
      ["Il se couche juste après le dîner.", "He goes to bed right after dinner."],
      ["Elle se couche avec un livre.", "She goes to bed with a book."],
      ["On se couche tôt ce soir.", "We're going to bed early tonight."],
      ["Nous nous couchons vers onze heures.", "We go to bed around eleven."],
      ["Vous vous couchez déjà ?", "Are you going to bed already?"],
      ["Ils se couchent après le film.", "They go to bed after the movie."],
      ["Elles se couchent tôt avant l'examen.", "They go to bed early before the exam."]
    ],
    "s'habiller": [
      ["Je m'habille avant de prendre le petit-déjeuner.", "I get dressed before having breakfast."],
      ["Tu t'habilles très vite le matin.", "You get dressed really fast in the morning."],
      ["Il s'habille chaudement en hiver.", "He dresses warmly in winter."],
      ["Elle s'habille avec élégance pour la fête.", "She dresses elegantly for the party."],
      ["On s'habille bien pour l'entretien.", "We dress well for the interview."],
      ["Nous nous habillons pendant que le café chauffe.", "We get dressed while the coffee heats up."],
      ["Vous vous habillez pour sortir ce soir ?", "Are you getting dressed to go out tonight?"],
      ["Ils s'habillent en costume pour le mariage.", "They dress in suits for the wedding."],
      ["Elles s'habillent pareil aujourd'hui.", "They're dressed the same today."]
    ],
    "se réveiller": [
      ["Je me réveille avec le bruit de la rue.", "I wake up to the noise of the street."],
      ["Tu te réveilles toujours de bonne humeur.", "You always wake up in a good mood."],
      ["Il se réveille en sursaut.", "He wakes up with a start."],
      ["Elle se réveille doucement chaque matin.", "She wakes up gently every morning."],
      ["On se réveille tôt pour le vol.", "We wake up early for the flight."],
      ["Nous nous réveillons avant le réveil.", "We wake up before the alarm."],
      ["Vous vous réveillez plus tôt que d'habitude.", "You wake up earlier than usual."],
      ["Ils se réveillent au chant des oiseaux.", "They wake up to birdsong."],
      ["Elles se réveillent en même temps.", "They wake up at the same time."]
    ],
    "se raser": [
      ["Je me rase tous les matins.", "I shave every morning."],
      ["Tu te rases avant le travail.", "You shave before work."],
      ["Il se rase la barbe pour l'été.", "He shaves his beard for summer."],
      ["Elle se rase les jambes avant la plage.", "She shaves her legs before the beach."],
      ["On se rase vite avant de partir.", "We shave quickly before leaving."],
      ["Nous nous rasons chacun notre tour.", "We each take turns shaving."],
      ["Vous vous rasez tous les deux jours.", "You shave every other day."],
      ["Ils se rasent avant l'entretien.", "They shave before the interview."],
      ["Elles se rasent rarement les bras.", "They rarely shave their arms."]
    ],
    "se doucher": [
      ["Je me douche après le sport.", "I shower after sports."],
      ["Tu te douches avant de dormir.", "You shower before sleeping."],
      ["Il se douche à l'eau froide.", "He showers with cold water."],
      ["Elle se douche en dix minutes.", "She showers in ten minutes."],
      ["On se douche vite ce matin.", "We shower quickly this morning."],
      ["Nous nous douchons après la randonnée.", "We shower after the hike."],
      ["Vous vous douchez avant ou après le petit-déjeuner ?", "Do you shower before or after breakfast?"],
      ["Ils se douchent l'un après l'autre.", "They shower one after the other."],
      ["Elles se douchent après l'entraînement.", "They shower after practice."]
    ],
    "se maquiller": [
      ["Je me maquille légèrement pour le travail.", "I put on light makeup for work."],
      ["Tu te maquilles avant chaque sortie.", "You put on makeup before every outing."],
      ["Il se maquille pour la pièce de théâtre.", "He puts on makeup for the play."],
      ["Elle se maquille devant le miroir.", "She puts on makeup in front of the mirror."],
      ["On se maquille pour la photo.", "We put on makeup for the photo."],
      ["Nous nous maquillons avant la soirée.", "We put on makeup before the party."],
      ["Vous vous maquillez déjà pour ce soir ?", "Are you already putting on makeup for tonight?"],
      ["Ils se maquillent pour le spectacle.", "They put on makeup for the show."],
      ["Elles se maquillent ensemble avant de sortir.", "They put on makeup together before going out."]
    ],
    "se regarder": [
      ["Je me regarde dans le miroir.", "I look at myself in the mirror."],
      ["Tu te regardes trop souvent dans le miroir.", "You look at yourself in the mirror too often."],
      ["Il se regarde avant de sortir.", "He looks at himself before going out."],
      ["Elle se regarde dans la vitrine.", "She looks at herself in the shop window."],
      ["On se regarde sans rien dire.", "We look at each other without saying anything."],
      ["Nous nous regardons en silence.", "We look at each other in silence."],
      ["Vous vous regardez comme des inconnus.", "You look at each other like strangers."],
      ["Ils se regardent depuis le début de la soirée.", "They've been looking at each other since the start of the evening."],
      ["Elles se regardent et sourient.", "They look at each other and smile."]
    ],
    "se parler": [
      ["Je me parle parfois à voix haute.", "I sometimes talk to myself out loud."],
      ["Tu te parles quand tu es seul ?", "Do you talk to yourself when you're alone?"],
      ["Il se parle pour se rassurer.", "He talks to himself to reassure himself."],
      ["Elle se parle doucement avant l'examen.", "She talks to herself quietly before the exam."],
      ["On se parle tous les jours au téléphone.", "We talk to each other every day on the phone."],
      ["Nous nous parlons rarement en ce moment.", "We rarely talk to each other these days."],
      ["Vous vous parlez encore après la dispute ?", "Are you still talking to each other after the argument?"],
      ["Ils se parlent en anglais entre eux.", "They talk to each other in English."],
      ["Elles se parlent tous les soirs.", "They talk to each other every evening."]
    ],
    "s'aimer": [
      ["Je m'aime davantage depuis peu.", "I've loved myself more lately."],
      ["Tu t'aimes assez peu, je trouve.", "You don't love yourself very much, I find."],
      ["Il s'aime tel qu'il est.", "He loves himself as he is."],
      ["Elle s'aime enfin après ce long chemin.", "She finally loves herself after this long journey."],
      ["On s'aime malgré nos différences.", "We love each other despite our differences."],
      ["Nous nous aimons depuis dix ans.", "We've loved each other for ten years."],
      ["Vous vous aimez encore autant qu'avant.", "You love each other as much as before."],
      ["Ils s'aiment en secret.", "They love each other secretly."],
      ["Elles s'aiment depuis le lycée.", "They've loved each other since high school."]
    ],
    "se rencontrer": [
      ["Je me rencontre enfin moi-même après ce voyage.", "I finally meet myself after this trip."],
      ["Tu te rencontres à travers ce projet.", "You discover yourself through this project."],
      ["Il se rencontre au fil des épreuves.", "He gets to know himself through hardship."],
      ["Elle se rencontre vraiment pour la première fois.", "She truly meets herself for the first time."],
      ["On se rencontre devant le cinéma à huit heures.", "We're meeting in front of the movie theater at eight."],
      ["Nous nous rencontrons chaque semaine au café.", "We meet each other every week at the café."],
      ["Vous vous rencontrez enfin après tous ces messages.", "You're finally meeting each other after all those messages."],
      ["Ils se rencontrent par hasard dans la rue.", "They run into each other by chance in the street."],
      ["Elles se rencontrent tous les lundis pour courir.", "They meet up every Monday to run."]
    ],
    "se disputer": [
      ["Je me dispute avec moi-même parfois.", "I argue with myself sometimes."],
      ["Tu te disputes encore pour un détail.", "You're arguing over a tiny detail again."],
      ["Il se dispute rarement, même sous pression.", "He rarely argues, even under pressure."],
      ["Elle se dispute avec sa sœur pour la télécommande.", "She argues with her sister over the remote."],
      ["On se dispute pour rien, comme d'habitude.", "We argue over nothing, as usual."],
      ["Nous nous disputons rarement pour de l'argent.", "We rarely argue about money."],
      ["Vous vous disputez encore à propos du même sujet.", "You're arguing about the same topic again."],
      ["Ils se disputent depuis ce matin.", "They've been arguing since this morning."],
      ["Elles se disputent pour savoir qui conduit.", "They argue over who's driving."]
    ],
    "s'appeler": [
      ["Je m'appelle Camille.", "My name is Camille."],
      ["Comment tu t'appelles ?", "What's your name?"],
      ["Il s'appelle Antoine, je crois.", "His name is Antoine, I think."],
      ["Elle s'appelle Léa depuis toujours.", "Her name has always been Léa."],
      ["On s'appelle comment, déjà ?", "What are we called again?"],
      ["Nous nous appelons les jumeaux du quartier.", "We're called the twins of the neighborhood."],
      ["Vous vous appelez tous les deux Martin.", "You're both named Martin."],
      ["Ils s'appellent Paul et Marc.", "They're named Paul and Marc."],
      ["Elles s'appellent toutes les deux Sophie.", "They're both named Sophie."]
    ],
    "se souvenir de": [
      ["Je me souviens de ce voyage comme si c'était hier.", "I remember that trip as if it were yesterday."],
      ["Tu te souviens de son nom ?", "Do you remember his name?"],
      ["Il se souvient de chaque détail.", "He remembers every detail."],
      ["Elle se souvient de son enfance avec tendresse.", "She remembers her childhood fondly."],
      ["On se souvient tous de ce jour-là.", "We all remember that day."],
      ["Nous nous souvenons de notre premier voyage ensemble.", "We remember our first trip together."],
      ["Vous vous souvenez de moi ?", "Do you remember me?"],
      ["Ils se souviennent encore de cette chanson.", "They still remember that song."],
      ["Elles se souviennent de tout, même des petits détails.", "They remember everything, even the small details."]
    ],
    "s'intéresser à": [
      ["Je m'intéresse beaucoup à la musique classique.", "I'm very interested in classical music."],
      ["Tu t'intéresses à quoi, en ce moment ?", "What are you interested in right now?"],
      ["Il s'intéresse à l'histoire de sa famille.", "He's interested in his family's history."],
      ["Elle s'intéresse à tout ce qui touche à l'art.", "She's interested in everything related to art."],
      ["On s'intéresse tous à ce nouveau projet.", "We're all interested in this new project."],
      ["Nous nous intéressons de plus en plus à l'écologie.", "We're increasingly interested in ecology."],
      ["Vous vous intéressez à la politique ?", "Are you interested in politics?"],
      ["Ils s'intéressent surtout aux jeux vidéo.", "They're mostly interested in video games."],
      ["Elles s'intéressent à la science depuis toujours.", "They've always been interested in science."]
    ],
    "se dépêcher": [
      ["Je me dépêche, je vais être en retard.", "I'm hurrying, I'm going to be late."],
      ["Tu te dépêches un peu ?", "Could you hurry up a bit?"],
      ["Il se dépêche toujours au dernier moment.", "He always hurries at the last moment."],
      ["Elle se dépêche pour ne pas rater le bus.", "She hurries so she doesn't miss the bus."],
      ["On se dépêche, le film commence bientôt.", "Let's hurry, the movie starts soon."],
      ["Nous nous dépêchons de finir avant midi.", "We're hurrying to finish before noon."],
      ["Vous vous dépêchez trop, ralentissez un peu.", "You're rushing too much, slow down a bit."],
      ["Ils se dépêchent de tout ranger avant l'arrivée des invités.", "They're hurrying to tidy everything before the guests arrive."],
      ["Elles se dépêchent pour attraper le train.", "They're hurrying to catch the train."]
    ],
    "s'ennuyer": [
      ["Je m'ennuie un peu ce week-end.", "I'm a bit bored this weekend."],
      ["Tu t'ennuies souvent en cours ?", "Do you often get bored in class?"],
      ["Il s'ennuie dès qu'il n'a rien à faire.", "He gets bored as soon as he has nothing to do."],
      ["Elle s'ennuie ferme pendant la réunion.", "She's bored stiff during the meeting."],
      ["On s'ennuie un peu sans toi.", "We're a bit bored without you."],
      ["Nous nous ennuyons rarement ensemble.", "We rarely get bored together."],
      ["Vous vous ennuyez déjà ?", "Are you already bored?"],
      ["Ils s'ennuient pendant les longs trajets en voiture.", "They get bored during long car rides."],
      ["Elles s'ennuient un peu à la campagne.", "They get a bit bored in the countryside."]
    ],
    "se demander": [
      ["Je me demande pourquoi il n'a pas répondu.", "I wonder why he didn't answer."],
      ["Tu te demandes encore si c'était une bonne idée ?", "Are you still wondering if it was a good idea?"],
      ["Il se demande ce qu'il doit faire ensuite.", "He wonders what he should do next."],
      ["Elle se demande si elle a pris la bonne décision.", "She wonders if she made the right decision."],
      ["On se demande bien comment il a fait.", "We really wonder how he did it."],
      ["Nous nous demandons si le projet va aboutir.", "We wonder if the project will succeed."],
      ["Vous vous demandez pourquoi je suis si calme ?", "You're wondering why I'm so calm?"],
      ["Ils se demandent qui a pris la décision.", "They wonder who made the decision."],
      ["Elles se demandent quand elles pourront partir.", "They wonder when they'll be able to leave."]
    ],
    "se moquer de": [
      ["Je me moque un peu de son accent, gentiment.", "I tease him a bit about his accent, kindly."],
      ["Tu te moques de moi, là ?", "Are you making fun of me right now?"],
      ["Il se moque souvent de lui-même.", "He often makes fun of himself."],
      ["Elle se moque gentiment de ses erreurs.", "She gently pokes fun at her own mistakes."],
      ["On se moque un peu de tout, ici.", "We joke around about everything here."],
      ["Nous nous moquons parfois de nos propres habitudes.", "We sometimes make fun of our own habits."],
      ["Vous vous moquez de moi depuis le début !", "You've been making fun of me from the start!"],
      ["Ils se moquent gentiment de leur professeur.", "They gently tease their teacher."],
      ["Elles se moquent de tout, même des choses sérieuses.", "They joke about everything, even serious things."]
    ]
  });
