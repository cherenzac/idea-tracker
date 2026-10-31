# IdeaVision

A tiny, retro television-inspired idea tracker built with plain HTML, CSS, and JavaScript. No build step, frameworks, accounts, analytics, or backend.

## Run

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use a local server for consistent browser storage behavior.

## Features

- Eleven generic home/family AI project concepts (not implemented AI features)
- Five official external inspiration links, clearly attributed to their creators
- Add, edit, and delete ideas (deletion asks for confirmation)
- New, Exploring, and Built statuses
- Search, status filters, and JSON export
- Responsive old-school TV styling and labeled keyboard-accessible controls
- Browser-local persistence with a visible warning if storage fails

## Privacy

The public repository contains code and fictional examples only. Ideas you type are stored in your browser's localStorage, not sent to GitHub or another server. There is no synchronization or account isolation: people using the same browser profile and origin can access that storage. Clearing site data removes it. Export JSON to make your own backup. Avoid sensitive information on a shared device. Exported files contain the ideas you entered; share them thoughtfully.

Do not add passwords, API keys, private notes, or personal information to this repository. The notebook has no runtime dependencies or automatic external network requests. The optional X preview described below is loaded only on request. External inspiration links open third-party websites with their own privacy practices and age requirements; no idea content is included in those links.

## Saved-data upgrades

This version uses `ideavision.ideas.v3`. Returning v2 visitors receive one new concept, **Toybox Tales**, while keeping all existing entries, edits and deletions. The prior v2 data is left unchanged as a backup. The addition happens once; deleting the new idea stays deleted on reload. Earlier v1 data still migrates while retaining personal and edited entries. Invalid saved data is never overwritten.

Toybox Tales is a project concept, not a working AI generator: choose three pretend toys and imagine a short, adult-reviewed puppet-show script. It requires no names, photos or recordings.

## Development and attribution

This first version was implemented with AI assistance. The commit history records actual changes; no backdated or synthetic activity is intended. This is a small portfolio starter, not evidence of production deployment or a production security audit.

## Checks

Run the dependency-free smoke checks:

```sh
node --check app.js
node test.js
node --check channels.js
node test-channels.js
```

The tests exercise initial rendering, create/edit/cancel, filtering, deletion and reload persistence using a minimal DOM harness. They are not a substitute for visual browser testing.

## Live AI News channel (incremental preview)

Keyboard-accessible TV tabs preserve the notebook and add a **setup-pending** news screen. No X account is connected, no headlines are seeded, and no scheduled refresh is running. Visitors can explicitly request an official X public-profile widget; a direct profile link remains available when embeds are unavailable. No private following feed is exposed. Switching tabs does not erase edits or stored ideas.

The optional widget is a third-party runtime dependency loaded only after the visitor submits a public handle. This is the exception to the notebook's no-external-request behavior: X receives normal browser request information and may use cookies. `dnt: true` is passed to the official widget but is not a promise of zero tracking. No notebook data is included. Clearing the preview removes its content; reload to unload the script. No handle or OAuth credential is persisted. No automatic reload or freshness timestamp is claimed.

A reliable 4–5-hour refresh needs a legitimate backend/scheduler, official X API access, an approved public source list and budget, with secrets kept outside public code. An authenticated personal following feed would need a private interface and scoped OAuth. Do not put API tokens in static JavaScript or GitHub commits.

Official references: [embeds](https://help.x.com/en/using-x/embed-x-feed), [API pricing](https://docs.x.com/x-api/getting-started/pricing), [timelines](https://docs.x.com/x-api/posts/timelines/introduction).

## Brick Word studio

The third TV channel converts a word or short phrase into LEGO-style **lettering** with colored bricks and studs. This is deterministic, browser-local canvas typography, not an AI model that generates objects from prompts. Up to 24 Unicode code points are rendered using installed fonts; unsupported characters may display fallback glyphs. Choose three palettes, try presets, and download a 1400×900 PNG. No user text is sent to a service or saved, and no API key is needed. LEGO is a trademark of the LEGO Group; this independent experiment is not affiliated with or endorsed by it.

Additional checks: `node --check brickword.js && node test-brickword.js`. Existing notebook storage/version and news behavior are unchanged.
