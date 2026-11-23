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

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
