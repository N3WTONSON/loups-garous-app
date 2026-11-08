// Fond animé : vidéo de village (nuit par défaut, jour pour les scènes de jour). Fichiers locaux.
(function () {
  // fonds locaux : assets/video/fond-village-nuit.mp4 / fond-village-jour.mp4 (chemins résolus à la demande, assets.js peut être chargé après ce fichier)
  function files() { return { night: window.mediaUrl("video", "fond-village-nuit.mp4"), day: window.mediaUrl("video", "fond-village-jour.mp4") }; }
  Object.defineProperty(window, "BG_URLS", { get: function () { var f = files(); return [f.night, f.day]; } });
  var current = null;
  var video = null;

  function build() {
    if (video || !document.body) return;
    var shade = document.createElement("div");
    shade.id = "bg-shade";
    shade.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at center, rgba(37,99,235,0.12) 0%, rgba(11,13,20,0.55) 100%);";
    video = document.createElement("video");
    video.id = "bg-video";
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.style.cssText = "position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;pointer-events:none;";
    video.onerror = function () { console.warn("Fond vidéo introuvable :", video.src); };
    document.body.insertBefore(shade, document.body.firstChild);
    document.body.insertBefore(video, document.body.firstChild);
    window.setBgPhase(current || "night");
  }

  window.setBgPhase = function (phase) {
    phase = phase === "day" ? "day" : "night";
    if (video && current === phase) return;
    current = phase;
    if (!video) return;
    video.src = files()[phase];
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
