const VERSION_APP = "21";
console.info("Loup-Garou régie - version " + VERSION_APP);

const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
 images: {
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
    "Titre.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Titre.png",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  },
  audio: {
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
    "Sorciere.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Sorciere.mp4",
  }
};

const ASSET_FOLDERS = { images: "images", audio: "mj/audio", video: "mj/video" };

function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}

// --- CONFIGURATION ---
const YT_ID_NUIT = "FDHc4qUNMTQ";
const YT_ID_JOUR = "bNyXbxpWiok";

let peer = null;
let roomCode = "";
let players = [];
let roles = [];
let voleurCards = [];
let distributed = false;
let activeCallRoles = new Set();
let hostOpened = false;

let currentAudio = null;
let projectorWindow = null;
let overlayMode = null;
let currentOverlayFile = null;

// --- UTILITAIRES ---
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const PROJECTOR_TARGET = window.location.origin === 'null' ? '*' : window.location.origin;

function projectorOpen() {
  return projectorWindow && !projectorWindow.closed;
}

function sendToProjector(msg) {
  if (!projectorOpen()) return false;
  projectorWindow.postMessage(msg, PROJECTOR_TARGET);
  return true;
}

// SYNCHRONISATION DU SALON (QR CODE + PSEUDOS DES JOUEURS) VERS LE PROJECTEUR
function syncLobbyToProjector() {
  if (!projectorOpen() || !roomCode) return;
  const basePath = window.location.pathname.replace(/[^/]*$/, '');
  const joinUrl = `${window.location.origin}${basePath}joueur.html?room=${roomCode}`;
  
  sendToProjector({
    action: 'updateLobby',
    roomCode: roomCode,
    joinUrl: joinUrl,
    players: players.map(p => ({ name: p.name, connected: p.connected }))
  });
}

// --- ÉCRAN SECONDAIRE ---
function openProjectorWindow() {
  if (!projectorOpen()) {
    projectorWindow = window.open('projecteur.html?v=21', 'ProjecteurLoupGarou', 'width=1280,height=720');
  } else {
    projectorWindow.focus();
  }
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'projectorReady') {
    syncLobbyToProjector();
  }
});

// --- SALON PEERJS ---
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function initHost(attempt = 0) {
  if (peer && !peer.destroyed) peer.destroy();
  roomCode = generateRoomCode();
  peer = new Peer("LG-" + roomCode);

  peer.on('open', () => {
    hostOpened = true;
    document.getElementById('host-ui').style.display = 'block';
    document.getElementById('room-code-display').innerText = roomCode;
    document.getElementById('mj-setup-card').style.display = 'block';

    const basePath = window.location.pathname.replace(/[^/]*$/, '');
    const joinUrl = `${window.location.origin}${basePath}joueur.html?room=${roomCode}`;
    document.getElementById('qrcode').innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: joinUrl, width: 140, height: 140 });

    const urlEl = document.getElementById('join-url');
    if (window.location.origin === 'null') {
      urlEl.textContent = "⚠️ Page ouverte en file:// : le QR code ne fonctionnera pas. Hébergez le site (http/https).";
    } else {
      urlEl.textContent = joinUrl;
    }

    syncLobbyToProjector();
  });

  peer.on('connection', (conn) => {
    conn.on('data', (data) => {
      if (data && data.type === 'join') handleJoin(conn, data);
    });

    conn.on('close', () => {
      const p = players.find((pl) => pl.conn === conn);
      if (p) {
        p.connected = false;
        refreshPlayerViews();
      }
    });
  });

  peer.on('error', (err) => {
    if (err.type === 'unavailable-id' && attempt < 3) {
      initHost(attempt + 1);
    } else if (err.type === 'unavailable-id') {
      alert("Impossible de réserver un code de salon. Réessayez.");
    } else if (!hostOpened) {
      alert("Impossible de créer le salon (" + err.type + "). Vérifiez votre connexion.");
    } else {
      console.warn("Erreur PeerJS :", err);
    }
  });
}

function handleJoin(conn, data) {
  const name = String(data.playerName || '').trim().slice(0, 20);
  const token = String(data.token || '');

  if (!name) {
    conn.send({ type: 'rejected', message: "Pseudo vide." });
    return;
  }

  let player = players.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (player) {
    const sameToken = token && player.token === token;
    if (!sameToken && player.connected) {
      conn.send({ type: 'rejected', message: "Ce pseudo est déjà pris dans la partie." });
      return;
    }
    if (!sameToken && !player.connected) {
      player.token = token || player.token;
    }
    player.conn = conn;
    player.connected = true;
  } else {
    if (distributed) {
      conn.send({ type: 'rejected', message: "La partie a déjà commencé." });
      return;
    }
    player = { name, token, role: "", alive: true, conn, connected: true };
    players.push(player);
  }

  conn.send({ type: 'joined' });
  if (player.role) conn.send({ type: 'assignRole', role: player.role });
  refreshPlayerViews();
}

