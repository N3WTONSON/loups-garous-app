// ===== Mode « vidéoprojecteur autonome » (application Android / ?tv=1) =====
// La régie tourne en interne (masquée) en mode automatique, sans Maître du Jeu ; l'écran public (projecteur.html) occupe tout l'écran.
// Les rôles se règlent et la partie se lance à la télécommande (boutons à grande taille, navigation aux flèches + OK).
(function () {
  if (!/(^|[?&])tv=/.test(location.search)) return;
  var $ = function (id) { return document.getElementById(id); };
  document.body.classList.add('tv-mode');

  // --- écran public intégré (la régie lui parle par postMessage, comme à une fenêtre ouverte) ---
  var frame = document.createElement('iframe');
  frame.id = 'tv-proj'; frame.className = 'tv-keep';
  frame.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
  frame.src = 'projecteur.html?v=104&tv=1';
  document.body.appendChild(frame);
  projectorWindow = frame.contentWindow;

  var SPECIALS = [
    { r: 'Voyante', ico: '🔮', on: true }, { r: 'Sorcière', ico: '🧪', on: true }, { r: 'Chasseur', ico: '🏹', on: true },
    { r: 'Cupidon', ico: '💘', on: true }, { r: 'Petite Fille', ico: '👧', on: false }, { r: 'Voleur', ico: '🕵️', on: false }, { r: 'Renard', ico: '🦊', on: false }
  ];

  var ui = document.createElement('div');
  ui.id = 'tv-ui'; ui.className = 'tv-keep';
  ui.innerHTML =
    
    '<div class="tv-toggles" id="tv-toggles"></div>' +
    '<div class="tv-row"><div id="tv-status" class="tv-status"></div><button type="button" id="tv-go" class="tv-go">▶ Lancer la partie</button></div>' +
    '<div class="tv-help">Flèches : se déplacer · OK : choisir · Les joueurs scannent le QR code avec leur téléphone</div>';
  document.body.appendChild(ui);

  var tg = $('tv-toggles');
  SPECIALS.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tv-tog'; b.dataset.role = s.r;
    b.addEventListener('click', function () { s.on = !s.on; refresh(); });
    s.el = b; tg.appendChild(b);
  });

  function wolvesFor(n) { return Math.max(1, Math.min(Math.round(n / 4), Math.ceil(n / 2) - 1)); }

  function compose(n) {
    var w = wolvesFor(n), out = [];
    for (var i = 0; i < w; i++) out.push('Loup-Garou');
    var room = Math.max(0, n - w - 1);                  // il faut plus de villageois (rôles spéciaux inclus) que de loups
    SPECIALS.filter(function (s) { return s.on; }).slice(0, room).forEach(function (s) { out.push(s.r); });
    while (out.length < n) out.push('Villageois');
    return out;
  }

  function nPlayers() { return players.filter(function (p) { return p.connected !== false; }).length; }

  // messages (à la place des fenêtres d'alerte) : affichés dans la barre
  var msgText = '', msgUntil = 0;
  window.alert = function (m) { msgText = String(m); msgUntil = Date.now() + 8000; refresh(); };

  // le salon est créé tout seul au lancement (pas de bouton « Créer un salon » ici) ; on réessaie tant que la connexion échoue
  var hostTries = 0, hostSince = 0;
  function ensureHost() {
    if (hostOpened || started) return;
    if (hostSince && Date.now() - hostSince < 12000) return;
    hostSince = Date.now(); hostTries++;
    try { if (typeof Peer === 'undefined') throw new Error('PeerJS indisponible'); initHost(); }
    catch (e) { console.warn('Création du salon :', e); }
  }
  setInterval(ensureHost, 2000);
  setTimeout(ensureHost, 300);

  function refresh() {
    if (!hostOpened) {
      $('tv-status').textContent = hostTries > 1 ? '⏳ Création du salon… vérifiez la connexion Internet du projecteur (tentative ' + hostTries + ')' : '⏳ Création du salon…';
      $('tv-go').disabled = true;
      SPECIALS.forEach(function (s) { s.el.textContent = s.ico + ' ' + s.r + ' : ' + (s.on ? 'OUI' : 'NON'); s.el.classList.toggle('on', s.on); });
      return;
    }
    var n = nPlayers(), enough = n >= 4;
    SPECIALS.forEach(function (s) {
      s.el.textContent = s.ico + ' ' + s.r + ' : ' + (s.on ? 'OUI' : 'NON');
      s.el.classList.toggle('on', s.on);
    });
    var st = $('tv-status'), go = $('tv-go');
    var comp = compose(Math.max(n, 4)), inGame = comp.filter(function (r) { return r !== 'Loup-Garou' && r !== 'Villageois'; }).length;
    var skipped = SPECIALS.filter(function (s) { return s.on; }).length - inGame;
    st.textContent = 'Salon ' + roomCode + ' · ' + n + ' joueur' + (n > 1 ? 's' : '') + ' connecté' + (n > 1 ? 's' : '') + (enough ? ' · ' + wolvesFor(n) + ' Loup' + (wolvesFor(n) > 1 ? 's' : '') + '-Garou' + (wolvesFor(n) > 1 ? 's' : '') : ' · minimum 4 pour commencer') + (enough && skipped > 0 ? ' · ' + skipped + ' rôle(s) ignoré(s) (pas assez de joueurs)' : '');
    if (msgText && Date.now() < msgUntil) st.textContent = '⚠️ ' + msgText;
    go.disabled = !enough;
  }

  var started = false;
  $('tv-go').addEventListener('click', function () {
    if (started) return;
    var n = nPlayers();
    if (n < 4) return;
    started = true;
    try {
      roles.length = 0;
      compose(players.length).forEach(function (r) { roles.push(r); });
      updateMJRoleList();
      if (!(window.AUTO && AUTO.on)) AUTO.setOn(true);
      distributeRolesNetwork();
      if (!distributed) { started = false; return; }
    } catch (e) { started = false; console.warn(e); return; }
    ui.style.display = 'none';
  });

  setInterval(function () {
    if (!started) refresh();
    else if (typeof gameOver !== 'undefined' && gameOver && !$('tv-again')) {
      setTimeout(function () {
        if ($('tv-again')) return;
        var b = document.createElement('button');
        b.id = 'tv-again'; b.type = 'button'; b.className = 'tv-keep tv-go'; b.textContent = '🔄 Nouvelle partie';
        b.addEventListener('click', function () { location.reload(); });
        document.body.appendChild(b); b.focus();
      }, 14000);
    }
  }, 1000);
  refresh();
  setTimeout(function () { var g = $('tv-go'); if (g) g.focus(); }, 800);
})();
