// Theme toggle, mobile menu, copy-email button.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var themeBtn = document.getElementById("theme-toggle");
    function paint() {
      if (!themeBtn) return;
      themeBtn.textContent = isDark() ? "☀" : "☾";
      themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
    }
    paint();
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });

    var menuBtn = document.getElementById("menu-toggle");
    var links = document.getElementById("nav-links");
    if (menuBtn && links) menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var label = btn.textContent;
        function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 1800); }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done(text); });
        } else { done(text); }
      });
    });

    // Looping slideshows: <div class="slideshow" data-interval="ms"> with .slide figures
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".slideshow").forEach(function (show) {
      var slides = show.querySelectorAll(".slide");
      var caption = show.querySelector(".slide-caption");
      var count = show.querySelector(".slide-count");
      var interval = parseInt(show.getAttribute("data-interval"), 10) || 4500;
      var i = 0, timer = null, paused = false;
      if (slides.length < 2) return;
      // Images marked data-src load only when their slide (or the next one) is about to show
      function prime(k) {
        var img = slides[(k + slides.length) % slides.length].querySelector("img[data-src]");
        if (img) { img.src = img.getAttribute("data-src"); img.removeAttribute("data-src"); }
      }
      prime(0); prime(1);
      // A video slide plays to the end, then the show moves on; leaving it pauses the video
      function videoOf(k) { return slides[k].querySelector("video"); }
      function playIfVideo() {
        var v = videoOf(i);
        if (!v || reduceMotion) return;
        try { v.currentTime = 0; } catch (e) {}
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      }
      slides.forEach(function (s, k) {
        var v = s.querySelector("video");
        if (v) v.addEventListener("ended", function () { if (k === i && !paused) { go(i + 1); start(); } });
      });
      function go(n) {
        var old = videoOf(i); if (old) old.pause();
        slides[i].classList.remove("is-active");
        i = (n + slides.length) % slides.length;
        prime(i); prime(i + 1);
        slides[i].classList.add("is-active");
        if (caption) caption.textContent = slides[i].getAttribute("data-caption") || "";
        if (count) count.textContent = (i + 1) + " / " + slides.length;
        playIfVideo();
      }
      function start() {
        stop();
        if (reduceMotion || paused || videoOf(i)) return;   // videos advance on "ended"
        timer = setInterval(function () { go(i + 1); if (videoOf(i)) stop(); }, interval);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      show.querySelectorAll(".slide-btn").forEach(function (b) {
        b.addEventListener("click", function () { go(i + parseInt(b.getAttribute("data-dir"), 10)); start(); });
      });
      show.addEventListener("mouseenter", function () { paused = true; stop(); });
      show.addEventListener("mouseleave", function () { paused = false; start(); });
      show.addEventListener("focusin", function () { paused = true; stop(); });
      show.addEventListener("focusout", function () { paused = false; start(); });
      document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
      playIfVideo();
      start();
    });

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