function refreshPlayerViews() {
  updateMJPlayerList();
  syncLobbyToProjector();
  if (distributed) renderMJDashboard();
}

function addRole(roleName) {
  roles.push(roleName);
  updateMJRoleList();
}

function removeRole(index) {
  roles.splice(index, 1);
  updateMJRoleList();
}

function updateMJPlayerList() {
  document.getElementById('player-list').innerHTML = players
    .map((p) => `<li>${p.connected ? '🟢' : '📴'} <span class="nom-joueur">${escapeHtml(p.name)}</span></li>`)
    .join('');
  document.getElementById('player-count').innerText = players.length;
}

function updateMJRoleList() {
  document.getElementById('role-list').innerHTML = roles
    .map((r, i) => `<li>${escapeHtml(r)} <span class="remove" onclick="removeRole(${i})">&times;</span></li>`)
    .join('');
  document.getElementById('role-count').innerText = roles.length;
}

function distributeRolesNetwork() {
  const hasVoleur = roles.includes('Voleur');
  const expected = players.length + (hasVoleur ? 2 : 0);

  if (players.length === 0 || roles.length !== expected) {
    alert(hasVoleur
      ? `Avec le Voleur, il faut ${players.length + 2} rôles (joueurs + 2 cartes). Actuellement : ${roles.length}.`
      : "Vérifiez que le nombre de joueurs équivaut au nombre de rôles.");
    return;
  }

  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  players.forEach((player, i) => {
    player.role = shuffled[i];
    if (player.conn && player.conn.open) player.conn.send({ type: 'assignRole', role: player.role });
  });
  voleurCards = shuffled.slice(players.length);
  distributed = true;
  activeCallRoles = new Set(roles);
  updateCallButtons();

  renderMJDashboard();
}

