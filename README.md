# deissmiro.folio

Personal portfolio of Miro Deiss, Senior Product Designer.

Plain static site, no build step. Open `index.html` through any local server:

```
npx serve .
# or
python3 -m http.server
```

## Structure

```
index.html        all views: Work, About, case pages
css/style.css     styles
js/main.js        navigation, lightbox, carousels, before/after slider
js/avatar.js      3D avatar (three.js from CDN)
assets/model.glb  avatar model
assets/fonts/     Ubuntu Mono
assets/img/       screenshots, grouped by case
```

Views are switched by the URL hash: `#work`, `#about`, `#case-home`, `#case-ds`.
