const VERSION_APP = "24";
console.info("Loup-Garou régie - version " + VERSION_APP);

const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
  // ... (Garder vos assets actuels)
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
const YT_ID_PRESENTATION = "VSfS9oM630s";

let peer = null;
let roomCode = "";
let players = [];
let roles = [];
let calledOnce = new Set();
let thiefOffers = new Map();
let distributed = false;
let activeCallRoles = new Set();
let hostOpened = false;

let currentAudio = null;
let projectorWindow = null;
let overlayMode = null;
let currentOverlayFile = null;

let currentDeathMode = null;
let selectedDeathPlayers = [];

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

function openProjectorWindow() {
  if (!projectorOpen()) {
    projectorWindow = window.open('projecteur.html?v=24', 'ProjecteurLoupGarou', 'width=1280,height=720');
  } else {
    projectorWindow.focus();
  }
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'projectorReady') {
    syncLobbyToProjector();
  }
});

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
      if (!data) return;
      if (data.type === 'join') handleJoin(conn, data);
      else if (data.type === 'thiefSteal') handleThiefSteal(conn, data);
      else if (data.type === 'cupidonSelect') handleCupidonSelect(conn, data);
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
    } else {
      console.warn("Erreur PeerJS :", err);
    }
  });
}

function handleJoin(conn, data) {
  const name = String(data.playerName || '').trim().slice(0, 20);
  const token = String(data.token || '');
  if (!name) { conn.send({ type: 'rejected', message: "Pseudo vide." }); return; }

  let player = players.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (player) {
    player.conn = conn;
    player.connected = true;
  } else {
    if (distributed) { conn.send({ type: 'rejected', message: "La partie a déjà commencé." }); return; }
    player = { name, token, role: "", alive: true, inLove: false, conn, connected: true };
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

function addRole(roleName) { roles.push(roleName); updateMJRoleList(); }
function removeRole(index) { roles.splice(index, 1); updateMJRoleList(); }

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
  if (players.length === 0 || roles.length !== players.length) {
    alert("Vérifiez que le nombre de joueurs équivaut au nombre de rôles.");
    return;
  }
  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  players.forEach((player, i) => {
    player.role = shuffled[i];
    player.alive = true;
    player.inLove = false;
    if (player.conn && player.conn.open) player.conn.send({ type: 'assignRole', role: player.role });
  });
  distributed = true;
  activeCallRoles = new Set(roles);
  calledOnce = new Set();
  thiefOffers = new Map();
  updateCallButtons();
  renderMJDashboard();
}

function updateCallButtons() {
  const grid = document.getElementById('calls-grid');
  grid.querySelectorAll('[data-role]').forEach((btn) => {
    const show = distributed && activeCallRoles.has(btn.dataset.role);
    btn.style.display = show ? '' : 'none';
    const once = btn.dataset.call;
    const used = !!once && calledOnce.has(once);
    btn.disabled = used;
    btn.classList.toggle('used', used);
  });
}

function renderMJDashboard() {
  const tbody = document.getElementById('mj-table-body');
  let html = players.map((item, index) => `
    <tr>
      <td><strong class="nom-joueur">${escapeHtml(item.name)}</strong> ${item.connected ? '' : '📴'}</td>
      <td>🎭 ${escapeHtml(item.role)}</td>
      <td>
        <label style="cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <input type="checkbox" ${item.inLove ? 'checked' : ''} onchange="togglePlayerLove(${index})">
          💘
        </label>
      </td>
      <td>
        <button class="status-btn ${item.alive ? 'status-alive' : 'status-dead'}" onclick="togglePlayerStatus(${index})">
          ${item.alive ? '🟢 En vie' : '💀 Mort'}
        </button>
      </td>
    </tr>
  `).join('');
  tbody.innerHTML = html;
  document.getElementById('mj-dashboard').style.display = 'block';
}

function togglePlayerLove(index) {
  players[index].inLove = !players[index].inLove;
  renderMJDashboard();
}

function togglePlayerStatus(index) {
  const p = players[index];
  p.alive = !p.alive;

  // Si le joueur meurt et est amoureux, l'autre meurt automatiquement
  if (!p.alive && p.inLove) {
    const partner = players.find((pl, i) => i !== index && pl.inLove && pl.alive);
    if (partner) {
      partner.alive = false;
      showToast(`💘 ${partner.name} meurt immédiatement de chagrin pour avoir perdu son amour !`, 'info');
    }
  }
  renderMJDashboard();
}

// --- MÉDIAS ---
function setProjectorVideoVolume(vol, duration = 600) {
  sendToProjector({ action: 'setVolume', volume: vol, duration });
}

function playRoleVideo(fileName, mode = 'center') {
  overlayMode = mode;
  currentOverlayFile = fileName;
  sendToProjector({ action: 'playOverlayVideo', url: mediaUrl('video', fileName), mode });
}

function stopRoleVideo() {
  overlayMode = null;
  currentOverlayFile = null;
  sendToProjector({ action: 'stopOverlayVideo' });
}

function playScene(videoId, loop = true) {
  if (!sendToProjector({ action: 'playYTVideo', videoId, loop })) {
    alert("Veuillez d'abord cliquer sur 'Ouvrir l'Écran Secondaire' !");
  }
}

function playNightPhase() { playScene(YT_ID_NUIT); playAudioFile("Appel nuit V2.mp3"); }
function playDayPhase() { playScene(YT_ID_JOUR); playAudioFile("Appel jour V2.mp3"); }
function presentCharacters() { playScene(YT_ID_PRESENTATION, false); }

// --- CONSIGNES & INTERVENTIONS ---
function playCommand(cmd) {
  if (cmd === 'fermer_yeux') playAudioFile("Fermer les yeux.mp3");
  else if (cmd === 'voter_maire') {
    // Le Maire s'affiche en PLEIN ÉCRAN pur, sans recadrage
    playRoleVideo("Maire.mp4", 'fullscreen');
  }
  else if (cmd === 'voter') playAudioFile("Voter.mp3");
}

function playRenardResponse(isPositive) {
  playRoleVideo("Renard.mp4", 'center');
  playAudioFile(isPositive ? "Appel Renard oui.mp3" : "Appel Renard non.mp3");
}

function playSorcierePotions(type) {
  playRoleVideo("Sorciere.mp4", 'center');
  if (type === 2) playAudioFile("Sorciere 2 potions.mp3");
  else if (type === 'vie') playAudioFile("Sorciere potion de vie.mp3");
  else if (type === 'mort') playAudioFile("Sorciere potion de mort.mp3");
}

// --- GESTION DES MORTS (VIDÉO) ---
function openDeathModal(mode) {
  currentDeathMode = mode;
  selectedDeathPlayers = [];
  const container = document.getElementById('death-modal-players');
  container.innerHTML = '';
  document.getElementById('death-modal-title').textContent = mode === 'wolves' ? "🐺 Sélectionner les victimes (Loups)" : "🗳️ Sélectionner l'éliminé (Vote)";

  players.forEach(p => {
    if (!p.alive) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-effect';
    btn.textContent = p.name;
    btn.onclick = () => {
      if (mode === 'vote') {
        selectedDeathPlayers = [p.name];
        Array.from(container.children).forEach(b => b.style.backgroundColor = '');
        btn.style.backgroundColor = '#dc2626';
      } else {
        if (selectedDeathPlayers.includes(p.name)) {
          selectedDeathPlayers = selectedDeathPlayers.filter(n => n !== p.name);
          btn.style.backgroundColor = '';
        } else {
          selectedDeathPlayers.push(p.name);
          btn.style.backgroundColor = '#dc2626';
        }
      }
    };
    container.appendChild(btn);
  });
  document.getElementById('death-modal').style.display = 'flex';
}

function closeDeathModal() {
  document.getElementById('death-modal').style.display = 'none';
}

function confirmDeath() {
  if (selectedDeathPlayers.length === 0) return alert("Sélectionnez au moins un joueur !");
  
  const url = currentDeathMode === 'wolves'
    ? "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Mort+Loup.mp4"
    : "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Elimination+2.mp4";

  sendToProjector({
    action: 'playDeath',
    mode: currentDeathMode,
    url: url,
    names: selectedDeathPlayers
  });

  // Tuer les joueurs automatiquement dans la régie
  players.forEach((p, idx) => {
    if (selectedDeathPlayers.includes(p.name) && p.alive) {
      togglePlayerStatus(idx);
    }
  });

  closeDeathModal();
}

function playDeaths(count) {
  const files = ["0 mort.mp3", "1 mort.mp3", "2 morts.mp3", "3 morts.mp3"];
  if (files[count]) playAudioFile(files[count]);
}

// --- AUDIO ---
function playAudioFile(filename) {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  setProjectorVideoVolume(0.25, 400);
  const url = mediaUrl('audio', filename);
  currentAudio = new Audio(url);
  currentAudio.addEventListener('ended', () => setProjectorVideoVolume(1.0, 800));
  currentAudio.play().catch(err => console.warn(err));
}

function stopAllMedia() {
  sendToProjector({ action: 'stop' });
  overlayMode = null; currentOverlayFile = null;
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  setProjectorVideoVolume(1.0, 300);
}

function togglePauseAllMedia() {
  sendToProjector({ action: 'togglePause' });
  if (currentAudio && !currentAudio.ended) {
    if (currentAudio.paused) currentAudio.play(); else currentAudio.pause();
  }
}

// --- APPELS RÔLES ---
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
  if (!item) return;

  playAudioFile(item.audio);
  if (item.video) playRoleVideo(item.video, 'center');

  if (role === 'voleur' || role === 'cupidon') {
    calledOnce.add(role);
    updateCallButtons();
  }
  
  if (role === 'voleur') startThiefTurn();
  if (role === 'cupidon') startCupidonTurn();
}

