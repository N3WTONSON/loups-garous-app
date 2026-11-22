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
  frame.src = 'projecteur.html?v=123&tv=1';
  var projLoaded = false;
  frame.addEventListener('load', function () { setTimeout(function () { projLoaded = true; refresh(); }, 1500); });
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

  function wolvesFor(n) { return wolvesCount(n); }

  function compose(n) {
    var w = wolvesFor(n), out = [];
    for (var i = 0; i < w; i++) out.push('Loup-Garou');
    var room = Math.max(0, n - w - 1);                  // il faut plus de villageois (rôles spéciaux inclus) que de loups
    SPECIALS.filter(function (s) { return s.on; }).slice(0, room).forEach(function (s) { out.push(s.r); });
    while (out.length < n) out.push('Villageois');
    return out;
  }

  function nPlayers() { return players.filter(function (p) { return p.connected !== false; }).length; }

  // --- écran de chargement : tous les médias (sons, musiques, vidéos, images) sont chargés avant d'ouvrir le salon ---
  var TIPS = [
    '🐺 Les Loups-Garous se reconnaissent la première nuit : chaque nuit, ils choisissent ensemble une victime.',
    '🔮 La Voyante découvre chaque nuit le vrai rôle d\'un joueur. Discrétion : les loups la cherchent.',
    '🧪 La Sorcière possède deux potions pour toute la partie : une pour sauver, une pour tuer.',
    '🏹 Le Chasseur, en mourant, emporte immédiatement un joueur de son choix avec lui.',
    '💘 Cupidon unit deux amoureux : si l\'un meurt, l\'autre meurt de chagrin.',
    '👑 La voix du Maire compte double lors du vote du village.',
    '🦊 Le Renard flaire si un Loup-Garou se cache parmi trois joueurs voisins.',
    '👧 La Petite Fille peut espionner les loups… à ses risques et périls.',
    '🕵️ Le Voleur peut échanger sa carte contre l\'une des deux cartes restantes.',
    '📱 Gardez votre téléphone allumé et la page ouverte : votre rôle s\'y affiche en secret.',
    '🤫 La nuit, tout le monde ferme les yeux : seuls les rôles appelés se réveillent.'
  ];
  var ld = document.createElement('div');
  ld.id = 'tv-loading'; ld.className = 'tv-keep';
  ld.innerHTML =
    '<div class="tvl-glow"></div>' +
    '<img class="tvl-logo" src="logo-carnage.png" alt="Les Loups-Garous : Le Carnage">' +
    '<div class="tvl-bar"><i id="tvl-fill"></i></div>' +
    '<div class="tvl-pct" id="tvl-pct">0 %</div>' +
    '<div class="tvl-txt" id="tvl-txt">Préparation de la partie…</div>' +
    '<div class="tvl-tip" id="tvl-tip"></div>';
  document.body.appendChild(ld);
  var tipI = Math.floor(Math.random() * TIPS.length);
  function nextTip() { var t = $('tvl-tip'); t.classList.remove('show'); setTimeout(function () { t.textContent = TIPS[tipI++ % TIPS.length]; t.classList.add('show'); }, 450); }
  nextTip();
  var tipTimer = setInterval(nextTip, 6000);

  var load = { ready: false, pct: 0, failed: [] };
  function hideLoading() {
    clearInterval(tipTimer);
    ld.classList.add('done');
    setTimeout(function () { ld.style.display = 'none'; var g = $('tv-go'); if (g) g.focus(); }, 900);
  }
  function showLoad(st) {
    load.pct = st.total ? Math.round(st.done * 100 / st.total) : 100;
    load.failed = st.failed;
    $('tvl-fill').style.width = load.pct + '%';
    $('tvl-pct').textContent = load.pct + ' %';
    if (!st.ready) { $('tvl-txt').textContent = 'Chargement des sons et des vidéos · ' + st.done + ' / ' + st.total + (st.bytes ? ' · ' + (st.bytes / 1048576).toFixed(0) + ' Mo' : ''); return; }
    if (load.ready) return;
    load.ready = true;
    if (st.failed.length) {
      $('tvl-txt').textContent = '⚠️ ' + st.failed.length + ' média(s) non chargé(s) : la partie peut quand même démarrer';
      msgText = st.failed.length + ' média(s) non chargé(s) : ' + st.failed.slice(0, 3).join(', '); msgUntil = Date.now() + 12000;
      setTimeout(hideLoading, 2500);
    } else {
      $('tvl-txt').textContent = '✅ Tout est prêt';
      setTimeout(hideLoading, 700);
    }
    refresh();
  }
  setTimeout(function () {
    if (!window.LG || !LG.preloadAll) { showLoad({ done: 1, total: 1, failed: [], bytes: 0, ready: true }); return; }
    LG.preloadAll(showLoad).catch(function (e) { console.warn(e); showLoad({ done: 1, total: 1, failed: [], bytes: 0, ready: true }); });
  }, 400);

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
    if (enough && !load.ready) st.textContent += ' · ⏳ chargement ' + load.pct + ' %';
    else if (enough && !projLoaded) st.textContent += ' · ⏳ écran en préparation';
    if (msgText && Date.now() < msgUntil) st.textContent = '⚠️ ' + msgText;
    go.disabled = !enough || !load.ready || !projLoaded;
    go.textContent = load.ready ? '▶ Lancer la partie' : '⏳ Chargement ' + load.pct + ' %';
  }

  var started = false;
  $('tv-go').addEventListener('click', function () {
    if (started) return;
    var n = nPlayers();
    if (n < 4 || !load.ready || !projLoaded) return;
    started = true;
    // le son est débloqué dans le même appui sur OK : régie (voix, musiques) ET écran public intégré
    try { var pw = frame.contentWindow; pw.dispatchEvent(new KeyboardEvent('keydown', { key: 'Unidentified' })); } catch (e) {}
    try { var s0 = new Audio(); s0.muted = true; var pr = s0.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {}
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
    // sécurité : dès que les rôles sont distribués, la barre de réglage disparaît (aucun réglage pendant la partie)
    if (typeof distributed !== 'undefined' && distributed && ui.style.display !== 'none') { started = true; ui.style.display = 'none'; }
    if (!started) refresh();
    else if (typeof gameOver !== 'undefined' && gameOver && !$('tv-again')) {
      setTimeout(function () {
        if ($('tv-again')) return;
        var b = document.createElement('button');
        b.id = 'tv-again'; b.type = 'button'; b.className = 'tv-keep tv-go'; b.textContent = '🔄 Nouvelle partie';
        b.addEventListener('click', function () {
          // même salon, mêmes joueurs : retour à l'écran du QR code, puis « Lancer la partie »
          b.remove();
          try { newGameSameRoom(); } catch (e) { location.reload(); return; }
          started = false;
          projLoaded = false;
          try { frame.contentWindow.location.reload(); } catch (e) {}
          setTimeout(function () { try { syncLobbyToProjector(); } catch (e) {} }, 1800);
          ui.style.display = '';
          refresh();
          setTimeout(function () { var g = $('tv-go'); if (g) g.focus(); }, 300);
        });
        document.body.appendChild(b); b.focus();
      }, 14000);
    }
  }, 1000);
  refresh();
  setTimeout(function () { var g = $('tv-go'); if (g) g.focus(); }, 800);
})();
