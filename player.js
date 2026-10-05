// ===== LIENS SUPABASE (anciennement config.js) =====
// Liens directs vers le bucket Supabase "assets" (bucket PUBLIC requis).
// Chaque fichier est référencé par son URL complète : modifiez une ligne si un fichier change de nom.
const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
  images: {
	"Verso.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/joueur/images/Verso.png",
    "Chasseur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Chasseur.png",
    "Cupidon.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Cupidon.png",
    "Loup-Garou.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Loup-Garou.png",
    "Maire.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Maire.png",
    "Voyante.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voyante.png",
    "Voleur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voleur.png",
    "Villageois.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Villageois.png",
    "Renard.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Renard.jpg",
    "Petite Fille.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Petite%20Fille.png",
    "Sorciere.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorciere.png",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  },
  audio: {
    // Fichiers présents dans votre liste :
    "0 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/0%20mort.mp3",
    "1 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/1%20mort.mp3",
    "2 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/2%20morts.mp3",
    "3 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/3%20morts.mp3",
    "Appel Cupidon V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Cupidon%20V2.mp3",
    "Appel jour V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20jour%20V2.mp3",
    "Appel Loups-Garous V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Loups-Garous%20V2.mp3",
    "Appel nuit V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20nuit%20V2.mp3",
    "Appel Renard non.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20non.mp3",
    "Appel Renard oui.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20oui.mp3",
    "Appel renard V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20renard%20V2.mp3",
    "Appel voleur V3.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voleur%20V3.mp3",
    "Appel voyante V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voyante%20V2.mp3",
    "Fermer les yeux.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Fermer%20les%20yeux.mp3",
    "Voter.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Voter.mp3",
    "Le hurlement du loup 1.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%201.mp3",
    "Le hurlement du loup 2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%202.mp3",
    "Le hurlement du loup 3.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%203.mp3",
    "Effet sorciere.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Effet%20sorciere.mp3",
    // Fichiers à vérifier / uploader (absents de votre liste) :
    "Maire.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Maire.mp3",
    "Sorciere.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere.mp3",
    "Sorciere 2 potions.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%202%20potions.mp3",
    "Sorciere potion de vie.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%20potion%20de%20vie.mp3",
    "Sorciere potion de mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%20potion%20de%20mort.mp3",
    "chasseur.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/chasseur.mp3",
  },
  video: {
    "Chasseur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Chasseur.mp4",
    "Cupidon.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Cupidon.mp4",
    "La voyante.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/La%20voyante.mp4",
    "Loup-Garou.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Loup-Garou.mp4",
    "Maire.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Maire.mp4",
    "Renard.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Renard.mp4",
    "Voleur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Voleur.mp4",
    // À vérifier / uploader :
    "Sorciere.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Sorciere.mp4",
  }
};

const ASSET_FOLDERS = { images: "images", audio: "mj/audio", video: "mj/video" };

// URL générique (secours si un nom n'est pas dans la table ci-dessus)
function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

// mediaUrl("audio", "0 mort.mp3") -> lien direct Supabase
function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}

// ===== FIN LIENS SUPABASE =====

let peer = null;
let conn = null;
let myRole = "";
let isRevealed = false;
let joined = false;
let session = null;      // { room, name, token } mémorisé pour la reconnexion
let retryTimer = null;

const STORE_KEY = "lg-player-session";

// Dictionnaire des cartes (images dans le bucket Supabase : assets/images/)
const roleData = {
  "Loup-Garou": {
    image: "Loup-Garou.png",
    description: "🐺 <strong>Loup-Garou :</strong> Chaque nuit, dévorez un villageois en concertation avec les autres loups. Le jour, fondez-vous parmi les innocents pour ne pas vous faire démasquer."
  },
  "Villageois": {
    image: "Villageois.png",
    description: "👨‍🌾 <strong>Simple Villageois :</strong> Vous ne possédez aucun pouvoir particulier. Utilisez votre sens de l'observation et votre logique lors des débats pour éliminer les Loups-Garous."
  },
  "Voyante": {
    image: "Voyante.png",
    description: "🔮 <strong>La Voyante :</strong> Chaque nuit, vous pouvez observer la véritable identité d'un joueur de votre choix avant que le village ne se réveille."
  },
  "Sorcière": {
    image: "Sorciere.png",
    description: "🧪 <strong>La Sorcière :</strong> Vous possédez deux potions à usage unique : une potion de vie pour sauver la victime des loups, et une potion de mort pour éliminer un joueur."
  },
  "Chasseur": {
    image: "Chasseur.png",
    description: "🏹 <strong>Le Chasseur :</strong> Si vous vous faites éliminer (par les loups ou par le vote du village), vous tirez une dernière balle pour éliminer immédiatement le joueur de votre choix."
  },
  "Cupidon": {
    image: "Cupidon.png",
    description: "💘 <strong>Cupidon :</strong> La première nuit, désignez deux joueurs qui deviendront amoureux. Si l'un d'eux meurt, l'autre meurt de chagrin immédiatement."
  },
  "Voleur": {
    image: "Voleur.png",
    description: "🕵️ <strong>Le Voleur :</strong> La première nuit, si cette option est activée, vous pouvez choisir d'échanger votre carte avec l'une des cartes non distribuées."
  },
  "Renard": {
    image: "Renard.jpg",
    description: "🦊 <strong>Le Renard :</strong> Chaque nuit, désignez un groupe de 3 joueurs voisins. Si au moins un Loup-Garou s'y trouve, vous conservez votre pouvoir pour la nuit suivante."
  },
  "Petite Fille": {
    image: "Petite Fille.png",
    description: "👧 <strong>La Petite Fille :</strong> Vous pouvez entr'ouvrir les yeux pendant la nuit pour espionner discrètement les Loups-Garous, à vos risques et périls !"
  }
};

