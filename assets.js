/* Médias 100 % locaux : tout est dans assets/{images,audio,music,video}/ (aucun lien distant).
   - manifest.js (généré par le Back-Office) peut remplacer un média par un autre fichier du dossier : window.LG_ASSET_OVERRIDES["audio/Maire.mp3"] = "mon-fichier.mp3"
   - Les clés de ASSETS sont les noms « logiques » utilisés par le code ; les valeurs sont des chemins relatifs. */
(function () {
  var OV = window.LG_ASSET_OVERRIDES || {};
  var REV = window.LG_ASSET_REV || '';
  var DIR = { images: 'assets/images/', audio: 'assets/audio/', music: 'assets/music/', video: 'assets/video/' };

  function url(kind, logical, file) {
    var f = OV[kind + '/' + logical] || file || logical;
    return DIR[kind] + f.split('/').map(encodeURIComponent).join('/') + (REV ? '?r=' + REV : '');
  }
  function build(kind, spec) {
    var out = {};
    spec.forEach(function (s) {
      var logical = Array.isArray(s) ? s[0] : s;
      var file = Array.isArray(s) ? s[1] : s;
      out[logical] = url(kind, logical, file);
    });
    return out;
  }

  // catalogue : [nom logique, fichier par défaut] — le Back-Office s'appuie sur la même liste (window.LG_CATALOG)
  var CATALOG = {
    images: [
      ['Verso.png', 'Verso.webp'], ['Chasseur.png', 'Chasseur.webp'], ['Cupidon.png', 'Cupidon.webp'], ['Loup-Garou.png', 'Loup-Garou.webp'],
      ['Maire.png', 'Maire.webp'], ['Voyante.png', 'Voyante.webp'], ['Voleur.png', 'Voleur.webp'], ['Villageois.png', 'Villageois.webp'],
      ['Renard.jpg', 'Renard.webp'], ['Petite Fille.png', 'Petite-Fille.webp'], ['Sorciere.png', 'Sorciere.webp']
    ],
    audio: [
      '0 mort.mp3', '1 mort.mp3', '2 morts.mp3', '3 morts.mp3', 'Appel Cupidon V2.mp3', 'Appel jour V2.mp3', 'Appel Loups-Garous V2.mp3',
      'Appel nuit V2.mp3', 'Appel Renard non.mp3', 'Appel Renard oui.mp3', 'Appel renard V2.mp3', 'Appel voleur V3.mp3', 'Appel voyante V2.mp3',
      'Ouvrez les yeux.mp3', 'Fermer les yeux.mp3', 'Voter.mp3', 'Le hurlement du loup 1.mp3', 'Le hurlement du loup 2.mp3', 'Le hurlement du loup 3.mp3',
      'Applaudissements.mp3', 'Effet sorciere.mp3', 'Maire.mp3', 'Sorciere.mp3', 'Sorciere 2 potions.mp3', 'Sorciere potion de vie.mp3', 'Sorciere potion de mort.mp3'
    ],
    music: ['Feast Circle 1.mp3', 'Dusk in the Tavern 1.mp3', 'Dusk in the Tavern 2.mp3', 'Tavern at Dusk 1.mp3', 'Tavern at Dusk 2.mp3'],
    video: [
      ['Mort Loup.mp4', 'Mort-Loups.mp4'], 'Elimination 2.mp4', 'Empoisoner.mp4', 'Mort tire.mp4', 'Chasseur.mp4', 'Cupidon.mp4',
      ['La voyante.mp4', 'Voyante.mp4'], 'Loup-Garou.mp4', 'Maire.mp4', 'Renard.mp4', 'Voleur.mp4', 'Sorciere.mp4',
      ['scene-nuit.mp4', 'fond-village-nuit.mp4'], ['scene-jour.mp4', 'fond-village-jour.mp4'], ['scene-presentation.mp4', 'fond-village-nuit.mp4'],   // présentation : provisoire
      ['fond-village-nuit.mp4', 'fond-village-nuit.mp4'], ['fond-village-jour.mp4', 'fond-village-jour.mp4']
    ]
  };
  window.LG_CATALOG = CATALOG;

  // scènes plein écran de l'écran public (anciennement des vidéos YouTube) et fonds animés : ne font pas partie des médias préchargés « annonce »
  var SCENE_KEYS = { 'scene-nuit.mp4': 1, 'scene-jour.mp4': 1, 'scene-presentation.mp4': 1, 'fond-village-nuit.mp4': 1, 'fond-village-jour.mp4': 1 };

  window.ASSETS = {
    images: build('images', CATALOG.images),
    audio: build('audio', CATALOG.audio),
    music: build('music', CATALOG.music),
    video: build('video', CATALOG.video.filter(function (s) { return !SCENE_KEYS[Array.isArray(s) ? s[0] : s]; }))
  };
  window.SCENE_URLS = build('video', CATALOG.video.filter(function (s) { return SCENE_KEYS[Array.isArray(s) ? s[0] : s]; }));

  window.mediaUrl = function (kind, name) {
    return (window.ASSETS[kind] && window.ASSETS[kind][name]) || (window.SCENE_URLS && window.SCENE_URLS[name]) || url(kind, name, name);
  };
})();
