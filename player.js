// ===== LIENS SUPABASE =====
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
    "Sorcière.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorci%C3%A8re.png",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  }
};

const ASSET_FOLDERS = { images: "images" };

function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}

let peer = null;
let conn = null;
let myRole = "";
let isRevealed = false;
let joined = false;
let session = null;
let retryTimer = null;

const STORE_KEY = "lg-player-session";

// Dictionnaire des cartes
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
    image: "Sorcière.png",
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

function loadSession() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
}
function saveSession(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { }
}
function clearSession() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { }
}
function randomToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

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

  isRevealed = true;
  toggleRoleReveal();
}

function escapeText(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function toggleRoleReveal() {
  const cardBack = document.getElementById('secret-card');
  const roleDetails = document.getElementById('role-details');
  const versoImg = document.getElementById('verso-image');

  isRevealed = !isRevealed;

  if (isRevealed) {
    cardBack.classList.add('revealed');
    cardBack.querySelector('span').textContent = "🔒 Toucher pour masquer";
    if (versoImg) versoImg.style.display = 'none';
    roleDetails.style.display = 'flex';
  } else {
    cardBack.classList.remove('revealed');
    cardBack.querySelector('span').textContent = "👁️ Toucher pour révéler";
    if (versoImg) versoImg.style.display = 'block';
    roleDetails.style.display = 'none';
  }
}