// --- Session (reconnexion après rechargement ou perte réseau) ---
function loadSession() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
}
function saveSession(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* stockage indisponible */ }
}
function clearSession() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignoré */ }
}
function randomToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// --- Interface ---
function showError(msg) {
  const el = document.getElementById('join-error');
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function setBusy(busy) {
  const btn = document.getElementById('join-btn');
  btn.disabled = busy;
  btn.textContent = busy ? "Connexion…" : "Rejoindre";
}

function showJoinForm() {
  document.getElementById('join-card').style.display = 'block';
  document.getElementById('game-card').style.display = 'none';
}

function showGame(name) {
  document.getElementById('join-card').style.display = 'none';
  document.getElementById('game-card').style.display = 'block';
  document.getElementById('welcome-title').textContent = `Joueur : ${name}`;
}

// --- Démarrage ---
document.addEventListener("DOMContentLoaded", () => {
  const urlRoom = (new URLSearchParams(window.location.search).get('room') || "").toUpperCase();
  const saved = loadSession();

  if (urlRoom) document.getElementById('room-code').value = urlRoom;

  if (saved && (!urlRoom || urlRoom === saved.room)) {
    document.getElementById('room-code').value = saved.room;
    document.getElementById('player-name').value = saved.name;
    session = saved;
    connect(saved.room, saved.name, saved.token, true);
  }

  ["room-code", "player-name"].forEach((id) =>
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') joinRoom();
    })
  );
  document.getElementById('secret-card').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRoleReveal(); }
  });
});

// --- Connexion au salon du MJ ---
function joinRoom() {
  const name = document.getElementById('player-name').value.trim();
  const room = document.getElementById('room-code').value.trim().toUpperCase();

  if (!name || !room) {
    showError("Veuillez entrer votre pseudo et le code du salon.");
    return;
  }
  const token = session && session.room === room && session.name === name ? session.token : randomToken();
  session = { room, name, token };
  connect(room, name, token, false);
}

function connect(room, name, token, isAuto) {
  clearTimeout(retryTimer);
  showError("");
  setBusy(true);
  if (peer && !peer.destroyed) peer.destroy();

  peer = new Peer();

  peer.on('open', () => {
    conn = peer.connect("LG-" + room, { reliable: true });

    const timeout = setTimeout(() => {
      if (!conn.open) failJoin("Salon introuvable. Vérifiez le code ou réessayez.", isAuto);
    }, 10000);

    conn.on('open', () => {
      clearTimeout(timeout);
      conn.send({ type: 'join', playerName: name, token });
    });

    conn.on('data', (data) => {
      if (!data) return;
      if (data.type === 'joined') {
        joined = true;
        saveSession(session);
        setBusy(false);
        showGame(name);
      } else if (data.type === 'rejected') {
        joined = false;
        failJoin(data.message || "Connexion refusée.", true);
      } else if (data.type === 'assignRole') {
        myRole = data.role;
        setupRoleCard(data.role);
      }
    });

    conn.on('close', () => {
      if (joined) scheduleReconnect();
    });
  });

  peer.on('error', (err) => {
    if (joined) {
      scheduleReconnect();
    } else if (err.type === 'peer-unavailable') {
      failJoin("Salon introuvable. Vérifiez le code fourni par le MJ.", isAuto);
    } else {
      failJoin("Erreur de connexion (" + err.type + "). Vérifiez votre réseau.", isAuto);
    }
  });
}

function failJoin(message, clear) {
  setBusy(false);
  if (clear) clearSession();
  showJoinForm();
  showError(message);
}

function scheduleReconnect() {
  document.getElementById('status-text').textContent = "Connexion perdue, reconnexion en cours…";
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    if (session) connect(session.room, session.name, session.token, true);
  }, 3000);
}

// --- Carte de rôle ---
function setupRoleCard(role) {
  document.getElementById('status-text').textContent = "Votre rôle vous a été distribué !";
  document.getElementById('card-area').style.display = 'block';

  const data = roleData[role] || {
    image: null,
    description: `🎭 <strong>${escapeText(role)} :</strong> Rôle personnalisé attribué par le Maître du Jeu.`
  };

  document.getElementById('role-name-display').textContent = role;
  const img = document.getElementById('role-image-display');
  if (data.image) {
    img.style.display = '';
    img.onerror = () => { img.style.display = 'none'; };
    img.src = mediaUrl('images', data.image);
  } else {
    img.style.display = 'none';
  }
  document.getElementById('role-desc-display').innerHTML = data.description;

  // Toujours repartir carte cachée
  isRevealed = true;
  toggleRoleReveal();
}

function escapeText(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// Affichage / masquage de la carte secrète
function toggleRoleReveal() {
  const cardBack = document.getElementById('secret-card');
  const roleDetails = document.getElementById('role-details');
  const versoImg = document.getElementById('verso-image');

  isRevealed = !isRevealed;

  if (isRevealed) {
    cardBack.classList.add('revealed');
    cardBack.querySelector('span').textContent = "🔒 Toucher pour masquer";
    if (versoImg) versoImg.style.display = 'none'; // Cacher l'image du verso
    roleDetails.style.display = 'flex';           // Afficher la carte et son rôle
  } else {
    cardBack.classList.remove('revealed');
    cardBack.querySelector('span').textContent = "👁️ Toucher pour révéler";
    if (versoImg) versoImg.style.display = 'block'; // Réafficher l'image du verso
    roleDetails.style.display = 'none';            // Masquer le rôle
  }
}