/* Préchargement complet des médias AVANT le début de la partie.
   Tous les sons, musiques, images et vidéos sont téléchargés une fois et gardés en mémoire (Cache Storage,
   le même que celui du service worker) : pendant la partie, rien n'est plus attendu du réseau.
   Usage : LG.preloadAll(function (st) { ... }).then(function (st) { ... })
   st = { done, total, failed, bytes, ready } */
(function () {
  window.LG = window.LG || {};
  var CACHE = 'lg-media-v1';            // même nom que dans sw.js
  var CONCURRENCY = 3, RETRIES = 3, STALL_MS = 20000;

  function allUrls() {
    var A = window.ASSETS || {}, list = [];
    ['audio', 'music', 'images', 'video'].forEach(function (k) {
      Object.keys(A[k] || {}).forEach(function (n) { list.push(A[k][n]); });
    });
    var S = window.SCENE_URLS || {};
    Object.keys(S).forEach(function (n) { list.push(S[n]); });
    var seen = {}, out = [];
    list.forEach(function (u) {
      if (!u) return;
      var abs = new URL(u, location.href).href;
      if (!seen[abs]) { seen[abs] = 1; out.push(abs); }
    });
    return out;
  }

  // un fichier : déjà en mémoire ? sinon téléchargement complet (avec reprise si le réseau cale)
  function fetchOne(cache, url, onBytes) {
    var attempt = 0;
    function go() {
      attempt++;
      var ctrl = window.AbortController ? new AbortController() : null;
      var stall = null;
      function arm() { clearTimeout(stall); stall = setTimeout(function () { if (ctrl) ctrl.abort(); }, STALL_MS); }
      arm();
      return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var copy = navigator.serviceWorker && navigator.serviceWorker.controller ? null : res.clone();   // sans service worker actif : on range nous-mêmes
        var put = copy ? cache.put(url, copy) : Promise.resolve();
        if (!res.body || !res.body.getReader) return res.arrayBuffer().then(function (b) { onBytes(b.byteLength); return put; });
        var reader = res.body.getReader();
        function pump() {
          return reader.read().then(function (r) {
            arm();
            if (r.done) return put;
            onBytes(r.value.byteLength);
            return pump();
          });
        }
        return pump();
      }).then(function () { clearTimeout(stall); }, function (err) {
        clearTimeout(stall);
        if (attempt >= RETRIES) throw err;
        return new Promise(function (r) { setTimeout(r, 1500 * attempt); }).then(go);
      });
    }
    return cache.match(url).then(function (hit) { return hit ? 'hit' : go(); });
  }

  var running = null;
  LG.preloadAll = function (onProgress) {
    if (running) { if (onProgress) running.listeners.push(onProgress); return running.promise; }
    var urls = allUrls();
    var st = { done: 0, total: urls.length, failed: [], bytes: 0, ready: false };
    var listeners = onProgress ? [onProgress] : [];
    function emit() { listeners.forEach(function (f) { try { f(st); } catch (e) {} }); }
    running = { listeners: listeners };
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    running.promise = (window.caches ? caches.open(CACHE) : Promise.reject(new Error('no cache'))).then(function (cache) {
      var queue = urls.slice();
      function worker() {
        var u = queue.shift();
        if (!u) return Promise.resolve();
        return fetchOne(cache, u, function (n) { st.bytes += n; emit(); })
          .catch(function (e) { console.warn('Préchargement impossible :', u, e); st.failed.push(decodeURIComponent(u.split('/').pop())); })
          .then(function () { st.done++; emit(); return worker(); });
      }
      var ws = [];
      for (var i = 0; i < CONCURRENCY; i++) ws.push(worker());
      return Promise.all(ws);
    }, function () {
      // pas de Cache Storage (navigateur très ancien) : on laisse le cache HTTP faire le travail
      return Promise.all(urls.map(function (u) { return fetch(u).then(function (r) { return r.arrayBuffer(); }).catch(function () {}); })).then(function () { st.done = st.total; });
    }).then(function () { st.ready = true; emit(); return st; });
    emit();
    return running.promise;
  };
})();
