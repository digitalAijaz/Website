// Apps page: keep every card on the newest installer.
// The page ships with the versions known when it was last edited. On load it reads the
// release list of digitalAijaz/AijazLabs-Installers and, for each app, swaps in the
// highest "<App>-Setup-<version>.exe" found, so a new release replaces the old link.
(function () {
  var API = "https://api.github.com/repos/digitalAijaz/AijazLabs-Installers/releases?per_page=100";
  var SETUP = /^(Aijaz[A-Za-z0-9]+)-Setup-(\d+(?:\.\d+)*)\.exe$/;

  function newer(a, b) {            // true if version a > version b
    var x = a.split("."), y = b.split(".");
    for (var k = 0; k < Math.max(x.length, y.length); k++) {
      var d = (parseInt(x[k], 10) || 0) - (parseInt(y[k], 10) || 0);
      if (d) return d > 0;
    }
    return false;
  }
  function mb(bytes) { return Math.max(1, Math.round(bytes / 1e6)) + " MB"; }
  function label(key) { return key.replace(/^Aijaz/, "").replace(/([a-z])([A-Z])/g, "$1 $2"); }

  function newCard(key) {
    var el = document.createElement("article");
    el.className = "card app-card";
    el.setAttribute("data-app", key);
    el.innerHTML =
      '<div class="app-head"><span class="app-tile" aria-hidden="true"></span>' +
      '<div><h3></h3><span class="meta app-ver"></span></div></div>' +
      '<p>New from AijazLabs.</p>' +
      '<a class="btn btn-primary app-dl">Download for Windows</a>';
    el.querySelector("h3").textContent = label(key);
    el.querySelector(".app-tile").textContent = label(key).charAt(0);
    return el;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("app-grid");
    if (!grid || !window.fetch) return;
    fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (releases) {
        var best = {};
        releases.forEach(function (rel) {
          if (rel.draft || rel.prerelease) return;
          (rel.assets || []).forEach(function (a) {
            var m = SETUP.exec(a.name);
            if (!m) return;
            var cur = best[m[1]];
            if (!cur || newer(m[2], cur.version)) best[m[1]] = { version: m[2], url: a.browser_download_url, size: a.size };
          });
        });
        Object.keys(best).forEach(function (key) {
          var card = grid.querySelector('[data-app="' + key + '"]');
          if (!card) { card = newCard(key); grid.appendChild(card); }
          var b = best[key];
          card.querySelector(".app-ver").textContent = "v" + b.version + " · " + mb(b.size);
          card.querySelector(".app-dl").href = b.url;
        });
      })
      .catch(function () { /* keep the versions written in the page */ });
  });
})();