function updateCallButtons() {
  const grid = document.getElementById('calls-grid');
  const hint = document.getElementById('calls-hint');
  if (!grid || !hint) return;

  let visible = 0;
  grid.querySelectorAll('[data-role]').forEach((btn) => {
    const show = distributed && activeCallRoles.has(btn.dataset.role);
    btn.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  if (!distributed) {
    hint.textContent = "Distribuez les rôles : seuls les personnages en jeu apparaîtront ici (le Maire est toujours disponible).";
    hint.style.display = 'block';
  } else if (visible === 0) {
    hint.textContent = "Aucun personnage à appeler dans cette partie.";
    hint.style.display = 'block';
  } else {
    hint.style.display = 'none';
  }
}

function renderMJDashboard() {
  const tbody = document.getElementById('mj-table-body');
  let html = players.map((item, index) => `
    <tr>
      <td><strong class="nom-joueur">${escapeHtml(item.name)}</strong> ${item.connected ? '' : '📴'}</td>
      <td>🎭 ${escapeHtml(item.role)}</td>
      <td>
        <button class="status-btn ${item.alive ? 'status-alive' : 'status-dead'}" onclick="togglePlayerStatus(${index})">
          ${item.alive ? '🟢 En vie' : '💀 Mort'}
        </button>
      </td>
    </tr>
  `).join('');

  if (voleurCards.length) {
    html += `<tr><td colspan="3">🃏 Cartes du Voleur : ${voleurCards.map(escapeHtml).join(', ')}</td></tr>`;
  }
  tbody.innerHTML = html;
  document.getElementById('mj-dashboard').style.display = 'block';
}

function togglePlayerStatus(index) {
  players[index].alive = !players[index].alive;
  renderMJDashboard();
}

// --- MÉDIAS ---
function setProjectorVideoVolume(vol, duration = 600) {
  sendToProjector({ action: 'setVolume', volume: vol, duration });
}

function playRoleVideo(fileName, mode = 'corner') {
  overlayMode = mode;
  currentOverlayFile = fileName;
  sendToProjector({ action: 'playOverlayVideo', url: mediaUrl('video', fileName), mode });
}

function stopRoleVideo() {
  overlayMode = null;
  currentOverlayFile = null;
  sendToProjector({ action: 'stopOverlayVideo' });
}

function isCenteredVideo(fileName) {
  return overlayMode === 'center' && currentOverlayFile === fileName;
}

function playScene(videoId) {
  if (!sendToProjector({ action: 'playYTVideo', videoId })) {
    alert("Veuillez d'abord cliquer sur 'Ouvrir l'Écran Secondaire' !");
  } else {
    overlayMode = null;
    currentOverlayFile = null;
  }
}

function playNightPhase() {
  playScene(YT_ID_NUIT);
  playAudioFile("Appel nuit V2.mp3");
}

function playDayPhase() {
  playScene(YT_ID_JOUR);
  playAudioFile("Appel jour V2.mp3");
}

// --- CONSIGNES & INTERVENTIONS ---
function playCommand(cmd) {
  if (cmd === 'fermer_yeux') {
    playAudioFile("Fermer les yeux.mp3");
  } else if (cmd === 'voter_maire') {
    playRoleVideo("Maire.mp4", 'center');
    playAudioFile("Maire.mp3");
  } else if (cmd === 'voter') {
    playAudioFile("Voter.mp3");
  }
}

function playRenardResponse(isPositive) {
  if (!isCenteredVideo("Renard.mp4")) playRoleVideo("Renard.mp4");
  playAudioFile(isPositive ? "Appel Renard oui.mp3" : "Appel Renard non.mp3");
}

function playSorcierePotions(type) {
  if (!isCenteredVideo("Sorciere.mp4")) playRoleVideo("Sorciere.mp4");
  if (type === 2) playAudioFile("Sorciere 2 potions.mp3");
  else if (type === 'vie') playAudioFile("Sorciere potion de vie.mp3");
  else if (type === 'mort') playAudioFile("Sorciere potion de mort.mp3");
}

function playDeaths(count) {
  const files = ["0 mort.mp3", "1 mort.mp3", "2 morts.mp3", "3 morts.mp3"];
  if (files[count]) playAudioFile(files[count]);
}

// --- AUDIO ---
const FALLBACK_TEXTS = {
  "Le hurlement du loup 1.mp3": "Awouuuu !",
  "Le hurlement du loup 2.mp3": "Awouuuu !",
  "Le hurlement du loup 3.mp3": "Awouuuu !",
  "Effet sorciere.mp3": "Hi hi hi hi hi !",
  "Fermer les yeux.mp3": "Tout le monde ferme les yeux !",
  "Maire.mp3": "Le village va maintenant élire son maire !",
  "Voter.mp3": "Le village va maintenant délibérer et voter !",
  "Appel Renard oui.mp3": "Oui, il y a au moins un Loup-Garou parmi ces trois personnes.",
  "Appel Renard non.mp3": "Non, il n'y a aucun Loup-Garou parmi ces trois personnes.",
  "Sorciere 2 potions.mp3": "Sorcière, vous possédez encore vos deux potions : la potion de vie et la potion de mort.",
  "Sorciere potion de vie.mp3": "Sorcière, il ne vous reste plus que votre potion de vie.",
  "Sorciere potion de mort.mp3": "Sorcière, il ne vous reste plus que votre potion de mort.",
  "0 mort.mp3": "Bonne nouvelle ! Aucun mort n'est à déplorer ce matin !",
  "1 mort.mp3": "Le village déplore un mort ce matin.",
  "2 morts.mp3": "Cette nuit a été tragique, nous avons deux morts.",
  "3 morts.mp3": "Carnage au village, trois victimes sont à déplorer ce matin.",
  "Sorciere.mp3": "Sorcière, réveille-toi.",
  "chasseur.mp3": "Chasseur, tu viens de mourir. Désigne ta dernière victime.",
  "Appel voleur V3.mp3": "Voleur, réveille-toi. Tu peux échanger ta carte avec l'une des cartes restantes.",
  "Appel Cupidon V2.mp3": "Cupidon, réveille-toi et désigne deux amoureux.",
  "Appel voyante V2.mp3": "Voyante, réveille-toi et désigne un joueur dont tu veux connaître le rôle.",
  "Appel renard V2.mp3": "Renard, réveille-toi et désigne un groupe de trois joueurs.",
  "Appel Loups-Garous V2.mp3": "Loups-Garous, réveillez-vous et désignez votre victime.",
  "Appel nuit V2.mp3": "La nuit tombe sur le village.",
  "Appel jour V2.mp3": "Le jour se lève sur le village."
};

function onAudioFinished() {
  setProjectorVideoVolume(1.0, 800);
  if (overlayMode === 'corner') stopRoleVideo();
}

function audioCandidates(filename) {
  const ascii = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return [...new Set([filename, ascii, ascii.toLowerCase(), filename.toLowerCase()])];
}

let toastTimer = null;
function showToast(msg) {
  let el = document.getElementById('mj-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mj-toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 7000);
}

function diagnoseAudio(url, filename) {
  const base = `Audio « ${filename} » : `;
  fetch(url, { method: 'HEAD' })
    .then((r) => {
      const type = r.headers.get('content-type') || 'inconnu';
      if (r.status === 404 || r.status === 400) {
        showToast(base + `fichier introuvable (HTTP ${r.status}). Vérifiez le nom exact dans mj/audio et que le bucket est public.`);
      } else if (r.ok) {
        showToast(base + `le fichier existe mais n'est pas lisible (type « ${type} »). Ré-exportez-le en vrai MP3 et ré-uploadez-le.`);
      } else {
        showToast(base + `erreur HTTP ${r.status}.`);
      }
      console.warn(base, r.status, type, url);
    })
    .catch(() => showToast(base + "impossible de joindre Supabase (réseau ou CORS)."));
}

function playAudioFile(filename) {
  window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  setProjectorVideoVolume(0.25, 400);

  const candidates = audioCandidates(filename);

  const tryPlay = (i) => {
    const url = mediaUrl('audio', candidates[i]);
    const audio = new Audio(url);
    currentAudio = audio;

    audio.addEventListener('ended', () => {
      if (currentAudio === audio) onAudioFinished();
    });

    audio.addEventListener('error', () => {
      if (currentAudio !== audio) return;
      console.warn("Audio introuvable :", url);
      if (i + 1 < candidates.length) {
        tryPlay(i + 1);
      } else {
        diagnoseAudio(mediaUrl('audio', candidates[0]), filename);
        fallbackSpeech(filename);
      }
    });

    audio.play().catch((err) => {
      if (currentAudio !== audio) return;
      if (err.name === 'NotAllowedError') {
        showToast("Lecture bloquée par le navigateur : cliquez sur la page puis réessayez.");
        fallbackSpeech(filename);
      }
    });
  };

  tryPlay(0);
}

function fallbackSpeech(filename) {
  const text = FALLBACK_TEXTS[filename];
  if (!text) { onAudioFinished(); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.85;
  utterance.onend = onAudioFinished;
  window.speechSynthesis.speak(utterance);
}

function stopAllMedia() {
  sendToProjector({ action: 'stop' });
  overlayMode = null;
  currentOverlayFile = null;
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  window.speechSynthesis.cancel();
  setProjectorVideoVolume(1.0, 300);
}

function togglePauseAllMedia() {
  sendToProjector({ action: 'togglePause' });
  if (currentAudio && !currentAudio.ended) {
    if (currentAudio.paused) currentAudio.play().catch((err) => console.log(err));
    else currentAudio.pause();
  }
}

// --- APPELS RÔLES & EFFETS ---
function playRole(role) {
  const roleFiles = {
    voleur: { audio: "Appel voleur V3.mp3", video: "Voleur.mp4" },
    cupidon: { audio: "Appel Cupidon V2.mp3", video: "Cupidon.mp4" },
    voyante: { audio: "Appel voyante V2.mp3", video: "La voyante.mp4" },
    renard: { audio: "Appel renard V2.mp3", video: "Renard.mp4" },
    loups: { audio: "Appel Loups-Garous V2.mp3", video: "Loup-Garou.mp4" },
    sorciere: { audio: "Sorciere.mp3", video: "Sorciere.mp4" },
    chasseur: { audio: "chasseur.mp3", video: "Chasseur.mp4" }
  };

  const item = roleFiles[role];
  if (item) {
    playAudioFile(item.audio);
    if (item.video) playRoleVideo(item.video, 'center');
  }
}

const HOWL_FILES = ["Le hurlement du loup 1.mp3", "Le hurlement du loup 2.mp3", "Le hurlement du loup 3.mp3"];
let lastHowl = null;

function playRandomHowl() {
  const choices = HOWL_FILES.filter((f) => f !== lastHowl);
  const pick = choices[Math.floor(Math.random() * choices.length)];
  lastHowl = pick;
  playAudioFile(pick);
}

function playEffect(effect) {
  if (effect === 'hurlement') {
    playRandomHowl();
  } else if (effect === 'sorciere') {
    playAudioFile("Effet sorciere.mp3");
  }
}

// --- RACCOURCIS CLAVIER ---
document.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (e.key === 'Escape') stopAllMedia();
  if (e.code === 'Space') {
    e.preventDefault();
    togglePauseAllMedia();
  }
});

updateCallButtons();