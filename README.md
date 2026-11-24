# digitalAijaz.github.io

Personal website of Dr. Mohd Aijaz Siddiqui, served by GitHub Pages at https://digitalaijaz.github.io

Plain HTML/CSS/JS, no build step. Theme: "Jade Pebble Morning" (custom; tokens in `assets/style.css`).

- `index.html` – Home
- `experience.html`, `research.html`, `publications.html`, `skills.html` – inner pages
- `apps.html` – "Built for fun": AijazLabs Windows apps. `assets/apps.js` reads the releases of
  [AijazLabs-Installers](https://github.com/digitalAijaz/AijazLabs-Installers) on page load and swaps in the newest
  `<App>-Setup-<version>.exe` for each app (a new app gets a card automatically). The versions written in the page are the
  fallback if GitHub can't be reached; add a description and icon (`assets/apps/<App>.webp`) for new apps when convenient.
- `assets/style.css` – theme, light and dark
- `assets/site.js` – theme toggle, mobile menu, copy-email button, slideshows
- `assets/Aijaz-Siddiqui-CV.pdf` – public CV (source: `D:\Aijaz\CV\Website CV.html`)

To change the menu, edit the `<nav>` block in each of the six pages.

The Home slideshow lists every figure, video and photo on the site; when adding media to other pages, add a slide there too.
