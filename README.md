# IdeaVision

A tiny, retro television-inspired idea tracker built with plain HTML, CSS, and JavaScript. No build step, frameworks, accounts, analytics, or backend.

## Run

Open `index.html` in a modern browser, or serve this directory:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Use a local server for consistent browser storage behavior.

## Features

- Ten generic home/family AI project concepts (not implemented AI features)
- Five official external inspiration links, clearly attributed to their creators
- Add, edit, and delete ideas (deletion asks for confirmation)
- New, Exploring, and Built statuses
- Search, status filters, and JSON export
- Responsive old-school TV styling and labeled keyboard-accessible controls
- Browser-local persistence with a visible warning if storage fails

## Privacy

The public repository contains code and fictional examples only. Ideas you type are stored in your browser's localStorage, not sent to GitHub or another server. There is no synchronization or account isolation: people using the same browser profile and origin can access that storage. Clearing site data removes it. Export JSON to make your own backup. Avoid sensitive information on a shared device. Exported files contain the ideas you entered; share them thoughtfully.

Do not add passwords, API keys, private notes, or personal information to this repository. No runtime dependencies or automatic external network requests are used by this app. External inspiration links open third-party websites with their own privacy practices and age requirements; no idea content is included in those links.

## Saved-data upgrades

This version uses `ideavision.ideas.v2`. On the first visit it copies personal and edited entries from the original v1 storage, replaces only untouched original examples with the new ten concepts, and leaves v1 data as a backup. Deleting an idea in v2 stays deleted on reload. Invalid saved data is not overwritten.

## Development and attribution

This first version was implemented with AI assistance. The commit history records actual changes; no backdated or synthetic activity is intended. This is a small portfolio starter, not evidence of production deployment or a production security audit.

## Checks

Run the dependency-free smoke checks:

```sh
node --check app.js
node test.js
```

The tests exercise initial rendering, create/edit/cancel, filtering, deletion and reload persistence using a minimal DOM harness. They are not a substitute for visual browser testing.
