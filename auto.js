/* MODE AUTOMATIQUE : l'application mène la partie toute seule (appels des personnages, nuit, jour, élection du Maire, votes).
   Option « Le MJ participe » : la régie masque tous les secrets, le MJ joue depuis son téléphone et le Renard est retiré. */
(function () {
  var TICK_MS = 1000;
  var IDLE_MS = 3500;             // silence nécessaire avant de lancer l'étape suivante
  var NIGHT_GAP_MS = 5000;        // battement entre deux scènes de nuit (fin d'un appel → début du suivant)
  var DAY_TO_NIGHT_MS = 9000;     // pause « le village se repose » avant la nuit suivante
  var MODAL_MS = 6000;            // délai avant de valider seul la fenêtre « tous les joueurs sont prêts »
  var REVIEW_MS = 12000;          // temps laissé aux joueurs pour mémoriser leur rôle après le Voleur
  var TURN_FORCE_MS = 75000;      // tour de nuit sans réponse : l'application décide à la place du joueur
  var TURN_ABORT_MS = 150000;     // ... puis passe au tour suivant
  var SPEECH_MS = 180000;         // filet de sécurité : le candidat déclare lui-même la fin de son discours sur son téléphone
  var CANDIDACY_MS = 60000;
  var BALLOT_MS = 60000;
  var VOTE_MS = 180000;           // durée maximale du débat / vote du village
  var HUNTER_MS = 60000;
  var SUCCESSION_MS = 60000;
  var FOX_ANSWER_MS = 4000;

  var A = window.AUTO = {
    on: false, blind: false, paused: false,
    since: {}, idleSince: 0, label: '', mayorT: { phase: null, since: 0, speakerSince: 0 }
  };

  function $(id) { return document.getElementById(id); }
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function has(v) { return v && (v.size === undefined ? true : v.size > 0); }

  // Chronomètre « depuis quand cet état dure-t-il ? » (remis à zéro quand l'état disparaît)
  function since(key, active) {
    if (!active) { delete A.since[key]; return 0; }
    if (!A.since[key]) A.since[key] = Date.now();
    return Date.now() - A.since[key];
  }

  // Joue le rôle d'un joueur absent / muet : les messages vont quand même vers son vrai téléphone
  function asPlayer(p, fn) {
    var prev = p.conn;
    var fake = { open: true, send: function (m) { if (prev && prev.open) { try { prev.send(m); } catch (e) {} } } };
    p.conn = fake;
    try { fn(fake); } finally { p.conn = prev; }
  }

  function isAudioBusy() {
    var a = currentAudio;
    return !!((a && !a.paused && !a.ended && !a.error) || (window.speechSynthesis && window.speechSynthesis.speaking));
  }

  // ---------------------------------------------------------------- UI
  A.setOn = function (v) {
    if (typeof distributed !== 'undefined' && distributed && v !== A.on) { $('auto-on').checked = A.on; return; }
    A.on = !!v;
    var row = $('auto-blind-row'); if (row) row.style.display = A.on ? '' : 'none';
    if (!A.on && A.blind) A.setBlind(false);
    document.body.classList.toggle('auto-on', A.on);
    A.idleSince = 0;
    A.render();
  };

  A.setBlind = function (v) {
    if (typeof distributed !== 'undefined' && distributed && v !== A.blind) { $('auto-blind').checked = A.blind; return; }
    A.blind = !!v && A.on;
    var cb = $('auto-blind'); if (cb) cb.checked = A.blind;
    document.body.classList.toggle('mj-blind', A.blind);
    if (A.blind) {
      var had = roles.indexOf('Renard') !== -1;
      for (var i = roles.length - 1; i >= 0; i--) if (roles[i] === 'Renard') roles.splice(i, 1);
      if (had && typeof showToast === 'function') showToast('🦊 Le Maître du Jeu participe : le rôle du Renard est retiré de la partie.', 'info');
      foxPowerLost = true;
    } else {
      foxPowerLost = false;
    }
    if (typeof updateMJRoleList === 'function') updateMJRoleList();
    A.render();
  };

  A.busy = function () { return busyReason(); };
  A.togglePause = function () { A.paused = !A.paused; A.idleSince = 0; A.render(); };
  A.skip = function () { A.idleSince = Date.now() - 100000; A.step(true); };

  function setLabel(t) { A.label = t; var el = $('auto-status-text'); if (el) el.textContent = t; }

  A.render = function () {
    var card = $('auto-status-card');
    var show = A.on && typeof distributed !== 'undefined' && distributed;
    if (card) card.style.display = show ? '' : 'none';
    var p = $('auto-pause-btn'); if (p) p.textContent = A.paused ? '▶ Reprendre' : '⏸ Pause';
    var lock = typeof distributed !== 'undefined' && distributed;
    var a = $('auto-on'), b = $('auto-blind');
    if (a) a.disabled = lock; if (b) b.disabled = lock;
  };

  // ------------------------------------------------- libellés (sans rôle en mode « le MJ participe »)
  function describe(reason) {
    if (A.paused) return '⏸ Pause : la partie est suspendue.';
    if (typeof gameOver !== 'undefined' && gameOver) return '🏁 Partie terminée.';
    if (!projectorOpen()) return '📺 Ouvrez l\'écran secondaire (ou le lien TV) : la partie démarrera ensuite.';
    if (!allSeenShown) return '⏳ En attente : tous les joueurs doivent prendre connaissance de leur rôle.';
    if (mayorVote.open) return '👑 Élection du Maire en cours…';
    if (villageVote.open) return '☀️ Le village débat et vote…';
    if (A.blind) return currentPhase === 'night' ? '🌙 La nuit est tombée…' : '☀️ Le jour est levé…';
    return reason ? ('🤖 ' + reason) : '🤖 Étape suivante dans un instant…';
  }

  // ---------------------------------------------------------------- gestion automatique de l'élection du Maire
  function randomMayor() {
    var al = alivePlayers();
    if (!al.length) return;
    var pick = rnd(al).name;
    if (mayorVote.open) closeMayorVote(true);
    selection.mayor = new Set([pick]);
    announceMayor();
  }

  function mayorAuto() {
    if (!mayorVote.open) { A.mayorT.phase = null; return false; }
    var now = Date.now();
    if (A.mayorT.phase !== mayorVote.phase) A.mayorT = { phase: mayorVote.phase, since: now, speakerSince: now };
    var el = now - A.mayorT.since;
    if (rps) return true;
    if (mayorVote.phase === 'candidacy') {
      if (el > CANDIDACY_MS) {
        if (mayorCandidatesNow().length) closeCandidacy();
        else if (el > CANDIDACY_MS + 30000) randomMayor();
      }
    } else if (mayorVote.phase === 'speech') {
      var next = mayorVote.candidates.filter(function (n) { return !mayorVote.spoke.has(n); })[0];
      var speakerEl = now - A.mayorT.speakerSince;
      if (!mayorVote.speaker) {
        if (next) { setMayorSpeaker(next); A.mayorT.speakerSince = now; }
        else startMayorBallot();
      } else if (speakerEl > SPEECH_MS || A.speechDone === mayorVote.speaker) {
        A.speechDone = null;
        if (next) { setMayorSpeaker(next); A.mayorT.speakerSince = now; }
        else { endMayorSpeech(); startMayorBallot(); }
      }
    } else if (mayorVote.phase === 'vote') {
      if (el > BALLOT_MS) {
        resolveMayorVote();
        if (!rps && selection.mayor.size !== 1 && !mayor) randomMayor();
        else if (!rps && selection.mayor.size !== 1) { /* Maire déjà désigné */ }
      }
    }
    return true;
  }

  // ---------------------------------------------------------------- vote du village
  function villageAuto() {
    var el = since('village', villageVote.open);
    if (!villageVote.open || el < VOTE_MS) return;
    var names = topOf(villageTally(villageVote.votes)).names;
    resolveVillageVote();
    if (!rps && selection.vote.size !== 1 && names.length > 1) {
      selection.vote = new Set([rnd(names)]);
      announceKillEvent('vote', { auto: true });
    }
  }

  // ---------------------------------------------------------------- tours de nuit bloqués : l'application décide à la place du joueur
  function forceTurns() {
    var turnEl = since('turn', !!autoTurnSince);
    if (!autoTurnSince) delete A.since.forced;
    var role = currentTurnRole;
    if (turnEl > TURN_FORCE_MS && !A.since.forced) {
      A.since.forced = Date.now();
      try {
        if (role === 'Cupidon' && has(cupidWaiting)) {
          var al = alivePlayers().slice().sort(function () { return Math.random() - 0.5; });
          var c = players.find(function (p) { return cupidWaiting.has(p.name); });
          if (c && al.length >= 2) asPlayer(c, function (f) { handleCupidChoice(f, { names: [al[0].name, al[1].name] }); });
        } else if (role === 'Voyante' && has(seerWaiting)) {
          var s = players.find(function (p) { return seerWaiting.has(p.name); });
          var tg = s && rnd(alivePlayers().filter(function (p) { return p !== s; }));
          if (s && tg) asPlayer(s, function (f) { handleSeerChoice(f, { target: tg.name }); });
        } else if (role === 'Loup-Garou' && wolvesOpen) {
          closeWolfVote();
        } else if (role === 'Sorcière' && has(witchWaiting)) {
          players.filter(function (p) { return witchWaiting.has(p.name); }).forEach(function (w) { asPlayer(w, function (f) { handleWitchAction(f, {}); }); });
        } else if (role === 'Voleur' && has(thiefOffers)) {
          players.filter(function (p) { return thiefOffers.has(p.name); }).forEach(function (t) { asPlayer(t, function (f) { handleThiefSteal(f, { choice: 0 }); }); });
        }
      } catch (e) { console.warn('Tour forcé :', e); }
    }
    // Voyante : résultat vu mais jamais refermé
    if (role === 'Voyante' && has(seerResults) && turnEl > TURN_FORCE_MS + 8000) {
      players.filter(function (p) { return seerResults.has(p.name) && !seerAcked.has(p.name); }).forEach(function (s) { asPlayer(s, function (f) { handleSeerClosed(f); }); });
    }
    if (turnEl > TURN_ABORT_MS) {            // dernier recours : on passe au tour suivant
      cupidWaiting.clear(); seerWaiting.clear(); witchWaiting.clear(); foxWaiting.clear();
      wolvesOpen = false;
      if (role !== 'Voleur') thiefOffers.clear();
      scheduleCloseEyes(0);
    }
  }

  function foxAuto() {
    if (!has(foxChoices)) return;
    var f = players.find(function (p) { return p.role === 'Renard' && foxChoices.has(p.name) && !foxAnswered.has(p.name); });
    if (!f) return;
    if (since('fox', true) < FOX_ANSWER_MS) return;
    delete A.since.fox;
    var t = findPlayer(foxChoices.get(f.name));
    var idx = players.indexOf(t);
    // groupe désigné : le joueur et ses deux voisins
    var group = [t];
    if (idx >= 0 && players.length > 2) { group.push(players[(idx + 1) % players.length]); group.push(players[(idx + players.length - 1) % players.length]); }
    var yes = group.some(function (p) { return p && p.alive && p.role === 'Loup-Garou'; });
    if (t && t.role === 'Loup-Garou') yes = true;
    closeFoxModal();
    playRenardResponse(yes);
  }

  function hunterAuto() {
    if (hunterPending && !hunterChoice) {
      if (since('hunter', true) > HUNTER_MS) {
        var h = findPlayer(hunterPending), t = rnd(alivePlayers());
        if (h && t) asPlayer(h, function (f) { handleHunterShot(f, { target: t.name }); });
      }
    } else since('hunter', false);
    if (successionPending) {
      if (since('succ', true) > SUCCESSION_MS) {
        var d = findPlayer(successionPending), n = rnd(alivePlayers());
        if (d && n) asPlayer(d, function (f) { handleMayorSuccessor(f, { target: n.name }); });
      }
    } else since('succ', false);
  }

  // ---------------------------------------------------------------- occupé ?
  function busyReason() {
    if (!distributed || !allSeenShown) return 'attente';
    if (reviewMode) return 'revue des rôles';
    if (isAudioBusy()) return 'son en cours';
    if (typeof thiefCallTimer !== 'undefined' && thiefCallTimer) return 'appel';
    if (autoTurnSince) return 'tour en cours';
    if (has(cupidWaiting) || has(seerWaiting) || has(witchWaiting) || has(foxWaiting) || wolvesOpen || has(thiefOffers)) return 'tour en cours';
    if (has(foxChoices) && players.some(function (p) { return p.role === 'Renard' && foxChoices.has(p.name) && !foxAnswered.has(p.name); })) return 'Renard';
    if (hunterPending || hunterState || successionPending || rps || mayorVote.open || villageVote.open || dayQueue) return 'événement';
    if ((selection.mayor.size === 1 && !mayor) || (selection.vote.size === 1 && !villageVote.open)) return 'annonce à venir';
    if (eventInFlight && Date.now() - eventInFlight < 60000) return 'annonce';
    if (Date.now() < mayorAnnounceUntil) return 'annonce du Maire';
    if (victoryPending || gameOver) return 'fin';
    return '';
  }

  function nameOfNext() {
    var k = nextCallKey;
    if (!k) return '';
    return ({ voleur: 'appel du Voleur', nuit: 'la nuit tombe', jour: 'le jour se lève', cupidon: 'appel de Cupidon', voyante: 'appel de la Voyante', renard: 'appel du Renard', loups: 'appel des Loups-Garous', sorciere: 'appel de la Sorcière' })[k] || k;
  }

  // ---------------------------------------------------------------- étape suivante
  A.step = function (force) {
    if (!projectorOpen()) return;
    // Départ : le Maire est appelé en premier
    if (!gameStarted) {
      if (allSeenShown && !mayorCalled) { setLabel('👑 Appel du Maire'); playCommand('voter_maire'); }
      return;
    }
    if (nextCallKey) {
      var k = nextCallKey;
      if (k === 'nuit') playNightPhase();
      else if (k === 'jour') playDayPhase();
      else playRole(k);
      return;
    }
    if (currentPhase === 'night') {
      var nx = nextRoleToCall();
      if (nx) playRole(nx.key); else playDayPhase();
      return;
    }
    if (currentPhase === 'day' && mayorCalled && !villageVote.open && !mayorVote.open && !gameOver) {
      playNightPhase();           // le village s'est reposé : nuit suivante
    }
  };

  // ---------------------------------------------------------------- boucle principale
  A.tick = function () {
    if (!A.on || typeof distributed === 'undefined') return;
    A.render();
    if (!distributed) return;
    if (gameOver) { setLabel(describe()); return; }

    // fenêtre « tous les joueurs sont prêts » : validée toute seule
    var modal = $('all-seen-modal');
    if (!A.paused && modal) {
      var wait = reviewMode ? REVIEW_MS : MODAL_MS;
      if (since('modal', true) > wait) { delete A.since.modal; if (reviewMode) confirmRoleReview(); else closeAllSeenModal(); }
      setLabel(describe());
      return;
    }
    since('modal', false);
    if (A.paused) { setLabel(describe()); return; }

    // un son en attente (ex. « Fermez les yeux ») qui n'a plus de voix devant lui est lancé tout de suite
    if (afterAudio && !isAudioBusy()) { var pend = afterAudio; afterAudio = null; playAudioFile(pend); }

    forceTurns();
    foxAuto();
    hunterAuto();
    villageAuto();
    if (mayorAuto()) { setLabel(describe()); return; }

    var reason = busyReason();
    if (reason) { A.idleSince = 0; setLabel(describe(reason === 'attente' ? '' : '')); return; }

    if (!A.idleSince) A.idleSince = Date.now();
    var need = (gameStarted && currentPhase === 'day' && !nextCallKey) ? DAY_TO_NIGHT_MS : (currentPhase === 'night' ? NIGHT_GAP_MS : IDLE_MS);
    var left = need - (Date.now() - A.idleSince);
    if (left > 0) { setLabel(describe(A.blind ? '' : (nameOfNext() ? 'Prochaine étape : ' + nameOfNext() : 'Étape suivante dans ' + Math.ceil(left / 1000) + ' s'))); return; }
    A.idleSince = 0;
    A.step(false);
  };

  setInterval(function () { try { A.tick(); } catch (e) { console.warn('Mode automatique :', e); } }, TICK_MS);
})();