// --- TOUR CUPIDON ---
function startCupidonTurn() {
  const cupidons = players.filter(p => p.role === 'Cupidon');
  if (cupidons.length === 0) return;
  const aliveNames = players.filter(p => p.alive).map(p => p.name);
  cupidons.forEach(c => {
    if (c.connected && c.conn && c.conn.open) {
      c.conn.send({ type: 'cupidonTurn', players: aliveNames });
      showToast(`🏹 En attente du choix de ${c.name}...`, 'info');
    }
  });
}

function handleCupidonSelect(conn, data) {
  const p1 = data.choices[0];
  const p2 = data.choices[1];
  players.forEach(p => {
    if (p.name === p1 || p.name === p2) p.inLove = true;
  });
  renderMJDashboard();
  showToast(`💘 Cupidon a uni ${p1} et ${p2} !`, 'info');
}

// --- TOUR VOLEUR ---
function buildThiefOffers(thief) {
  const byRole = new Map();
  players.filter(p => p !== thief && p.role && p.role !== 'Voleur').forEach(p => {
    if (!byRole.has(p.role)) byRole.set(p.role, []);
    byRole.get(p.role).push(p);
  });
  const shuffledRoles = [...byRole.keys()].sort(() => 0.5 - Math.random());
  return shuffledRoles.slice(0, 2).map(role => {
    const holders = byRole.get(role);
    return { role, holder: holders[Math.floor(Math.random() * holders.length)].name };
  });
}
function startThiefTurn() {
  players.filter(p => p.role === 'Voleur').forEach(t => {
    const offers = buildThiefOffers(t);
    thiefOffers.set(t.name, offers);
    if (t.connected && t.conn) t.conn.send({ type: 'thiefTurn', options: offers.map(o => o.role) });
  });
}
function handleThiefSteal(conn, data) {
  const thief = players.find(p => p.conn === conn);
  if (!thief || !thiefOffers.has(thief.name)) return;
  
  if (data.skip) {
    thiefOffers.delete(thief.name);
    showToast(`🕵️ ${thief.name} garde son rôle.`, 'info');
  } else {
    const offer = thiefOffers.get(thief.name)[Number(data.choice)];
    const holder = players.find(p => p !== thief && p.name === offer.holder);
    thief.role = offer.role;
    holder.role = 'Villageois';
    if (thief.conn) thief.conn.send({ type: 'assignRole', role: thief.role });
    if (holder.conn) holder.conn.send({ type: 'assignRole', role: holder.role });
    thiefOffers.delete(thief.name);
    renderMJDashboard();
    showToast(`🕵️ ${thief.name} a volé « ${offer.role} » à ${holder.name}.`, 'info');
  }
  conn.send({ type: 'thiefDone' });
}

function playEffect(effect) {
  if (effect === 'hurlement') playAudioFile("Le hurlement du loup 1.mp3");
  else if (effect === 'sorciere') playAudioFile("Effet sorciere.mp3");
}

let toastTimer;
function showToast(msg, kind = 'error') {
  let el = document.getElementById('mj-toast');
  if (!el) { el = document.createElement('div'); el.id = 'mj-toast'; document.body.appendChild(el); }
  el.className = 'toast' + (kind === 'info' ? ' info' : '');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 7000);
}