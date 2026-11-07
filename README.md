# মানব কল্যাণ সমিতি

Bengali festival website for Manab Kalyan Samiti, Ranjan Bazar, Daspara, Dubrajpur, Birbhum. Established 2003.

## Run

Open `index.html`, or serve this folder using `python3 -m http.server 8000`. The site requires no build step. Google Fonts is optional and the page falls back to a system font.

## Content

- The festival banner uses the Kali artwork from the earlier homepage, cropped to the artwork.
- The gallery includes the temple photograph recovered from the repository and identifies the festival artwork separately.
- Add confirmed festival dates and times to the schedule and the confirmed broadcast link to the announcements section in `index.html`.
- The map link uses the locality as its destination. Update it if a verified venue pin is provided.
- Sharing uses native sharing or the clipboard where supported, with a selectable link as a fallback. It appears when the page is served over HTTP or HTTPS.

## Hosting

Publish `index.html`, `styles.css`, `site.js`, and `assets/` together. For GitHub Pages, use the root folder of the deployment branch in Settings → Pages.
