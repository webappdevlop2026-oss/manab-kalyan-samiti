# মানব কল্যাণ সমিতি

Bengali festival website for Manab Kalyan Samiti, Ranjan Bazar, Daspara, Dubrajpur, Birbhum. Established 2003.

## Run

Run `node scripts/build.mjs` with Node.js 22 or later, then serve the output using `python3 -m http.server 8000 --directory dist`. The source `index.html` also opens directly with the two original album photos. Google Fonts is optional and the page falls back to a system font.

## Content

- The homepage features the supplied decorated-temple image.
- The festival memories gallery shows the supplied decorated-temple image and the earlier temple photo. The festival artwork is linked separately from the committee section.
- The homepage and gallery photo links open a full-image viewer where supported. Each link also works as a direct image URL.
- Add confirmed festival dates and times to the schedule and the confirmed broadcast link to the announcements section in `index.html`.
- The map link uses the locality as its destination. Update it if a verified venue pin is provided.
- Sharing uses native sharing or the clipboard where supported, with a selectable link as a fallback. It appears when the page is served over HTTP or HTTPS.

## Add Puja photos

Follow the [upload instructions](photos/README.md). The album includes every supported image directly under `photos/` and in its four-digit year folders. It uses the file name as the caption and lists the most recent years first. The featured slider uses the selected photos in `index.html`.

## Hosting

Vercel runs the build defined in `vercel.json` and publishes `dist/`. For a manual static upload, publish the contents of `dist/` together.
